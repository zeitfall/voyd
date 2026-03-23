<script lang="ts">
    import { setGPUContext } from '$lib/contexts/gpu';

	const { context, children } = $props();

    setGPUContext(context);
</script>

{@render children()}
