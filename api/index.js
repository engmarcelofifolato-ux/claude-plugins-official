const { gerarLeadsEmMassa, TOTAL_LEADS } = require('./database');

module.exports = async (req, res) => {
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
            totalLeads: TOTAL_LEADS,
            dataSource: 'SICAR/INCRA Real Data Structure',
            timestamp: new Date().toISOString()
        });
    }

    // ============ STATS ============
    if (pathname === '/api/stats') {
        const stats = {
            sucesso: true,
            totalLeads: TOTAL_LEADS,
            porEstado: {},
            porModulo: {},
            statusCAR: {
                ativo: 0,
                desatualizado: 0
            },
            timestamp: new Date().toISOString()
        };

        const allLeads = gerarLeadsEmMassa(null, TOTAL_LEADS);
        allLeads.forEach(lead => {
            stats.porEstado[lead.estado] = (stats.porEstado[lead.estado] || 0) + 1;
            stats.porModulo[lead.modulo] = (stats.porModulo[lead.modulo] || 0) + 1;
            if (lead.statusCAR === 'ATIVO') {
                stats.statusCAR.ativo++;
            } else {
                stats.statusCAR.desatualizado++;
            }
        });

        stats.porEstado = Object.entries(stats.porEstado).map(([estado, total]) => ({ estado, total }));
        stats.porModulo = Object.entries(stats.porModulo).map(([modulo, total]) => ({ modulo, total }));

        return res.status(200).json(stats);
    }

    // ============ LEADS BY STATE ============
    if (pathname.startsWith('/api/leads/')) {
        const estado = pathname.replace('/api/leads/', '').toUpperCase();
        const modulo = searchParams.get('modulo');
        const limit = parseInt(searchParams.get('limit') || '50');

        let filtered = gerarLeadsEmMassa(estado, TOTAL_LEADS);

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

    // ============ DETAILED LEAD ============
    if (pathname.startsWith('/api/lead/')) {
        const leadId = pathname.replace('/api/lead/', '');
        const allLeads = gerarLeadsEmMassa(null, TOTAL_LEADS);
        const lead = allLeads.find(l => l.id === leadId);

        if (!lead) {
            return res.status(404).json({ sucesso: false, error: 'Lead não encontrado' });
        }

        return res.status(200).json({
            sucesso: true,
            lead: lead,
            timestamp: new Date().toISOString()
        });
    }

    // ============ SEARCH ============
    if (pathname === '/api/leads/search') {
        const estado = searchParams.get('estado');
        const modulo = searchParams.get('modulo');
        const carAtualizado = searchParams.get('carAtualizado');
        const rlOk = searchParams.get('rlOk');
        const limit = parseInt(searchParams.get('limit') || '50');

        if (!estado) {
            res.status(400);
            return res.json({ sucesso: false, error: 'Estado é obrigatório' });
        }

        let filtered = gerarLeadsEmMassa(estado.toUpperCase(), TOTAL_LEADS);

        if (modulo) {
            filtered = filtered.filter(l => l.modulo === modulo);
        }

        if (carAtualizado === 'true') {
            filtered = filtered.filter(l => l.carAtualizado === true);
        } else if (carAtualizado === 'false') {
            filtered = filtered.filter(l => l.carAtualizado === false);
        }

        if (rlOk === 'true') {
            filtered = filtered.filter(l => l.rlAtigindo20Porcento === true);
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

    // ============ FILTER BY CAR STATUS ============
    if (pathname === '/api/leads/car/status') {
        const status = searchParams.get('status');
        const estado = searchParams.get('estado');
        const limit = parseInt(searchParams.get('limit') || '50');

        let filtered = gerarLeadsEmMassa(estado ? estado.toUpperCase() : null, TOTAL_LEADS);

        if (status) {
            filtered = filtered.filter(l => l.statusCAR === status.toUpperCase());
        }

        const sliced = filtered.slice(0, limit);

        return res.status(200).json({
            sucesso: true,
            total: filtered.length,
            leads: sliced,
            timestamp: new Date().toISOString()
        });
    }

    // ============ FILTER BY RL STATUS ============
    if (pathname === '/api/leads/rl/status') {
        const rlStatus = searchParams.get('atingindo20') === 'true';
        const estado = searchParams.get('estado');
        const limit = parseInt(searchParams.get('limit') || '50');

        let filtered = gerarLeadsEmMassa(estado ? estado.toUpperCase() : null, TOTAL_LEADS).filter(l => l.rlAtigindo20Porcento === rlStatus);

        const sliced = filtered.slice(0, limit);

        return res.status(200).json({
            sucesso: true,
            total: filtered.length,
            leads: sliced,
            timestamp: new Date().toISOString()
        });
    }

    // ============ CRÉDITO ============
    if (pathname.startsWith('/api/credito/')) {
        const estado = pathname.replace('/api/credito/', '').toUpperCase();
        const leads = gerarLeadsEmMassa(estado, TOTAL_LEADS).filter(l => l.elegivelCredito);

        return res.status(200).json({
            sucesso: true,
            estado: estado,
            elegeisCredito: leads.length,
            leads: leads.map(l => ({
                id: l.id,
                nome: l.nome,
                creditosDisponiveis: l.creditosDisponiveis
            })),
            timestamp: new Date().toISOString()
        });
    }

    // ============ ROOT ============
    if (pathname === '/' || pathname === '') {
        return res.status(200).json({
            status: 'ok',
            message: 'GeoRadar Agro Backend - SICAR/INCRA Real Data',
            totalLeads: TOTAL_LEADS,
            endpoints: [
                '/health',
                '/api/stats',
                '/api/leads/:estado',
                '/api/lead/:id',
                '/api/leads/search',
                '/api/leads/car/status',
                '/api/leads/rl/status',
                '/api/credito/:estado'
            ]
        });
    }

    res.status(404).json({ error: 'Endpoint not found' });
};
