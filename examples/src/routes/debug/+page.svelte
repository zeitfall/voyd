<canvas bind:this={canvasElement}></canvas>

<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { CanvasResizer } from '$lib/services';
    
    import {
        GPUContext,
        RenderBundle,
        StandardBufferAttribute,
        InterleavedBufferAttribute,
        SceneNode,
        PerspectiveCamera,
        FlyController,
        FreeLookController,
        InputManager,
        KeyboardDevice,
        PointerDevice,
        createVertexBuffer,
        createIndexBuffer,
    } from 'voyd';

    let canvasElement: HTMLCanvasElement;
    let canvasContext: GPUCanvasContext;
    let canvasResizer: CanvasResizer;

    const vertexBufferByteStride = 3 * Float32Array.BYTES_PER_ELEMENT + 4 * Uint8Array.BYTES_PER_ELEMENT;
    const vertexData = new ArrayBuffer(4 * vertexBufferByteStride);
    const vertexInterleavedBufferAttribute = new InterleavedBufferAttribute(vertexData, ['float32x3', 'uint8x4']);

    vertexInterleavedBufferAttribute
        .set(0, 0, 0, 32)
        .set(0, 0, 1, 0)
        .set(0, 0, 2, 32)
        .set(0, 1, 0, 1)
        .set(0, 1, 1, 0)
        .set(0, 1, 2, 0)
        .set(0, 1, 3, 1);

    vertexInterleavedBufferAttribute
        .set(1, 0, 0, -32)
        .set(1, 0, 1, 0)
        .set(1, 0, 2, 32)
        .set(1, 1, 0, 0)
        .set(1, 1, 1, 1)
        .set(1, 1, 2, 0)
        .set(1, 1, 3, 1);

    vertexInterleavedBufferAttribute
        .set(2, 0, 0, -32)
        .set(2, 0, 1, 0)
        .set(2, 0, 2, -32)
        .set(2, 1, 0, 0)
        .set(2, 1, 1, 0)
        .set(2, 1, 2, 1)
        .set(2, 1, 3, 1);

    vertexInterleavedBufferAttribute
        .set(3, 0, 0, 32)
        .set(3, 0, 1, 0)
        .set(3, 0, 2, -32)
        .set(3, 1, 0, 0)
        .set(3, 1, 1, 0)
        .set(3, 1, 2, 0)
        .set(3, 1, 3, 1);

    const vertexBuffer = createVertexBuffer(vertexData);

    const indexData = new Uint16Array([0, 1, 2, 0, 2, 3]);
    const indexBuffer = createIndexBuffer(indexData);

    const rootSceneNode = new SceneNode();

    const cameraNode = new SceneNode();
    const camera = new PerspectiveCamera();
    
    cameraNode.transform.position.set(0, 1, 0);
    // cameraNode.transform.lookAt(0, 0, 0);
    cameraNode.transform.update();

    cameraNode.attachTo(rootSceneNode);
    cameraNode.addComponent(camera);
    cameraNode.addComponent(new FlyController());
    cameraNode.addComponent(new FreeLookController());

    InputManager
        .registerDevice(new KeyboardDevice())
        .registerDevice(new PointerDevice());

    const renderShader = GPUContext.device.createShaderModule({
        code: `
            struct VertexStageInput {
                @location(0) vertex_position : vec3f,
                @location(1) vertex_color    : vec4u
            }

            struct VertexStageOutput {
                @builtin(position) vertex_position : vec4f,
                @location(0) vertex_color          : vec4f
            }

            struct FragmentStageOutput {
                @location(0) fragment_color : vec4f
            }

            @group(0) @binding(0) var<uniform> camera_view       : mat4x4f;
            @group(0) @binding(1) var<uniform> camera_projection : mat4x4f;

            @vertex
            fn vertex_stage(input : VertexStageInput) -> VertexStageOutput {
                var output : VertexStageOutput;

                var vertex_position = camera_projection * camera_view * vec4f(input.vertex_position, 1);

                output.vertex_position = vertex_position;
                output.vertex_color    = vec4f(input.vertex_color);

                return output;
            }

            @fragment
            fn fragment_stage(input : VertexStageOutput) -> FragmentStageOutput {
                var output : FragmentStageOutput;

                output.fragment_color = vec4f(input.vertex_color);

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
                    arrayStride: vertexBufferByteStride,
                    attributes: [
                        {
                            shaderLocation: 0,
                            offset: 0,
                            format: 'float32x3'
                        },
                        {
                            shaderLocation: 1,
                            offset: 3 * Float32Array.BYTES_PER_ELEMENT,
                            format: 'uint8x4'
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
            cullMode: 'back'
        }
    });

    const renderBundle = new RenderBundle(
        (encoder) => {
            encoder.setPipeline(renderPipeline);
            encoder.setBindGroup(0, renderBindGroup);
            encoder.setVertexBuffer(0, vertexBuffer);
            encoder.setIndexBuffer(indexBuffer, 'uint16');
            encoder.drawIndexed(indexData.length);
        },
        { colorFormats: [GPUContext.preferredFormat] }
    );

    const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
            {
                view: undefined,
                clearValue: [0.65, 0.85, 1, 1],
                loadOp: 'clear',
                storeOp: 'store',
            }
        ]
    };

    let rafId = requestAnimationFrame(updateLoop);
    let rafTime = 0;

    function updateLoop(currentTimestamp: number) {
        const deltaTime = rafTime ? currentTimestamp - rafTime : 0;
        const deltaTimeMs = deltaTime / 1000;

        rafTime = currentTimestamp;

        InputManager.update();
        rootSceneNode.update(deltaTimeMs);

        camera.setAspectRatio(canvasElement.width / canvasElement.height);

        const commandEncoder = GPUContext.device.createCommandEncoder();

        // @ts-expect-error Property '0' does not exist on type 'Iterable<GPURenderPassColorAttachment>'.
        renderPassDescriptor.colorAttachments[0].view = canvasContext.getCurrentTexture().createView();

        const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);

        renderPass.executeBundles([renderBundle.instance]);
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
    });

    onDestroy(() => {
        InputManager.unregisterAllDevices();

        cancelAnimationFrame(rafId);
    });
</script>
