<script lang="ts">
    import {
        GPUContext,
        UniformBuffer,
        VertexBuffer,
        VertexBufferLayout,
        IndexBuffer,
        RenderBundle,
        Vector3,
        Quaternion,
        PerspectiveCamera,
        SphereGeometry,
        SceneNode,
    } from 'voyd';
    import { CanvasResizer } from '$lib/services';

    let canvasElement: HTMLCanvasElement;
    let canvasContext: GPUCanvasContext;
    let canvasResizer: CanvasResizer;

    const camera = new PerspectiveCamera(90);
    const cameraNode = new SceneNode();

    camera.setFarPlane(512);
    camera.attachTo(cameraNode);
    cameraNode.transform.position.set(0, 0, -4);

    const geometry = new SphereGeometry(1, 32, 32);

    geometry.setTopology('line-list');

    const vertexBuffer = VertexBuffer.fromGeometry(geometry, 0, true);
    const vertexBufferLayout = VertexBufferLayout.fromGeometry(geometry);

    const indexBuffer = new IndexBuffer(geometry.indices, 0, true);

    const solarSystem = new SceneNode();

    solarSystem.addChild(cameraNode);

    const planetCount = 9;
    const planetOrbits: SceneNode[] = [];
    const planets: SceneNode[] = [];
    const planetRadiuses = [
        0.5,    // Sun
        0.04,   // Mercury
        0.06,   // Venus
        0.065,  // Earth
        0.05,   // Mars
        0.20,   // Jupiter
        0.17,   // Saturn
        0.12,   // Uranus
        0.11    // Neptune
    ];
    const planetColors = new Uint8ClampedArray([
        255, 204, 0, 255,
        153, 153, 153, 255,
        230, 179, 102, 255,
        50, 205, 50, 255,
        204, 77, 26, 255,
        204, 153, 102, 255,
        230, 204, 153, 255,
        102, 204, 230, 255,
        51, 77, 204, 255
    ]);

    const planetColorsBuffer = new VertexBuffer(planetColors, 0, true);

    const planetTransformsView = new Float32Array(16 * planetCount);
    const planetTransformsBuffer = new UniformBuffer(planetTransformsView, GPUBufferUsage.COPY_DST);

    for (let i = 0; i < planetCount; i++) {
        const planetOrbit = new SceneNode();
        const planet = new SceneNode();
        const planetTransform = planet.transform;
        const planetRadius = 10 * planetRadiuses[i];

        planetTransform.position.setX(4 * i);
        planetTransform.scale.setLength(planetRadius);

        planet.attachTo(planetOrbit);
        planetOrbit.attachTo(solarSystem);

        planetOrbits.push(planetOrbit);
        planets.push(planet);
    }

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
            {
                binding: 2,
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
                    buffer: camera.viewMatrixBuffer.instance
                }
            },
            {
                binding: 1,
                resource: {
                    buffer: camera.projectionMatrixBuffer.instance,
                }
            },
            {
                binding: 2,
                resource: {
                    buffer: planetTransformsBuffer.instance
                }
            }
        ]
    });

    const renderShader = GPUContext.device.createShaderModule({
        code: `
            struct VertexInput {
                @builtin(instance_index) instance_index: u32,
                @location(0) position: vec3f,
                @location(1) normal: vec3f,
                @location(2) uv: vec2f,
                @location(3) color: vec4f
            }

            struct VertexOutput {
                @builtin(position) position: vec4f,
                @location(0) vertex: vec3f,
                @location(1) normal: vec3f,
                @location(2) uv: vec2f,
                @location(3) color: vec4f
            }

            @group(0) @binding(0) var<uniform> view_matrix: mat4x4f;
            @group(0) @binding(1) var<uniform> projection_matrix: mat4x4f;
            @group(0) @binding(2) var<uniform> transforms: array<mat4x4f, ${planetCount}>;

            @vertex
            fn vs(input: VertexInput) -> VertexOutput {
                var output: VertexOutput;

                var model_matrix = transforms[input.instance_index];

                output.position = projection_matrix * view_matrix * model_matrix * vec4f(input.position, 1);
                output.vertex = input.position;
                output.normal = input.normal;
                output.uv = input.uv;
                output.color = input.color;

                return output;
            }

            @fragment
            fn fs(input: VertexOutput) -> @location(0) vec4f {
                return input.color;
            }
        `
    });

    const renderPipelineLayout = GPUContext.device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] });
    const renderPipeline = GPUContext.device.createRenderPipeline({
        layout: renderPipelineLayout,
        vertex: {
            module: renderShader,
            entryPoint: 'vs',
            buffers: [
                vertexBufferLayout,
                {
                    arrayStride: 4 * planetColors.BYTES_PER_ELEMENT,
                    stepMode: 'instance',
                    attributes: [
                        {
                            shaderLocation: 3,
                            offset: 0,
                            format: 'unorm8x4'
                        }
                    ]
                }
            ]
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
            topology: geometry.topology
        }
    });

    const renderBundle = new RenderBundle((encoder) => {
        encoder.setPipeline(renderPipeline);
        encoder.setBindGroup(0, bindGroup);
        encoder.setVertexBuffer(0, vertexBuffer.instance);
        encoder.setVertexBuffer(1, planetColorsBuffer.instance);
        encoder.setIndexBuffer(indexBuffer.instance, geometry.indexFormat);
        encoder.drawIndexed(geometry.indices.length, planetCount);
    }, { colorFormats: [GPUContext.preferredFormat] });

    const renderPassDesciptor: GPURenderPassDescriptor = {
        colorAttachments: [
            {
                loadOp: 'clear',
                storeOp: 'store',
                clearValue: [0, 0, 0, 1],
                view: undefined
            }
        ]
    };

    let t0 = 0;
    let t1 = 0;
    let rafId: number;

    const _rotationAxis = new Vector3(0, 1, 0);
    const _rotationQuaternion = new Quaternion();

    function loop() {
        t1 = performance.now();

        const deltaTime = (t1 - t0) / 1000;

        camera.setAspectRatio(canvasElement.width / canvasElement.height);

        for (let i = 0; i < planetCount; i++) {
            const planetOrbitTransform = planetOrbits[i].transform;
            const planetTransform = planets[i].transform;

            if (i > 0) {
                const rotationSpeed = 10 * deltaTime / Math.pow(planetTransform.position.length, 1.5);

                _rotationQuaternion.setFromAxisAngle(_rotationAxis, rotationSpeed).normalize();
                planetOrbitTransform.rotation.multiply(_rotationQuaternion);
            }

            _rotationQuaternion.setFromAxisAngle(_rotationAxis, deltaTime).normalize();
            planetTransform.rotation.multiply(_rotationQuaternion);  
        }

        solarSystem.update();

        for (let i = 0; i < planetCount; i++) {
            const planet = planets[i];

            planetTransformsView.set(planet.transform.worldMatrix.elements, 16 * i);
        }

        GPUContext.device.queue.writeBuffer(planetTransformsBuffer.instance, 0, planetTransformsView);

        const commandEncoder = GPUContext.device.createCommandEncoder();

        // @ts-expect-error Property '0' does not exist on type 'Iterable<GPURenderPassColorAttachment>'.
        renderPassDesciptor.colorAttachments[0].view = canvasContext.getCurrentTexture().createView();

        const renderPass = commandEncoder.beginRenderPass(renderPassDesciptor);

        renderPass.executeBundles([renderBundle.instance]);
        renderPass.end();

        const commandBuffer = commandEncoder.finish();

        GPUContext.device.queue.submit([commandBuffer]);

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

        rafId = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(rafId);
    });
</script>

<canvas bind:this={canvasElement}></canvas>
