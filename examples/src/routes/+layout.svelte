<script lang="ts">
	import { GPUContext } from 'voyd';
	
    import Header from '$lib/components/Header.svelte';

	const { children } = $props();
</script>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		user-select: none;
	}

	:global(html) {
		height: 100%;
		font-family: 'Google Sans', sans-serif;
	}

	:global(body) {
		height: 100%;
		overflow: hidden;
	}
</style>

<Header />

{#await GPUContext.init()}
	<p>Initializing GPU...</p>
{:then}
	{@render children()}
{:catch error}
	<p>An error occured, while initializing GPU.</p>
	<code>{error}</code>
{/await}
