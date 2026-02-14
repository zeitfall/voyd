<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
	import {
		InputManager,
        InputDeviceType,
		KeyboardDevice,
		PointerDevice,
		InputAction,
		InputAxis1DBinding,
        InputAxis2DBinding,
        InputAxis3DBinding,
        InputControlType,
        InputBinding,
        MouseButton,
	} from 'voyd';

	const keyboardDevice = new KeyboardDevice();
	const pointerDevice = new PointerDevice();

	const jumpAction = new InputAction('Jump', InputControlType.CONTINUOUS);

	const jumpActionMouseBinding = new InputBinding({ deviceType: InputDeviceType.POINTER, key: MouseButton.LMB });
	const jumpActionTouchBinding = new InputBinding({ deviceType: InputDeviceType.POINTER, key: 'Touch0' });
	const jumpActionKeyboardBinding = new InputBinding({ deviceType: InputDeviceType.KEYBOARD, key: 'Space' });

	jumpAction
		.addBinding(jumpActionMouseBinding)
		.addBinding(jumpActionTouchBinding)
		.addBinding(jumpActionKeyboardBinding);

	const moveAction = new InputAction('Move', InputControlType.VECTOR_3);

	const moveActionMouseBinding = new InputBinding({ deviceType: InputDeviceType.POINTER, key: MouseButton.LMB });
	const moveActionTouchBinding = new InputBinding({ deviceType: InputDeviceType.POINTER, key: 'Touch0' });
	const moveActionWASDBinding = new InputAxis3DBinding({
		left: [
			{ deviceType: InputDeviceType.KEYBOARD, key: 'KeyA' },
			{ deviceType: InputDeviceType.KEYBOARD, key: 'ArrowLeft' }
		],
		right: [
			{ deviceType: InputDeviceType.KEYBOARD, key: 'KeyD' },
			{ deviceType: InputDeviceType.KEYBOARD, key: 'ArrowRight' }
		],
		up: [
			{ deviceType: InputDeviceType.KEYBOARD, key: 'Space' },
		],
		down: [
			{ deviceType: InputDeviceType.KEYBOARD, key: 'ShiftLeft' },
			{ deviceType: InputDeviceType.KEYBOARD, key: 'ShiftRight' }
		],
		forward: [
			{ deviceType: InputDeviceType.KEYBOARD, key: 'KeyW' },
			{ deviceType: InputDeviceType.KEYBOARD, key: 'ArrowUp' }
		],
		backward: [
			{ deviceType: InputDeviceType.KEYBOARD, key: 'KeyS' },
			{ deviceType: InputDeviceType.KEYBOARD, key: 'ArrowDown' }
		]
	});

	moveAction
		.addBinding(moveActionMouseBinding)
		.addBinding(moveActionTouchBinding)
		.addBinding(moveActionWASDBinding);

	console.log('jumpAction', jumpAction);
	console.log('moveAction', moveAction);

	InputManager
		.registerDevice(keyboardDevice)
		.registerDevice(pointerDevice)
		.addAction(jumpAction)
		.addAction(moveAction)
		// .addAction(flyAction);

	console.log(InputManager);

	let rafId = requestAnimationFrame(updateLoop);

	function updateLoop() {
		InputManager.update();

		// console.log(moveAction.value);

		rafId = requestAnimationFrame(updateLoop);
	}

	onDestroy(() => {
		InputManager.unregisterAllDevices();

		cancelAnimationFrame(rafId);
	});
</script>
