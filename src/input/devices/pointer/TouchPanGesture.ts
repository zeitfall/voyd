import type { PointerGesture, PointerKey } from '../../types';

class TouchPanGesture<N extends number> implements PointerGesture {
    #requiredTouchCount: N;
    #touchKey: PointerKey;
    #type: `TouchPan${N}`;

    constructor(requiredTouchCount: N) {
        const touchNumber = Math.max(0, requiredTouchCount - 1);

        this.#requiredTouchCount = requiredTouchCount;
        this.#touchKey = `Touch${touchNumber}`;
        this.#type = `TouchPan${requiredTouchCount}`;
    }

    get type() {
        return this.#type;
    }

    evaluate(events: Map<PointerKey, PointerEvent>, activePointerCount: number) {
        const touch = events.get(this.#touchKey);

        if (activePointerCount !== this.#requiredTouchCount || !touch) {
            return null;
        }

        return touch;
    }
}

export default TouchPanGesture;
