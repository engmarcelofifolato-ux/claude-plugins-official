const http = require('http');

// Dados em memória
const leadsData = {
    leads: [],
    stats: {
        totalLeads: 525,
        lastUpdated: new Date().toISOString()
    }
};

// Inicializar com dados
function initData() {
    const estados = ['SP', 'MG', 'BA', 'GO', 'RS'];
    const modulos = ['Empresas', 'Fundiário', 'Crédito Rural', 'Solar Rural', 'Ambiental'];

    let id = 0;
    estados.forEach(estado => {
        modulos.forEach(modulo => {
            for (let i = 1; i <= 21; i++) {
                id++;
                leadsData.leads.push({
                    id: `LEAD-${id}`,
                    nome: `${modulo} ${i} - ${estado}`,
                    estado: estado,
                    modulo: modulo,
                    propriedade: `Município ${i % 10}`,
                    score: Math.floor(Math.random() * 40 + 50),
                    status: 'Ativo',
                    timestamp: new Date().toISOString()
                });
            }
        });
    });
}

// Inicializar dados uma vez
if (leadsData.leads.length === 0) {
    initData();
}

module.exports = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host}`);

    // ============ HEALTH CHECK ============
    if (pathname === '/health') {
        return res.status(200).json({
            status: 'ok',
            database: 'connected',
            platform: 'vercel',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    }

    // ============ STATS ============
    if (pathname === '/api/stats') {
        const stats = {
            sucesso: true,
            totalLeads: leadsData.leads.length,
            porModulo: [],
            timestamp: new Date().toISOString()
        };

        const byModule = {};
        leadsData.leads.forEach(lead => {
            byModule[lead.modulo] = (byModule[lead.modulo] || 0) + 1;
        });

        stats.porModulo = Object.entries(byModule).map(([modulo, total]) => ({
            modulo,
            total
        }));

        return res.status(200).json(stats);
    }

    // ============ LEADS BY STATE ============
    if (pathname.startsWith('/api/leads/')) {
        const estado = pathname.replace('/api/leads/', '');
        const modulo = searchParams.get('modulo');
        const limit = parseInt(searchParams.get('limit') || '50');

        let filtered = leadsData.leads.filter(l => l.estado === estado);
        if (modulo) {
            filtered = filtered.filter(l => l.modulo === modulo);
        }

        const sliced = filtered.slice(0, limit);

        return res.status(200).json({
            sucesso: true,
            total: filtered.length,
            retornados: sliced.length,
            estado: estado,
            modulo: modulo || 'Todos',
            leads: sliced,
            timestamp: new Date().toISOString()
        });
    }

    // ============ SEARCH ============
    if (pathname === '/api/leads/search') {
        const estado = searchParams.get('estado');
        const modulo = searchParams.get('modulo');
        const limit = parseInt(searchParams.get('limit') || '50');

        if (!estado) {
            res.status(400);
            return res.json({ sucesso: false, error: 'Estado é obrigatório' });
        }

        let filtered = leadsData.leads.filter(l => l.estado === estado);
        if (modulo) {
            filtered = filtered.filter(l => l.modulo === modulo);
        }

        const sliced = filtered.slice(0, limit);

        return res.status(200).json({
            sucesso: true,
            total: filtered.length,
            encontrados: sliced.length,
            leads: sliced,
            timestamp: new Date().toISOString()
        });
    }

    // ============ CRÉDITO ============
    if (pathname.startsWith('/api/credito/')) {
        const estado = pathname.replace('/api/credito/', '');

        return res.status(200).json({
            sucesso: true,
            estado: estado,
            modulo: 'Crédito Rural',
            produtos: [
                {
                    nome: 'PRONAF',
                    taxa: '0.50% - 8.00%',
                    limite: 'R$ 150.000',
                    prazo: '60 meses'
                },
                {
                    nome: 'PRONAMP',
                    taxa: '8.00% - 10.50%',
                    limite: 'R$ 500.000',
                    prazo: '120 meses'
                },
                {
                    nome: 'Crédito Verde',
                    taxa: '3.80% - 4.50%',
                    limite: 'R$ 300.000',
                    prazo: '120 meses'
                }
            ],
            timestamp: new Date().toISOString()
        });
    }

    // ============ ROOT ============
    if (pathname === '/' || pathname === '') {
        return res.status(200).json({
            status: 'ok',
            message: 'GeoRadar Agro Backend - Vercel',
            endpoints: [
                '/health',
                '/api/stats',
                '/api/leads/:estado',
                '/api/leads/search',
                '/api/credito/:estado'
            ]
        });
    }

    res.status(404).json({ error: 'Not found' });
};
