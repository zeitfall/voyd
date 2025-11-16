import Controller from './Controller';

import { PointerLockState } from '~/enums';

import type { ValueOf, ControllerBindings, PointerLockEvent } from '~/types';

const POINTER_LOCK_STATE_TO_EVENT_NAME_MAP = {
	[PointerLockState.LOCKED]: 'locked',
	[PointerLockState.UNLOCKED]: 'unlocked',
} as const;

type PointerLockEventNames = ValueOf<typeof POINTER_LOCK_STATE_TO_EVENT_NAME_MAP>;

class PointerLockController extends Controller<PointerLockEventNames, PointerLockEvent> {
	constructor(eventTarget: HTMLElement, bindings: Partial<ControllerBindings<PointerLockEventNames, PointerLockEvent>>) {
		super(eventTarget, bindings);

		this._addEventListeners();
	}

	protected _addEventListeners() {
		this.eventTarget.addEventListener('click', this._requestPointerLock.bind(this), this._eventListenerOptions);

		document.addEventListener('pointerlockchange', (event) => {
			const lockedEvent = { ...event, state: PointerLockState.LOCKED };
			const unlockedEvent = { ...event, state: PointerLockState.UNLOCKED };

			if (document.pointerLockElement) {
				this._setEvent(lockedEvent);
				this._deleteEvent(unlockedEvent);
			} else {
				this._setEvent(unlockedEvent);
				this._deleteEvent(lockedEvent);
			}
		}, this._eventListenerOptions );
	}

	protected _getEventCode(event: PointerLockEvent) {
		return POINTER_LOCK_STATE_TO_EVENT_NAME_MAP[event.state];
	}

	private async _requestPointerLock() {
		try {
			await this.eventTarget.requestPointerLock({ unadjustedMovement: true });
		} catch (error) {
			// @ts-expect-error 'error' is of type 'unknown'.
			if (error.name === 'NotSupportedError') {
				await this.eventTarget.requestPointerLock();

				return;
			}

			throw error;
		}
	}
}

export default PointerLockController;
