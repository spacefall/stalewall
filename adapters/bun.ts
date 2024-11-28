import { loadProviders, serveProvider } from "../src/providers";
import { parseQueries } from "../src/settings";

loadProviders();

const server = Bun.serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);

        // stopping the favicon request from continuing, as it is kind of annoying
        if (url.pathname === "/favicon.ico") {
            return new Response("Favicon doesn't exist", { status: 404 });
        }

        try {
            const set = parseQueries(url.searchParams);
            const apiResp = await serveProvider(set);
            return new Response(JSON.stringify(apiResp), {
                headers: { "Content-Type": "application/json" },
            });
        } catch (err) {
            console.error(err);
            // TODO: make this a bit more professional
            return new Response(`shit broke: ${err}`, { status: 500 });
        }
    },
});

console.log(`Listening on ${server.url}`);
