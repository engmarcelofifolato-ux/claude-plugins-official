const leadsDatabase = require('./database');

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
            totalLeads: leadsDatabase.length,
            dataSource: 'SICAR/INCRA Real Data Structure',
            timestamp: new Date().toISOString()
        });
    }

    // ============ STATS ============
    if (pathname === '/api/stats') {
        const stats = {
            sucesso: true,
            totalLeads: leadsDatabase.length,
            porEstado: {},
            porModulo: {},
            statusCAR: {
                ativo: 0,
                desatualizado: 0
            },
            timestamp: new Date().toISOString()
        };

        leadsDatabase.forEach(lead => {
            // Por estado
            stats.porEstado[lead.estado] = (stats.porEstado[lead.estado] || 0) + 1;

            // Por módulo
            stats.porModulo[lead.modulo] = (stats.porModulo[lead.modulo] || 0) + 1;

            // Status CAR
            if (lead.statusCAR === 'ATIVO') {
                stats.statusCAR.ativo++;
            } else {
                stats.statusCAR.desatualizado++;
            }
        });

        // Converter para array
        stats.porEstado = Object.entries(stats.porEstado).map(([estado, total]) => ({ estado, total }));
        stats.porModulo = Object.entries(stats.porModulo).map(([modulo, total]) => ({ modulo, total }));

        return res.status(200).json(stats);
    }

    // ============ LEADS BY STATE ============
    if (pathname.startsWith('/api/leads/')) {
        const estado = pathname.replace('/api/leads/', '').toUpperCase();
        const modulo = searchParams.get('modulo');
        const limit = parseInt(searchParams.get('limit') || '50');

        let filtered = leadsDatabase.filter(l => l.estado === estado);

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
        const lead = leadsDatabase.find(l => l.id === leadId);

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

        let filtered = leadsDatabase.filter(l => l.estado === estado.toUpperCase());

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

        let filtered = leadsDatabase;

        if (status) {
            filtered = filtered.filter(l => l.statusCAR === status.toUpperCase());
        }

        if (estado) {
            filtered = filtered.filter(l => l.estado === estado.toUpperCase());
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

        let filtered = leadsDatabase.filter(l => l.rlAtigindo20Porcento === rlStatus);

        if (estado) {
            filtered = filtered.filter(l => l.estado === estado.toUpperCase());
        }

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
        const estado = pathname.replace('/api/credito/', '');
        const leads = leadsDatabase.filter(l => l.estado === estado.toUpperCase() && l.elegivelCredito);

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
            totalLeads: leadsDatabase.length,
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
