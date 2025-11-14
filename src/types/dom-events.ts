import type { PointerLockState } from "~/enums";

export interface PointerLockEvent extends Event {
    state: PointerLockState;
}
