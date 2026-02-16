<script lang="ts">
	import { GPUContext } from 'voyd';
	
    import { Header } from '$lib/components';

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
		touch-action: none;
	}

	:global(main) {
        max-width: 48em;
        height: 100%;
        margin-inline: auto;
        padding: 4em 1em;
        font-size: .75em;
		line-height: 1.5;
    }

	p {
		font-weight: bold;
	}
</style>

<Header />

{#await GPUContext.init()}
	<main>
		<p>Initializing GPU...</p>
	</main>
{:then}
	{@render children()}
{:catch error}
	<main>
		<p>An error occured, while initializing GPU.</p>
		<code>{error}</code>
	</main>
{/await}
