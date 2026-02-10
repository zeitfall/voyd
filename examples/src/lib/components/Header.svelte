<style>
    header {
        position: fixed;
        top: 0;
        display: flex;
        width: min(16em, 100%);
        margin-inline: auto;
        background-color: rgba(255, 255, 255, .8);
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

    details nav a[aria-current="true"] {
        background-color: rgba(0, 0, 0, .1);
    }

    details nav a:hover {
        background-color: rgba(0, 0, 0, .2);
    }
</style>

<script lang="ts">
    import { resolve } from '$app/paths';
    import { page } from '$app/state';

    enum Route {
        Home = '/',
        Debug = '/debug',
        SceneNodes = '/scene-nodes',
        InputManager = '/input-manager'
    };

    const ROUTE_LABELS_MAP = {
        [Route.Home]: 'Voyd',
        [Route.Debug]: 'Debug',
        [Route.SceneNodes]: 'Scene Nodes',
        [Route.InputManager]: 'Input Manager'
    } as const;

    const navigationRoutePaths = $derived(Object.values(Route).filter((route) => route !== Route.Home));
    const currentRoutePath = $derived(page.route.id);

    let detailsElementRef = $state<HTMLElement>();
    let isDetailsElementOpened = $state(false);
    
    const detailsSummary = $derived.by(() => {
        if (currentRoutePath === Route.Home) {
            return 'Examples';
        }

        return getRouteLabel(currentRoutePath);
    });

    function getRouteLabel(routePath: string) {
        // @ts-expect-error No index signature with a parameter of type 'string' was found on type 'typeof NAVIGATION_ITEM_LABEL_BY_ROUTE'.
        return ROUTE_LABELS_MAP[routePath];
    }

    function handleWindowClick(event: MouseEvent) {
        const eventTarget = event.target as Node;

        if (isDetailsElementOpened && !detailsElementRef.contains(eventTarget)) {
            isDetailsElementOpened = false;
        }
    }
</script>

<svelte:window onclick={handleWindowClick}></svelte:window>

<header>
    <a href={resolve(Route.Home)}>{getRouteLabel(Route.Home)}</a>

    <details
        role="navigation"
        bind:this={detailsElementRef}
        bind:open={isDetailsElementOpened}
    >
        <summary>{detailsSummary}</summary>
        <nav>
            {#each navigationRoutePaths as path}
                <a
                    href={resolve(path)}
                    aria-current={path === currentRoutePath}
                    onclick={() => isDetailsElementOpened = false}
                >
                    {getRouteLabel(path)}
                </a>
            {/each}
        </nav>
    </details>
</header>
