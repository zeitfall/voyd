<script lang="ts">
    import {
        GPUContext,
        VertexBuffer,
        VertexBufferLayout,
        IndexBuffer,
        PlaneGeometry,
        SphereGeometry,
        PerspectiveCamera,
        FlyControls,
        OrbitControls,
        ControlsPipeline,
    } from 'voyd';

    import { CanvasResizer } from '$lib/services';

    let canvasElement: HTMLCanvasElement;
    let canvasContext: GPUCanvasContext;
    let canvasResizer: CanvasResizer;

    // const camera = new OrthographicCamera();
    const camera = new PerspectiveCamera(90);

    camera.position.set(0, 0, -2);
    // camera.target.set(1, -2, 0);

    console.log(camera);

    let controls: ControlsPipeline;

    const geometry = new PlaneGeometry(4, 4, 64, 64);
    // const geometry = new CircleGeometry(1, 4);
    // const geometry = new SphereGeometry(1, 32, 32);

    geometry.setTopology('triangle-list');

    console.log(geometry);

    const vertexBuffer = VertexBuffer.fromGeometry(geometry, 0, true);
    const vertexBufferLayout = VertexBufferLayout.fromGeometry(geometry);

    const indexBuffer = new IndexBuffer(geometry.indices, 0, true);

    const renderShader = GPUContext.device.createShaderModule({
        code: `
            struct VertexInput {
                @location(0) position: vec3f,
                @location(1) normal: vec3f,
                @location(2) uv: vec2f
            }

            struct VertexOutput {
                @builtin(position) position: vec4f,
                @location(0) vertex: vec3f,
                @location(1) normal: vec3f,
                @location(2) uv: vec2f
            }

            @group(0) @binding(0) var<uniform> projection_matrix: mat4x4f;
            @group(0) @binding(1) var<uniform> view_matrix: mat4x4f;

            @vertex
            fn vs(input: VertexInput) -> VertexOutput {
                var output: VertexOutput;

                output.position = projection_matrix * view_matrix * vec4f(input.position, 1);
                output.vertex = input.position;
                output.normal = input.normal;
                output.uv = input.uv;

                return output;
            }

            @fragment
            fn fs(input: VertexOutput) -> @location(0) vec4f {
                var vertex_color = 1 - smoothstep(0, 1, 4 * input.vertex.z);
                // var vertex_color = 1f;

                return vec4f(vec3f(vertex_color), 1);
            }
        `,
    });

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
            },
        ]
    });

    const bindGroup = GPUContext.device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: camera.projectionMatrixBuffer.instance,
                }
            },
            {
                binding: 1,
                resource: {
                    buffer: camera.viewMatrixBuffer.instance
                }
            }
        ]
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
        primitive: {
            topology: geometry.topology,
            // stripIndexFormat: geometry.indexFormat
        }
    });

    const renderBundleEncoder = GPUContext.device.createRenderBundleEncoder({ colorFormats: [GPUContext.preferredFormat] });

    renderBundleEncoder.setPipeline(renderPipeline);
    renderBundleEncoder.setBindGroup(0, bindGroup);
    renderBundleEncoder.setVertexBuffer(0, vertexBuffer.instance);
    renderBundleEncoder.setIndexBuffer(indexBuffer.instance, geometry.indexFormat);
    renderBundleEncoder.drawIndexed(geometry.indices.length);

    const renderBundle = renderBundleEncoder.finish();

    let t0 = 0;
    let t1 = 0;
    let rafId = 0;

    function loop() {
        t1 = performance.now();

        const deltaTime = (t1 - t0) / 1000;

        controls.update(deltaTime);
        camera.setAspectRatio(canvasElement.width / canvasElement.height);
        camera.update();

        const commandEncoder = GPUContext.device.createCommandEncoder();

        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [
                {
                    loadOp: 'clear',
                    storeOp: 'store',
                    clearValue: [0, 0, 0, 1],
                    view: canvasContext.getCurrentTexture().createView()
                }
            ]
        });

        renderPass.executeBundles([renderBundle]);
        renderPass.end();

        GPUContext.device.queue.submit([commandEncoder.finish()]);

        t0 = t1;

        rafId = requestAnimationFrame(loop);
    }

    $effect(() => {
        canvasContext = canvasElement.getContext('webgpu');

        canvasContext.configure({
            device: GPUContext.device,
            format: GPUContext.preferredFormat,
        });

        canvasResizer = new CanvasResizer(canvasElement);

        // controls = new OrbitControls(camera);
        controls = new FlyControls(canvasElement, camera);

        rafId = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(rafId);
    });
</script>

<canvas bind:this={canvasElement}></canvas>
