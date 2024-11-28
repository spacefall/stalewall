import { loadProviders, serveProvider } from "../src/app";

loadProviders();

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    // stopping the favicon request from continuing, as it is kind of annoying
    if (url.pathname === "/favicon.ico") {
        return new Response("Favicon doesn't exist", { status: 404 });
    }

    //return new Response(`'ello + ${url.searchParams}`);
    const apiResp = await serveProvider()
    return new Response(JSON.stringify(apiResp), {headers: {"Content-Type": "application/json"}});
    
    //return new Response("shit broke", { status: 500 });
  },
});

console.log(`Listening on ${server.url}`);
