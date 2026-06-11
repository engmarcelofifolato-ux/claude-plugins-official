/**
 * Servidor local para testes do frontend
 * Serve o HTML e fornece API em localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const apiHandler = require('./index.js');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Servir arquivos estáticos
    if (req.url === '/' || req.url === '/index.html') {
        try {
            const htmlFile = path.join(__dirname, '../GeoRadar-Agro-Advanced.html');
            const html = fs.readFileSync(htmlFile, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(html);
            return;
        } catch (err) {
            console.error('Erro ao ler HTML:', err.message);
            res.writeHead(500);
            res.end('Erro ao carregar frontend');
            return;
        }
    }

    // API requests
    if (req.url.startsWith('/api') || req.url.startsWith('/health')) {
        await apiHandler(req, res);
        return;
    }

    // 404
    res.writeHead(404);
    res.end('Not found');
});

server.listen(PORT, () => {
    console.log('\n═══════════════════════════════════════════');
    console.log('🚀 SERVIDOR LOCAL GEORADAR AGRO');
    console.log('═══════════════════════════════════════════\n');
    console.log(`✅ Frontend: http://localhost:${PORT}`);
    console.log(`✅ API: http://localhost:${PORT}/api/*`);
    console.log(`\n📊 Pressione Ctrl+C para parar\n`);
});
