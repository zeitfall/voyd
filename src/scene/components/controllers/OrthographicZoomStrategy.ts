import { EPSILON_4 } from '~/constants';

import type { SceneNode, OrthographicCamera } from '~/scene';
import type { ZoomStrategy } from '~/types';

const MAX_SAFE_SCALE_IN = 10000;
const MAX_SAFE_SCALE_OUT = EPSILON_4;

class OrthographicZoomStrategy implements ZoomStrategy {
    #camera: OrthographicCamera;

    #initialLeftPlane: number;
    #initialRightPlane: number;
    #initialTopPlane: number;
    #initialBottomPlane: number;

    constructor(camera: OrthographicCamera) {
        this.#camera = camera;

        this.#initialLeftPlane = camera.leftPlane;
        this.#initialRightPlane = camera.rightPlane;
        this.#initialTopPlane = camera.topPlane;
        this.#initialBottomPlane = camera.bottomPlane;
    }

    get maxSafeZoomIn() {
        return MAX_SAFE_SCALE_IN;
    }

    get maxSafeZoomOut() {
        return MAX_SAFE_SCALE_OUT;
    }

    apply(_node: SceneNode, zoomLevel: number) {
        if (zoomLevel === 0) {
            return;
        }

        const inverseZoomLevel = 1 / zoomLevel;

        this.#camera
            .setLeftPlane(this.#initialLeftPlane * inverseZoomLevel)
            .setRightPlane(this.#initialRightPlane * inverseZoomLevel)
            .setTopPlane(this.#initialTopPlane * inverseZoomLevel)
            .setBottomPlane(this.#initialBottomPlane * inverseZoomLevel);
    }
}

export default OrthographicZoomStrategy;
