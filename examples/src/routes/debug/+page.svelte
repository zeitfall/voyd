<script lang="ts">
    import { onMount,onDestroy } from 'svelte';

    import {
        GPUContext,
        VertexBuffer,
        VertexBufferLayout,
        IndexBuffer,
        RenderBundle,
        InputManager,
        KeyboardDevice,
        PointerDevice,
        Vector3,
        Quaternion,
        PlaneGeometry,
        SceneNode,
        PerspectiveCamera
    } from 'voyd';

    import { CanvasResizer } from '$lib/services';

    let canvasElement: HTMLCanvasElement;
    let canvasContext: GPUCanvasContext;
    let canvasResizer: CanvasResizer;

    const keyboardDevice = new KeyboardDevice();
	const pointerDevice = new PointerDevice();

    InputManager
        .registerDevice(keyboardDevice)
        .registerDevice(pointerDevice);

    const rootNode = new SceneNode();

    const camera = new PerspectiveCamera();
    const cameraNode = new SceneNode();

    cameraNode.addComponent(camera)
    cameraNode.attachTo(rootNode);
    cameraNode.transform.position.set(0, 1, -1);
    cameraNode.transform.lookAt(new Vector3(0, 0, 0));
    cameraNode.transform.update();

    const geometry = new PlaneGeometry(1, 1, 32, 32);

    const vertexBuffer = VertexBuffer.fromGeometry(geometry, 0, true);
    const vertexBufferLayout = VertexBufferLayout.fromGeometry(geometry);

    const indexBuffer = new IndexBuffer(geometry.indices, 0, true);

    let depthTexture: GPUTexture;

    const bindGroupLayout = GPUContext.device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer: {
                    type: 'uniform'
                }
            },
            {
                binding: 1,
                visibility: GPUShaderStage.VERTEX,
                buffer: {
                    type: 'uniform'
                }
            }
        ]
    });

    const bindGroup = GPUContext.device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: camera.viewMatrixBuffer.instance,
                }
            },
            {
                binding: 1,
                resource: {
                    buffer: camera.projectionMatrixBuffer.instance
                }
            }
        ]
    });

    const renderShader = GPUContext.device.createShaderModule({
        code: `
            struct VSIn {
                @location(0) position: vec3f,
                @location(1) normal: vec3f,
                @location(2) uv: vec2f
            }

            struct VSOut {
                @builtin(position) position: vec4f,
                @location(0) vertex: vec3f,
                @location(1) normal: vec3f,
                @location(2) uv: vec2f
            }

            @group(0) @binding(0) var<uniform> view_matrix: mat4x4f;
            @group(0) @binding(1) var<uniform> projection_matrix: mat4x4f;

            @vertex
            fn vs(input: VSIn) -> VSOut {
                var out: VSOut;

                out.position = projection_matrix * view_matrix * vec4f(input.position, 1);
                out.vertex = input.position;
                out.normal = input.normal;
                out.uv = input.uv;

                return out;
            }

            @fragment
            fn fs(input: VSOut) -> @location(0) vec4f {
                var vertex_color = 1 - smoothstep(0, 1, 4 * input.vertex.z);
                // var vertex_color = 1f;

                return vec4f(vec3f(vertex_color), 1);
            }
        `,
    });

    const renderPipelineLayout = GPUContext.device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] });

    const renderPipeline = GPUContext.device.createRenderPipeline({
        layout: renderPipelineLayout,
        vertex: {
            module: renderShader,
            entryPoint: 'vs',
            buffers: [vertexBufferLayout],
        },
        fragment: {
            module: renderShader,
            entryPoint: 'fs',
            targets: [
                {
                    format: GPUContext.preferredFormat
                }
            ]
        },
        depthStencil: {
            depthWriteEnabled: true,
            depthCompare: 'less',
            format: 'depth24plus'
        },
        primitive: {
            topology: geometry.topology
        }
    });

    const renderBundle = new RenderBundle(
        (encoder) => {
            encoder.setPipeline(renderPipeline);
            encoder.setBindGroup(0, bindGroup);
            encoder.setVertexBuffer(0, vertexBuffer.instance);
            encoder.setIndexBuffer(indexBuffer.instance, 'uint16');
            encoder.drawIndexed(geometry.indices.length);
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
                clearValue: [0, 0, 0, 1],
                loadOp: 'clear',
                storeOp: 'store'
            }
        ],
        depthStencilAttachment: {
            view: undefined,
            depthClearValue: 1,
            depthLoadOp: 'clear',
            depthStoreOp: 'store'
        }
    };

    function handleCanvasResize() {
        if (depthTexture) {
            depthTexture.destroy();
        }

        depthTexture = GPUContext.device.createTexture({
            size: [canvasElement.width, canvasElement.height],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
    }

    let rafId: number;
    let t0 = 0;
    let t1 = 0;

    function loop() {
        // Very silly
        if (!depthTexture) {
            rafId = requestAnimationFrame(loop);

            return;
        }

        t1 = performance.now();

        const deltaTime = (t1 - t0) / 1000;

        InputManager.update();
        camera.setAspectRatio(canvasElement.width / canvasElement.height);

        rootNode.update(deltaTime);

        const commandEncoder = GPUContext.device.createCommandEncoder();

        // @ts-expect-error Property '0' does not exist on type 'Iterable<GPURenderPassColorAttachment>'.
        renderPassDescriptor.colorAttachments[0].view = canvasContext.getCurrentTexture().createView();
        renderPassDescriptor.depthStencilAttachment.view = depthTexture.createView();

        const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);

        renderPass.executeBundles([renderBundle.instance]);
        renderPass.end();

        const commandBuffer = commandEncoder.finish();

        GPUContext.device.queue.submit([commandBuffer]);

        rafId = requestAnimationFrame(loop);

        t0 = t1;
    }

    onMount(() => {
        canvasElement.addEventListener('resize', handleCanvasResize);
        canvasElement.addEventListener('contextmenu', (event) => event.preventDefault());

        canvasContext = canvasElement.getContext('webgpu');
        canvasResizer = new CanvasResizer(canvasElement);

        canvasContext.configure({
            device: GPUContext.device,
            format: GPUContext.preferredFormat,
        });

        rafId = requestAnimationFrame(loop);
    });

    onDestroy(() => {
        canvasElement.removeEventListener('resize', handleCanvasResize);

		InputManager.unregisterAllDevices();

        cancelAnimationFrame(rafId);
    });
</script>

<canvas bind:this={canvasElement}></canvas>