<style>
    header {
        position: fixed;
        top: 0;
        display: flex;
        width: min(16em, 100%);
        margin-inline: auto;
        background-color: rgba(255, 255, 255, .75);
        backdrop-filter: blur(1em);
        font-size: .75em;
    }

    a {
        padding-inline: .5em;
        line-height: 2;
        text-decoration: none;
    }

    details {
        position: relative;
        flex: 1;
        isolation: isolate;
        cursor: pointer;
    }

    details summary {
        display: block;
        padding-inline: .5em;
        line-height: 2;
    }

    details summary::-webkit-details-marker {
        display: none;
    }

    details summary::after {
        content: "\25BC";
        margin-left: .25em;
        font-size: .75em;
    }

    details[open] > summary::after {
        content: "\25B2";
    }

    details nav {
        position: absolute;
        inset-inline: 0;
        display: flex;
        flex-direction: column;
        background-color: white;
    }

    details nav a {
        padding-inline: .5em;
        line-height: 1.5;
    }
</style>

<script lang="ts">
    import { PUBLIC_REPOSITORY_URL } from '$env/static/public';
    import { resolve } from '$app/paths';

    enum Routes {
        Home = '/',
        Debug = '/debug'
    };

    let detailsElementRef = $state<HTMLElement>();
    let isDetailsElementOpened = $state(false);

    function handleWindowClick(event: MouseEvent) {
        const eventTarget = event.target as Node;

        if (isDetailsElementOpened && !detailsElementRef.contains(eventTarget)) {
            isDetailsElementOpened = false;
        }
    }
</script>

<svelte:window on:click={handleWindowClick}></svelte:window>

<header>
    <a href={PUBLIC_REPOSITORY_URL} target="_blank">Voyd</a>

    <details
        role="navigation"
        bind:this={detailsElementRef}
        bind:open={isDetailsElementOpened}
    >
        <summary>Examples</summary>
        <nav>
            {#each Object.entries(Routes) as [label, href]}
                <a href={resolve(href)}>{label}</a>
            {/each}
        </nav>
    </details>
</header>
