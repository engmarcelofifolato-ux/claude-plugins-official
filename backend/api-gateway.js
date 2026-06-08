const http = require('http');

const PORT = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.url === '/health') {
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'ok', database: 'connected', uptime: process.uptime() }));
    } else if (req.url === '/') {
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'GeoRadar Agro Backend', status: 'running' }));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
