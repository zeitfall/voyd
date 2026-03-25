import type { SceneNode } from '~/scene';

export interface ZoomStrategy {
    readonly maxSafeZoomIn: number;
    readonly maxSafeZoomOut: number;

    apply(node: SceneNode, zoomLevel: number): void;
}
