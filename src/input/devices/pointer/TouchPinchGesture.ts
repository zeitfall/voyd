import type { PointerKey, PointerGesture } from '../../types';

class TouchPinchGesture implements PointerGesture {
    #previousDistance: number;

    constructor() {
        this.#previousDistance = 0;
    }

    get type() {
        return 'TouchPinch' as const;
    }

    evaluate(events: Map<PointerKey, PointerEvent>, activePointerCount: number) {
        const touch0Event = events.get('Touch0');
        const touch1Event = events.get('Touch1');

        if (activePointerCount !== 2 || !touch0Event || !touch1Event) {
            this.#previousDistance = 0;

            return null;
        }

        const touch0X = touch0Event.clientX;
        const touch0Y = touch0Event.clientY;
        const touch1X = touch1Event.clientX;
        const touch1Y = touch1Event.clientY;

        const clientX = (touch0X + touch1X) / 2;
        const clientY = (touch0Y + touch1Y) / 2;

        const deltaX = touch1X - touch0X;
        const deltaY = touch1Y - touch0Y;

        const previousDistance = this.#previousDistance;
        const currentDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const deltaDistance = previousDistance > 0 ? currentDistance - previousDistance : 0;

        const pressure = (touch0Event.pressure + touch1Event.pressure) / 2;

        this.#previousDistance = currentDistance;

        return new PointerEvent('touchpinch', {
            buttons: 2,
            pressure,
            movementX: deltaDistance,
            movementY: 0,
            clientX,
            clientY
        });
    }
}

export default TouchPinchGesture;
