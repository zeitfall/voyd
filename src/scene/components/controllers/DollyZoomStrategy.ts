import { clamp } from '~/utils';

import { EPSILON_2 } from '~/constants';

import type { SceneNode } from '~/scene';
import type { ZoomStrategy } from '~/types';

const MIN_SAFE_DISTANCE = EPSILON_2;
const MAX_SAFE_DISTANCE = 10000;

class DollyZoomStrategy implements ZoomStrategy {
    #initialDistance: number;
    #maxSafeZoomIn: number;
    #maxSafeZoomOut: number;

    constructor() {
        this.#initialDistance = Number.NEGATIVE_INFINITY;
        this.#maxSafeZoomIn = Number.POSITIVE_INFINITY;
        this.#maxSafeZoomOut = Number.EPSILON;
    }

    get maxSafeZoomIn() {
        return this.#maxSafeZoomIn;
    }

    get maxSafeZoomOut() {
        return this.#maxSafeZoomOut;
    }

    apply(node: SceneNode, zoomLevel: number) {
        const nodePosition = node.transform.position;

        if (this.#initialDistance === Number.NEGATIVE_INFINITY) {
            const initialDistance = nodePosition.length;

            this.#initialDistance = clamp(initialDistance, MIN_SAFE_DISTANCE, MAX_SAFE_DISTANCE);
            this.#maxSafeZoomIn = initialDistance / MIN_SAFE_DISTANCE;
            this.#maxSafeZoomOut = initialDistance / MAX_SAFE_DISTANCE;
        }

        if (zoomLevel !== 0) {
            nodePosition.setLength(this.#initialDistance / zoomLevel);
        }
    }
}

export default DollyZoomStrategy;
