<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
	import {
		InputManager,
		KeyboardDevice,
		PointerDevice,
		InputAction,
		InputAxis1DBinding,
        InputAxis2DBinding,
        InputAxis3DBinding,
        InputDeviceType,
        InputControlType
	} from 'voyd';

	const keyboardDevice = new KeyboardDevice();
	const pointerDevice = new PointerDevice();

	// const jumpAction = new InputAction('Jump', InputControlType.DISCRETE);
	const moveAction = new InputAction('Move', InputControlType.VECTOR_2);

	const moveActionWASDBinding = new InputAxis2DBinding({
		left: [
			{ deviceType: InputDeviceType.KEYBOARD, key: 'KeyA' },
			{ deviceType: InputDeviceType.KEYBOARD, key: 'ArrowLeft' }
		],
		right: [
			{ deviceType: InputDeviceType.KEYBOARD, key: 'KeyD' },
			{ deviceType: InputDeviceType.KEYBOARD, key: 'ArrowRight' }
		],
		up: [
			{ deviceType: InputDeviceType.KEYBOARD, key: 'KeyW' },
			{ deviceType: InputDeviceType.KEYBOARD, key: 'ArrowUp' }
		],
		down: [
			{ deviceType: InputDeviceType.KEYBOARD, key: 'KeyS' },
			{ deviceType: InputDeviceType.KEYBOARD, key: 'ArrowDown' }
		]
	});

	moveAction.addBinding(moveActionWASDBinding);

	console.log(moveAction);

	InputManager
		.registerDevice(keyboardDevice)
		.registerDevice(pointerDevice)
		// .addAction(jumpAction)
		.addAction(moveAction)
		// .addAction(flyAction);

	console.log(InputManager);

	let rafId = requestAnimationFrame(updateLoop);

	function updateLoop() {
		InputManager.update();

		// console.log(pointerDevice.getEvent('Touch0'));

		rafId = requestAnimationFrame(updateLoop);
	}

	onDestroy(() => {
		InputManager.unregisterAllDevices();

		cancelAnimationFrame(rafId);
	});
</script>
