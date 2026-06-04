/**
 * GeoRadar Agro - Backend Simplificado para Teste
 * Versão mínima sem banco de dados complexo
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

console.log('🚀 Iniciando servidor simplificado...');
console.log('PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

// Dados em memória
let totalLeads = 105;
const modulosData = {
    'Empresas': 25,
    'Fundiário': 25,
    'Crédito Rural': 20,
    'Solar Rural': 20,
    'Ambiental': 15
};

/**
 * GET /health
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

/**
 * GET /debug
 */
app.get('/debug', (req, res) => {
    res.json({
        status: 'debug',
        server: {
            port: PORT,
            environment: process.env.NODE_ENV || 'development',
            uptime: process.uptime()
        },
        timestamp: new Date().toISOString()
    });
});

/**
 * GET /api/stats
 */
app.get('/api/stats', (req, res) => {
    res.json({
        sucesso: true,
        totalLeads: totalLeads,
        porModulo: Object.entries(modulosData).map(([modulo, total]) => ({
            modulo,
            total
        })),
        timestamp: new Date().toISOString()
    });
});

/**
 * GET /api/leads/:estado
 */
app.get('/api/leads/:estado', (req, res) => {
    const { estado } = req.params;
    const leads = [];

    for (let i = 1; i <= 5; i++) {
        leads.push({
            id: `DEMO-${estado}-${i}`,
            nome: `Empresa ${i} - ${estado}`,
            estado: estado,
            modulo: Object.keys(modulosData)[i % 5],
            score: Math.floor(Math.random() * 100),
            status: 'Ativo'
        });
    }

    res.json({
        sucesso: true,
        total: totalLeads,
        retornados: leads.length,
        estado: estado,
        leads: leads,
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
✅ Servidor rodando na porta ${PORT}
📡 Endpoints:
  GET /health
  GET /debug
  GET /api/stats
  GET /api/leads/:estado
    `);
});
