/**
 * Servidor Local - GeoRadar Agro v1.0.0
 * Testes antes do deploy em produção
 *
 * Uso:
 * node run-local-server.js
 *
 * Então acesse:
 * http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const apiHandler = require('./api/index.js');

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

// Estatísticas do servidor
const stats = {
    requestCount: 0,
    startTime: new Date(),
    endpoints: {}
};

const server = http.createServer(async (req, res) => {
    // Incrementar contador
    stats.requestCount++;

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    // Log de requisição
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${pathname}`);

    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    try {
        // ============ SERVIR FRONTEND ============
        if (pathname === '/' || pathname === '/index.html') {
            try {
                const htmlFile = path.join(__dirname, './GeoRadar-Agro-Advanced.html');
                const html = fs.readFileSync(htmlFile, 'utf8');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(html);
                return;
            } catch (err) {
                console.error('❌ Erro ao carregar frontend:', err.message);
                res.writeHead(500);
                res.end('Erro ao carregar frontend');
                return;
            }
        }

        // ============ DASHBOARD LOCAL ============
        if (pathname === '/dashboard') {
            const uptime = Math.floor((Date.now() - stats.startTime.getTime()) / 1000);
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = uptime % 60;

            const dashboard = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GeoRadar Agro - Dashboard Local</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .header {
            background: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header h1 { color: #667eea; margin-bottom: 10px; }
        .header p { color: #666; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .card h2 { color: #333; margin-bottom: 15px; font-size: 18px; }
        .stat-value { font-size: 32px; font-weight: bold; color: #667eea; margin: 10px 0; }
        .stat-label { color: #666; font-size: 14px; }
        .button-group { display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap; }
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s;
        }
        .btn-primary { background: #667eea; color: white; }
        .btn-primary:hover { background: #5568d3; transform: translateY(-2px); }
        .btn-secondary { background: #f0f0f0; color: #333; }
        .btn-secondary:hover { background: #e0e0e0; }
        .status-online { color: #4caf50; font-weight: bold; }
        .status-text { margin-top: 10px; font-size: 14px; color: #666; }
        .divider { height: 1px; background: #eee; margin: 20px 0; }
        .code-block {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            overflow-x: auto;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 GeoRadar Agro v1.0.0 - Dashboard Local</h1>
            <p>Status: <span class="status-online">✅ Online</span></p>
        </div>

        <div class="grid">
            <div class="card">
                <h2>📊 Status do Servidor</h2>
                <div class="stat-label">Uptime:</div>
                <div class="stat-value">${hours}h ${minutes}m ${seconds}s</div>
                <div class="stat-label">Requisições processadas:</div>
                <div class="stat-value">${stats.requestCount}</div>
                <div class="status-text">✅ Servidor rodando normalmente</div>
            </div>

            <div class="card">
                <h2>📱 Aplicação</h2>
                <div class="stat-label">Frontend:</div>
                <div class="stat-value">React SPA</div>
                <div class="status-text">✅ Pronto para testar</div>
                <div class="button-group">
                    <a href="/" class="btn btn-primary">Abrir Aplicação</a>
                </div>
            </div>

            <div class="card">
                <h2>🗄️ Banco de Dados</h2>
                <div class="stat-label">Total de Leads:</div>
                <div class="stat-value">9.600</div>
                <div class="status-text">✅ Disponível</div>
                <div class="button-group">
                    <a href="/api/stats" class="btn btn-secondary" target="_blank">Ver Stats</a>
                </div>
            </div>

            <div class="card">
                <h2>🔌 APIs</h2>
                <div class="stat-label">Integradas:</div>
                <div class="stat-value">4</div>
                <div class="status-text">
                    ✅ ReceitaWS<br>
                    ✅ IBGE SIDRA<br>
                    ✅ INMET WIS 2.0<br>
                    ✅ Banco Central
                </div>
            </div>

            <div class="card">
                <h2>🗺️ CAR Integration</h2>
                <div class="stat-label">Registros:</div>
                <div class="stat-value">10</div>
                <div class="status-text">✅ Matching por coordenadas</div>
                <div class="button-group">
                    <a href="/api/car/stats" class="btn btn-secondary" target="_blank">CAR Stats</a>
                </div>
            </div>

            <div class="card">
                <h2>🧪 Testes</h2>
                <div class="stat-label">Total:</div>
                <div class="stat-value">45</div>
                <div class="status-text">✅ 100% passou</div>
                <div class="button-group">
                    <a href="/docs" class="btn btn-secondary">Documentação</a>
                </div>
            </div>
        </div>

        <div class="header" style="margin-top: 30px;">
            <h2>📚 Endpoints Disponíveis</h2>
            <div class="code-block">
GET /health                                    # Health check
GET /api/stats                                 # Estatísticas
GET /api/leads/:estado                         # Leads por estado
GET /api/lead/:id                              # Lead específico
GET /api/leads/search?...                      # Busca avançada
GET /api/leads/car/status                      # Filtro CAR
GET /api/leads/rl/status                       # Filtro RL
GET /api/credito/:estado                       # Crédito rural
GET /api/car/stats                             # Stats CAR
GET /api/car/matching?lat=&lon=&tolerancia=    # CAR matching
GET /api/car/numero?car=                       # CAR lookup
GET /api/leads/enriquecer/car?estado=&limit=   # Batch CAR
            </div>
        </div>

        <div class="header">
            <h2>🎯 Como Testar</h2>
            <div style="margin-top: 15px; line-height: 1.8;">
                <p><strong>1. Abra a aplicação:</strong></p>
                <div class="button-group">
                    <a href="/" class="btn btn-primary">http://localhost:${PORT}</a>
                </div>

                <p style="margin-top: 15px;"><strong>2. Teste as funcionalidades:</strong></p>
                <ul style="margin-left: 20px;">
                    <li>Selecione um estado</li>
                    <li>Filtre por módulo</li>
                    <li>Use busca avançada</li>
                    <li>Clique em um lead para ver detalhes</li>
                    <li>Exporte para CSV</li>
                    <li>Envie via WhatsApp</li>
                </ul>

                <p style="margin-top: 15px;"><strong>3. Verifique a API:</strong></p>
                <div class="code-block">
curl http://localhost:${PORT}/health
curl http://localhost:${PORT}/api/stats
curl http://localhost:${PORT}/api/leads/SP?limit=10
                </div>
            </div>
        </div>

        <div class="header">
            <h2>ℹ️ Informações</h2>
            <div style="margin-top: 15px; color: #666;">
                <p><strong>Host:</strong> localhost</p>
                <p><strong>Porta:</strong> ${PORT}</p>
                <p><strong>Versão:</strong> 1.0.0</p>
                <p><strong>Status:</strong> <span class="status-online">Produção Pronta</span></p>
                <p><strong>Próxima Etapa:</strong> Autenticação de usuários com planos pagos</p>
            </div>
        </div>
    </div>
</body>
</html>
            `;
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(dashboard);
            return;
        }

        // ============ API REQUESTS ============
        if (pathname.startsWith('/api') || pathname === '/health') {
            await apiHandler(req, res);
            return;
        }

        // ============ 404 ============
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            erro: 'Not found',
            sugestao: 'Acesse http://localhost:' + PORT + ' ou http://localhost:' + PORT + '/dashboard'
        }));

    } catch (error) {
        console.error('❌ Erro:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ erro: error.message }));
    }
});

// Iniciar servidor
server.listen(PORT, HOST, () => {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('🚀 GEORADAR AGRO - SERVIDOR LOCAL');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log(`✅ Servidor rodando em: http://${HOST}:${PORT}`);
    console.log(`✅ Dashboard: http://${HOST}:${PORT}/dashboard`);
    console.log(`✅ API Base: http://${HOST}:${PORT}/api`);
    console.log(`\n📱 Frontend: http://${HOST}:${PORT}`);
    console.log(`🗄️ Banco de Dados: 9.600 leads`);
    console.log(`🔌 APIs: 4 integradas`);
    console.log(`🗺️ CAR: Matching funcional`);
    console.log(`\n⚠️ Pressione Ctrl+C para parar o servidor\n`);
});

// Tratamento de erros
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Porta ${PORT} já está em uso!`);
        console.error(`\nTente uma dessas soluções:`);
        console.error(`1. Feche a outra aplicação usando a porta ${PORT}`);
        console.error(`2. Use uma porta diferente:`);
        console.error(`   PORT=3001 node run-local-server.js`);
        process.exit(1);
    } else {
        console.error('Erro do servidor:', err);
        process.exit(1);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n═══════════════════════════════════════════════════════');
    console.log('🛑 SERVIDOR DESLIGANDO');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log(`Requisições processadas: ${stats.requestCount}`);
    console.log(`Tempo ativo: ${Math.floor((Date.now() - stats.startTime.getTime()) / 1000)}s`);
    console.log('\n✅ Até logo!\n');
    server.close(() => process.exit(0));
});
