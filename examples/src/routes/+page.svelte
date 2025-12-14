<style>
    main {
        max-width: 48em;
        height: 100%;
        margin-inline: auto;
        padding: 4em 1em;
        font-size: .75em;
    }

    main > p {
        margin-bottom: .5em;
        font-size: 1.5em;
        text-align: center;
    }

    main > p span {
        font-size: 1.125em;
        font-weight: bold;
    }

    main > section:not(:last-of-type) {
        margin-bottom: .75em;
    }

    main > section p span {
        font-weight: bold;
    }
</style>

<script>
    import { PUBLIC_REPOSITORY_URL } from '$env/static/public';
</script>

<main>
    <p>Welcome to <span>Voyd</span></p>
    
    <section>
        <p>
            <span>About the project.</span>
            This project is a personal deep dive into the complexities of computer graphics. Driven by a passion for learning, I am building this system to explore advanced mathematics and rendering techniques from scratch. My focus is not just on functionality, but on engineering discipline: I adhere to strict enterprise standards, implement industry best practices and prioritize clean, professional code architecture.
        </p>
    </section>

    <section>
        <p>
            <span>Source Code.</span>
            Visit <a href={PUBLIC_REPOSITORY_URL} target="_blank">{PUBLIC_REPOSITORY_URL}</a> to see the source code.
        </p>
    </section>
</main>
