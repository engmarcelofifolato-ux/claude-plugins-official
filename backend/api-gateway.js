/**
 * GeoRadar Agro - Backend com Banco JSON
 * Sem dependências nativas, funciona 100% no Railway
 */

const express = require('express');
const cors = require('cors');
const db = require('./json-db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

console.log('🚀 Iniciando GeoRadar Agro Backend...');
console.log('📦 NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('🔌 PORT:', PORT);

// Initialize database
console.log('📂 Inicializando banco JSON...');
db.loadDatabase();

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
        database: 'json-file',
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
 * Retorna estatísticas do banco
 */
app.get('/api/stats', (req, res) => {
    try {
        const stats = db.getStats();
        res.json({
            sucesso: true,
            totalLeads: stats.totalLeads,
            porModulo: stats.porModulo,
            dataSource: 'json-database',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro em /api/stats:', error);
        res.status(500).json({ sucesso: false, error: error.message });
    }
});

/**
 * GET /api/leads/:estado
 * Buscar leads por estado
 */
app.get('/api/leads/:estado', (req, res) => {
    try {
        const { estado } = req.params;
        const { modulo, limit = 50 } = req.query;

        const leads = db.getLeadsByState(estado, modulo);
        const sliced = leads.slice(0, parseInt(limit));

        res.json({
            sucesso: true,
            total: leads.length,
            retornados: sliced.length,
            estado: estado,
            modulo: modulo || 'Todos',
            leads: sliced,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro em /api/leads/:estado:', error);
        res.status(500).json({ sucesso: false, error: error.message });
    }
});

/**
 * GET /api/leads/search
 * Busca avançada
 */
app.get('/api/leads/search', (req, res) => {
    try {
        const { estado, modulo, limit = 50 } = req.query;

        if (!estado) {
            return res.status(400).json({
                sucesso: false,
                error: 'Estado é obrigatório'
            });
        }

        const leads = db.getLeadsByState(estado, modulo);
        const sliced = leads.slice(0, parseInt(limit));

        res.json({
            sucesso: true,
            total: leads.length,
            encontrados: sliced.length,
            leads: sliced,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro em /api/leads/search:', error);
        res.status(500).json({ sucesso: false, error: error.message });
    }
});

/**
 * GET /api/credito/:estado
 * Informações de crédito rural
 */
app.get('/api/credito/:estado', (req, res) => {
    const { estado } = req.params;

    res.json({
        sucesso: true,
        estado: estado,
        modulo: 'Crédito Rural',
        produtos: [
            {
                nome: 'PRONAF',
                taxa: '0.50% - 8.00%',
                limite: 'R$ 150.000',
                prazo: '60 meses',
                publico: 'Agricultores Familiares'
            },
            {
                nome: 'PRONAMP',
                taxa: '8.00% - 10.50%',
                limite: 'R$ 500.000',
                prazo: '120 meses',
                publico: 'Produtores Médios'
            },
            {
                nome: 'Crédito Verde',
                taxa: '3.80% - 4.50%',
                limite: 'R$ 300.000',
                prazo: '120 meses',
                publico: 'Sustentabilidade'
            }
        ],
        timestamp: new Date().toISOString()
    });
});

/**
 * POST /api/leads
 * Adicionar novo lead (para futuras integrações)
 */
app.post('/api/leads', (req, res) => {
    try {
        const lead = req.body;
        const newLead = db.addLead(lead);
        res.status(201).json({
            sucesso: true,
            lead: newLead,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro em POST /api/leads:', error);
        res.status(500).json({ sucesso: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`
✅ GeoRadar Agro Backend - ONLINE
🔌 Porta: ${PORT}
📂 Banco de Dados: JSON (confiável, sem dependências nativas)
⚡ Ambiente: ${process.env.NODE_ENV === 'production' ? '🟢 PRODUÇÃO' : '🟡 DESENVOLVIMENTO'}

📊 Endpoints disponíveis:
  GET  /health              - Status do servidor
  GET  /debug               - Informações de debug
  GET  /api/stats           - Estatísticas gerais
  GET  /api/leads/:estado   - Buscar leads por estado
  GET  /api/leads/search    - Busca avançada
  GET  /api/credito/:estado - Informações de crédito
  POST /api/leads           - Adicionar novo lead

🎯 Pronto para receber requisições!
    `);
});
