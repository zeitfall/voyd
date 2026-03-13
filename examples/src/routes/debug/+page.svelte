<canvas bind:this={canvasElement}></canvas>

<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { CanvasResizer } from '$lib/services';
    
    import {
        GPUContext,
        SceneNode,
        PerspectiveCamera,
        FlyController,
        FreeLookController,
        InputManager,
        KeyboardDevice,
        PointerDevice,
        BufferAttribute,
        createRenderBundle,
        createVertexBuffer,
        createIndexBuffer,
        createInterleavedBuffer,
        generatePlaneVertexData,
        generateSphereVertexData,
        generatePointListIndices,
        generateLineListIndices,
        generateTriangleListIndices,
    } from 'voyd';

    let canvasElement: HTMLCanvasElement;
    let canvasContext: GPUCanvasContext;
    let canvasResizer: CanvasResizer;
    
    let depthTexture: GPUTexture;

    const shapeVertexData = generateSphereVertexData(4, 32, 32);
    const shapeIndices = generateTriangleListIndices(32, 32);

    const interleavedVertexBuffer = createInterleavedBuffer([
        new BufferAttribute('float32x3', shapeVertexData.positions),
        new BufferAttribute('float32x3', shapeVertexData.normals),
        new BufferAttribute('float32x2', shapeVertexData.uvs)
    ]);
    const vertexBuffer = createVertexBuffer(interleavedVertexBuffer);
    const indexBuffer = createIndexBuffer(shapeIndices);

    const rootSceneNode = new SceneNode();

    const cameraNode = new SceneNode();
    const camera = new PerspectiveCamera();
    
    cameraNode.transform.position.set(0, 0, -8);
    // cameraNode.transform.lookAt(0, 0, 0);
    cameraNode.transform.update();

    cameraNode.attachTo(rootSceneNode);
    cameraNode.addComponent(camera);
    cameraNode.addComponent(new FlyController());
    cameraNode.addComponent(new FreeLookController());

    InputManager.registerDevice(new KeyboardDevice());

    const renderShader = GPUContext.device.createShaderModule({
        code: `
            struct VertexStageInput {
                @location(0) vertex_position : vec3f,
                @location(1) vertex_normal   : vec3f, 
            }

            struct VertexStageOutput {
                @builtin(position) vertex_position : vec4f,
                @location(0) vertex_normal         : vec3f, 
            }

            struct FragmentStageOutput {
                @location(0) fragment_color : vec4f
            }

            @group(0) @binding(0) var<uniform> camera_view       : mat4x4f;
            @group(0) @binding(1) var<uniform> camera_projection : mat4x4f;

            @vertex
            fn vertex_stage(input : VertexStageInput) -> VertexStageOutput {
                var output : VertexStageOutput;

                output.vertex_position = camera_projection * camera_view * vec4f(input.vertex_position, 1);
                output.vertex_normal   = input.vertex_normal;

                return output;
            }

            @fragment
            fn fragment_stage(input : VertexStageOutput) -> FragmentStageOutput {
                var output : FragmentStageOutput;

                var light_source_position = normalize(vec3f(4, 1, -2));

                var ambient_light = 0.25;
                var diffuse_light = max(dot(input.vertex_normal, light_source_position), 0.0);

                var base_color  = vec3f(0, 0.65, 0.42); 
                var final_color = base_color * (ambient_light + diffuse_light);

                output.fragment_color = vec4f(final_color, 1.0);

                return output;
            }
        `
    });

    const renderBindGroupLayout = GPUContext.device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer: { type: 'uniform' }
            },
            {
                binding: 1,
                visibility: GPUShaderStage.VERTEX,
                buffer: { type: 'uniform' }
            }
        ]
    });

    const renderBindGroup = GPUContext.device.createBindGroup({
        layout: renderBindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: camera.viewMatrixBuffer
                }
            },
            {
                binding: 1,
                resource: {
                    buffer: camera.projectionMatrixBuffer
                }
            }
        ]
    });

    const renderPipelineLayout = GPUContext.device.createPipelineLayout({
        bindGroupLayouts: [renderBindGroupLayout]
    });

    const renderPipeline = GPUContext.device.createRenderPipeline({
        layout: renderPipelineLayout,
        vertex: {
            module: renderShader,
            entryPoint: 'vertex_stage',
            buffers: [
                {
                    arrayStride: 8 * Float32Array.BYTES_PER_ELEMENT,
                    attributes: [
                        {
                            shaderLocation: 0,
                            offset: 0,
                            format: 'float32x3'
                        },
                        {
                            shaderLocation: 1,
                            offset: 3 * Float32Array.BYTES_PER_ELEMENT,
                            format: 'float32x3'
                        },
                        {
                            shaderLocation: 2,
                            offset: 6 * Float32Array.BYTES_PER_ELEMENT,
                            format: 'float32x2'
                        }
                    ]
                }
            ]
        },
        fragment: {
            module: renderShader,
            entryPoint: 'fragment_stage',
            targets: [{ format: GPUContext.preferredFormat }]
        },
        primitive: {
            topology: 'triangle-list',
            cullMode: 'back'
        },
        depthStencil: {
            format: 'depth24plus',
            depthWriteEnabled: true,
            depthCompare: 'less'
        }
    });

    const renderBundle = createRenderBundle(
        (encoder) => {
            encoder.setPipeline(renderPipeline);
            encoder.setBindGroup(0, renderBindGroup);
            encoder.setVertexBuffer(0, vertexBuffer);
            encoder.setIndexBuffer(indexBuffer, 'uint16');
            encoder.drawIndexed(shapeIndices.length);
        },
        {
            colorFormats: [GPUContext.preferredFormat],
            depthStencilFormat: 'depth24plus'
        }
    );

    const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
            {
                view: undefined,
                clearValue: [0.65, 0.85, 1, 1],
                loadOp: 'clear',
                storeOp: 'store',
            }
        ],
        depthStencilAttachment: {
            view: undefined,
            depthClearValue: 1,
            depthLoadOp: 'clear',
            depthStoreOp: 'store',
        },
    };

    let rafId = requestAnimationFrame(updateLoop);
    let rafTime = 0;

    function updateLoop(currentTimestamp: number) {
        if (!depthTexture) {
            rafId = requestAnimationFrame(updateLoop);

            return;
        }

        const deltaTime = rafTime ? currentTimestamp - rafTime : 0;
        const deltaTimeMs = deltaTime / 1000;

        rafTime = currentTimestamp;

        InputManager.update();
        rootSceneNode.update(deltaTimeMs);

        camera.setAspectRatio(canvasElement.width / canvasElement.height);

        const commandEncoder = GPUContext.device.createCommandEncoder();

        // @ts-expect-error Property '0' does not exist on type 'Iterable<GPURenderPassColorAttachment>'.
        renderPassDescriptor.colorAttachments[0].view = canvasContext.getCurrentTexture().createView();
        renderPassDescriptor.depthStencilAttachment.view = depthTexture.createView();

        const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);

        renderPass.executeBundles([renderBundle]);
        renderPass.end();

        const commandBuffer = commandEncoder.finish();

        GPUContext.device.queue.submit([commandBuffer]);

        rafId = requestAnimationFrame(updateLoop);
    }

    onMount(async () => {
        canvasContext = canvasElement.getContext('webgpu');
        canvasResizer = new CanvasResizer(canvasElement);

        canvasContext.configure({
            device: GPUContext.device,
            format: GPUContext.preferredFormat
        });

        canvasElement.addEventListener('resize', () => {
            if (depthTexture) {
                depthTexture.destroy();
            }

            depthTexture = GPUContext.device.createTexture({
                size: [canvasElement.width, canvasElement.height],
                format: 'depth24plus',
                usage: GPUTextureUsage.RENDER_ATTACHMENT
            });
        });

        InputManager.registerDevice(new PointerDevice(canvasElement));
    });

    onDestroy(() => {
        InputManager.unregisterAllDevices();

        cancelAnimationFrame(rafId);
    });
</script>
