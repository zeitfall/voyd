import type { Vector3 } from '~/math';
import type { Camera } from '~/cameras';

export interface ControlsPipelineContext {
    readonly camera: Camera,
    readonly deltaPosition: Vector3,
    readonly deltaTarget: Vector3,
    enabled: boolean
}
