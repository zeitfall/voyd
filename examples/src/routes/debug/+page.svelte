<canvas bind:this={canvasElement}></canvas>

<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { CanvasResizer } from '$lib/services';
    
	import { getGPUContext } from '$lib/contexts/gpu';
    import {
        SceneNode,
        PerspectiveCamera,
        OrthographicCamera,
        FlyController,
        FreeLookController,
        ZoomController,
        DollyZoomStrategy,
        FOVZoomStrategy,
        OrthographicZoomStrategy,
        InputAction,
        InputSingleBinding,
        InputManager,
        KeyboardDevice,
        PointerDevice,
        InterleavedBuffer,
        StandardBufferAttribute,
        createRenderBundle,
        createUniformBuffer,
        createVertexBuffer,
        createIndexBuffer,
        generatePlaneVertices,
        generateSphereVertices,
        computeTriangleListNormals,
        generatePointListIndices,
        generateLineListIndices,
        generateTriangleListIndices,
        InputControlType,
        InputDeviceType
    } from 'voyd';

    const gpuContext = getGPUContext();

    let canvasElement: HTMLCanvasElement;
    let canvasContext: GPUCanvasContext;
    let canvasResizer: CanvasResizer;

    let depthTexture: GPUTexture;

    // PLANE
    const planeVertices = generatePlaneVertices(32, 32, 32, 32);
    const planeIndices = generateTriangleListIndices(32, 32);
    const planeNormals = computeTriangleListNormals(planeVertices, planeIndices);

    const planeInterleavedVertexBuffer = new InterleavedBuffer([
        new StandardBufferAttribute('float32x3', planeVertices),
        new StandardBufferAttribute('float32x3', planeNormals)
    ]);
    const planeVertexBuffer = createVertexBuffer(gpuContext.device, planeInterleavedVertexBuffer.data);
    const planeIndexBuffer = createIndexBuffer(gpuContext.device, planeIndices);

    // SPHERE
    const sphereVertices = generateSphereVertices(4, 32, 32);
    const sphereIndices = generateTriangleListIndices(32, 32);
    const sphereNormals = computeTriangleListNormals(sphereVertices, sphereIndices);

    const sphereInterleavedVertexBuffer = new InterleavedBuffer([
        new StandardBufferAttribute('float32x3', sphereVertices),
        new StandardBufferAttribute('float32x3', sphereNormals)
    ]);
    const sphereVertexBuffer = createVertexBuffer(gpuContext.device, sphereInterleavedVertexBuffer.data);
    const sphereIndexBuffer = createIndexBuffer(gpuContext.device, sphereIndices);

    const rootSceneNode = new SceneNode();

    const cameraPivotNode = new SceneNode();
    const cameraNode = new SceneNode();
    const camera = new PerspectiveCamera();
    const cameraViewMatrixBuffer = createUniformBuffer(gpuContext.device, camera.viewMatrix.array, GPUBufferUsage.COPY_DST);
    const cameraProjectionMatrixBuffer = createUniformBuffer(gpuContext.device, camera.projectionMatrix.array, GPUBufferUsage.COPY_DST);

    const flyController = new FlyController();
    const freeLookController = new FreeLookController();

    const zoomStrategy = new FOVZoomStrategy(camera);
    const zoomController = new ZoomController(zoomStrategy);

    cameraPivotNode
        .attachTo(rootSceneNode)
        .addComponent(flyController)
        .addComponent(freeLookController);

    cameraNode.transform.position.set(0, 0, -16);
    cameraNode.transform.update();

    cameraNode
        .attachTo(cameraPivotNode)
        .addComponent(camera)
        .addComponent(zoomController);
    
    const renderShader = gpuContext.device.createShaderModule({
        code: `
            struct VertexStageInput {
                @location(0) vertex_position : vec3f,
                @location(1) vertex_normal   : vec3f, 
            }

            struct VertexStageOutput {
                @builtin(position)              vertex_position : vec4f,
                @location(0) @interpolate(flat) vertex_normal   : vec3f,
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

                var light_source_position = normalize(vec3f(1, .25, 0));

                var ambient_light = 0.25;
                var diffuse_light = max(dot(input.vertex_normal, light_source_position), 0.0);

                var base_color  = vec3f(0, 0.65, 0.42); 
                var final_color = base_color * (ambient_light + diffuse_light);

                output.fragment_color = vec4f(final_color, 1.0);

                return output;
            }
        `
    });

    const renderBindGroupLayout = gpuContext.device.createBindGroupLayout({
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

    const renderBindGroup = gpuContext.device.createBindGroup({
        layout: renderBindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: cameraViewMatrixBuffer
                }
            },
            {
                binding: 1,
                resource: {
                    buffer: cameraProjectionMatrixBuffer
                }
            }
        ]
    });

    const renderPipelineLayout = gpuContext.device.createPipelineLayout({
        bindGroupLayouts: [renderBindGroupLayout]
    });

    const renderPipeline = gpuContext.device.createRenderPipeline({
        layout: renderPipelineLayout,
        vertex: {
            module: renderShader,
            entryPoint: 'vertex_stage',
            buffers: [
                {
                    arrayStride: 24,
                    stepMode: 'vertex',
                    attributes: [
                        {
                            shaderLocation: 0,
                            format: 'float32x3',
                            offset: 0
                        },
                        {
                            shaderLocation: 1,
                            format: 'float32x3',
                            offset: 12
                        }
                    ]
                }
            ]
        },
        fragment: {
            module: renderShader,
            entryPoint: 'fragment_stage',
            targets: [{ format: gpuContext.preferredFormat }]
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

    const planeRenderBundle = createRenderBundle(
        gpuContext.device,
        (encoder) => {
            encoder.setPipeline(renderPipeline);
            encoder.setBindGroup(0, renderBindGroup);
            encoder.setVertexBuffer(0, planeVertexBuffer);
            encoder.setIndexBuffer(planeIndexBuffer, 'uint16');
            encoder.drawIndexed(planeIndices.length);
        },
        {
            colorFormats: [gpuContext.preferredFormat],
            depthStencilFormat: 'depth24plus'
        }
    );

    const sphereRenderBundle = createRenderBundle(
        gpuContext.device,
        (encoder) => {
            encoder.setPipeline(renderPipeline);
            encoder.setBindGroup(0, renderBindGroup);
            encoder.setVertexBuffer(0, sphereVertexBuffer);
            encoder.setIndexBuffer(sphereIndexBuffer, 'uint16');
            encoder.drawIndexed(sphereIndices.length);
        },
        {
            colorFormats: [gpuContext.preferredFormat],
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
        gpuContext.device.queue.writeBuffer(cameraViewMatrixBuffer, 0, camera.viewMatrix.array);
        gpuContext.device.queue.writeBuffer(cameraProjectionMatrixBuffer, 0, camera.projectionMatrix.array);

        const commandEncoder = gpuContext.device.createCommandEncoder();

        // @ts-expect-error Property '0' does not exist on type 'Iterable<GPURenderPassColorAttachment>'.
        renderPassDescriptor.colorAttachments[0].view = canvasContext.getCurrentTexture().createView();
        renderPassDescriptor.depthStencilAttachment.view = depthTexture.createView();

        const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);

        renderPass.executeBundles([planeRenderBundle, sphereRenderBundle]);
        renderPass.end();

        const commandBuffer = commandEncoder.finish();

        gpuContext.device.queue.submit([commandBuffer]);

        rafId = requestAnimationFrame(updateLoop);
    }

    InputManager.registerDevice(new KeyboardDevice());

    onMount(async () => {
        canvasContext = canvasElement.getContext('webgpu');
        canvasResizer = new CanvasResizer(canvasElement);

        canvasContext.configure({
            device: gpuContext.device,
            format: gpuContext.preferredFormat
        });

        canvasElement.addEventListener('resize', () => {
            if (depthTexture) {
                depthTexture.destroy();
            }

            depthTexture = gpuContext.device.createTexture({
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
