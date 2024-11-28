import * as http from "node:http";
import {loadProviders, serveProvider} from "../src/app";


http.createServer((req, res) => {
    const q = new URL(req.url ?? "", `https://${req.headers.host}`);

    // stopping the favicon request from continuing, as it is kind of annoying
    if (q.pathname === "/favicon.ico") {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });

    // prints hello world + queries 
    /* res.write(`'ello + ${url.searchParams}`);*/

    serveProvider().then((json) => {
        res.write(JSON.stringify(json));
        //console.log(json);
        res.end();
    })
}).listen(3000, () => {
    loadProviders();
    console.log('Server is running on port 3000. Go to http://localhost:3000/')
});
