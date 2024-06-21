const { createServer } = require('node:http');
const { getJson } = require("serpapi");

const hostname = '127.0.0.1';
const port = 4000;

const server = createServer(async (req, res) => {
    const allowed_domain = '*'  // Adjust with your domain or localhost port
    res.setHeader('Access-Control-Allow-Origin', allowed_domain);
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // read query parameters
    const url = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = url.searchParams;
    const query = searchParams.get('query'); // for query
    const location = searchParams.get('location');

    try {
        const response = await getJson({
            engine: "google",
            api_key: '6fe9ae4b393c8fd9bbbefc024684d3a1c907f4a141e1d2d472acb90a9cfde317', // Get your API_KEY first
            q: query,
            location: location,
        });

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
    } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: error.message }));
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});