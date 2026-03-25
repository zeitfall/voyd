import type { SceneNode, PerspectiveCamera } from '~/scene';
import type { ZoomStrategy } from '~/types';

const MIN_SAFE_FOV = Number.EPSILON;
const MAX_SAFE_FOV = 180 - Number.EPSILON;

class FOVZoomStrategy implements ZoomStrategy {
    #camera: PerspectiveCamera;

    #initialFOV: number;
    #maxSafeZoomIn: number;
    #maxSafeZoomOut: number;

    constructor(camera: PerspectiveCamera) {
        this.#camera = camera;

        const initialFOV = camera.fov;

        this.#initialFOV = initialFOV;
        this.#maxSafeZoomIn = initialFOV / MIN_SAFE_FOV;
        this.#maxSafeZoomOut = initialFOV / MAX_SAFE_FOV;
    }

    get maxSafeZoomIn() {
        return this.#maxSafeZoomIn;
    }

    get maxSafeZoomOut() {
        return this.#maxSafeZoomOut;
    }

    apply(_node: SceneNode, zoomLevel: number) {
        if (zoomLevel !== 0) {
            this.#camera.setFOV(this.#initialFOV / zoomLevel);
        }
    }
}

export default FOVZoomStrategy;
