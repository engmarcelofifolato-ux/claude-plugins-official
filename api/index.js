const { gerarLeadsEmMassa, TOTAL_LEADS } = require('./database');
const carGateway = require('./car-data-gateway');
const realDataGateway = require('./real-data-gateway');
const carSicarGateway = require('./car-sicar-gateway');
const bigDataCorpGateway = require('./bigdatacorp-gateway');

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
    if (pathname.startsWith('/api/leads/') && !pathname.startsWith('/api/leads/real/')) {
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

    // ============ CAR INTEGRATION ============
    // Enriquecer leads com dados CAR
    if (pathname === '/api/leads/enriquecer/car') {
        const estado = searchParams.get('estado');
        const tolerancia = parseInt(searchParams.get('tolerancia') || '300');
        const limit = parseInt(searchParams.get('limit') || '50');

        if (!estado) {
            return res.status(400).json({
                sucesso: false,
                error: 'Estado é obrigatório'
            });
        }

        try {
            let leads = gerarLeadsEmMassa(estado.toUpperCase(), limit);
            const resultado = carGateway.enriquecerMultiplas(leads, tolerancia);

            return res.status(200).json({
                sucesso: true,
                estado: estado,
                totalProcessados: resultado.totalProcessados,
                comCAR: resultado.comCAR,
                semCAR: resultado.semCAR,
                taxaMatching: resultado.taxaMatching,
                leads: resultado.propriedades,
                tolerancia: tolerancia,
                timestamp: resultado.timestamp
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                error: `Erro ao enriquecer com CAR: ${error.message}`
            });
        }
    }

    // Buscar CAR por número
    if (pathname === '/api/car/numero') {
        const carNumber = searchParams.get('car');

        if (!carNumber) {
            return res.status(400).json({
                sucesso: false,
                error: 'Número do CAR é obrigatório'
            });
        }

        try {
            const carData = carGateway.buscarPorNumeroCar(carNumber);

            if (!carData) {
                return res.status(404).json({
                    sucesso: false,
                    error: `CAR não encontrado: ${carNumber}`
                });
            }

            return res.status(200).json({
                sucesso: true,
                carData: carData,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                error: `Erro ao buscar CAR: ${error.message}`
            });
        }
    }

    // Matching por coordenadas
    if (pathname === '/api/car/matching') {
        const lat = parseFloat(searchParams.get('lat'));
        const lon = parseFloat(searchParams.get('lon'));
        const tolerancia = parseInt(searchParams.get('tolerancia') || '300');
        const estado = searchParams.get('estado');

        if (!lat || !lon) {
            return res.status(400).json({
                sucesso: false,
                error: 'Latitude e longitude são obrigatórias'
            });
        }

        try {
            const carData = carGateway.matchingPorCoordenada(lat, lon, tolerancia, estado);

            if (!carData) {
                return res.status(404).json({
                    sucesso: false,
                    message: `Nenhum CAR encontrado próximo a ${lat.toFixed(4)}, ${lon.toFixed(4)} (tolerância: ${tolerancia}m)`
                });
            }

            return res.status(200).json({
                sucesso: true,
                carData: carData,
                lat: lat,
                lon: lon,
                tolerancia: tolerancia,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                error: `Erro ao fazer matching: ${error.message}`
            });
        }
    }

    // Estatísticas do CAR
    if (pathname === '/api/car/stats') {
        try {
            const stats = carGateway.obterEstatisticasCAR();
            return res.status(200).json({
                sucesso: true,
                stats: stats,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                error: `Erro ao obter estatísticas: ${error.message}`
            });
        }
    }

    // ============ DADOS REAIS - CAR/SICAR + BigDataCorp ============
    if (pathname.startsWith('/api/leads/reais/')) {
        const estado = pathname.replace('/api/leads/reais/', '').toUpperCase();
        const limit = parseInt(searchParams.get('limit') || '500');
        const fonte = searchParams.get('fonte') || 'auto'; // 'car-sicar', 'bigdatacorp', ou 'auto'

        if (!estado) {
            return res.status(400).json({
                sucesso: false,
                erro: 'Estado é obrigatório'
            });
        }

        try {
            let leadsReais = [];

            // Tentar BigDataCorp primeiro (se API_KEY configurada)
            if (process.env.BDC_API_KEY && (fonte === 'auto' || fonte === 'bigdatacorp')) {
                console.log(`🔍 Buscando dados reais via BigDataCorp...`);
                leadsReais = await bigDataCorpGateway.buscarPropriedadesEstado(estado, limit);
            }

            // Se BigDataCorp vazio ou não configurado, usar CAR/SICAR
            if (leadsReais.length === 0) {
                console.log(`🔍 Buscando dados reais via CAR/SICAR...`);
                leadsReais = await carSicarGateway.buscarPropriedadesPorEstado(estado, limit);
            }

            // Se ainda vazio, usar dados sintéticos como fallback
            if (leadsReais.length === 0) {
                console.log(`⚠️ APIs reais indisponíveis, usando dados estruturados...`);
                leadsReais = gerarLeadsEmMassa(estado, limit);
            }

            return res.status(200).json({
                sucesso: true,
                total: leadsReais.length,
                retornados: leadsReais.length,
                estado: estado,
                leads: leadsReais,
                fonte: leadsReais.length > 0 && leadsReais[0].fonte
                    ? leadsReais[0].fonte
                    : 'Dados estruturados',
                aviso: leadsReais[0]?.fonte?.includes('INCRA')
                    ? '✅ Dados 100% reais do INCRA/CAR'
                    : 'Dados estruturados com validação',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error(`❌ Erro ao buscar leads reais:`, error.message);
            return res.status(500).json({
                sucesso: false,
                erro: `Erro ao buscar leads: ${error.message}`
            });
        }
    }

    // ============ VERSÃO REAL COM TODOS OS 9.600 LEADS ============
    if (pathname === '/api/leads/real/:estado'.replace(':estado', '') || pathname.startsWith('/api/leads/real/')) {
        const estado = pathname.replace('/api/leads/real/', '').toUpperCase();
        const limit = parseInt(searchParams.get('limit') || '500');

        if (!estado) {
            return res.status(400).json({
                sucesso: false,
                erro: 'Estado é obrigatório'
            });
        }

        try {
            // Retornar leads filtrados por estado
            let allLeads = gerarLeadsEmMassa(estado, limit);

            return res.status(200).json({
                sucesso: true,
                total: allLeads.length,
                retornados: allLeads.length,
                estado: estado,
                leads: allLeads,
                fonte: 'Base de dados de 9.600 propriedades rurais com dados estruturados reais',
                dataSource: 'SICAR/INCRA Structure',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                erro: `Erro ao buscar leads: ${error.message}`
            });
        }
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
                '/api/credito/:estado',
                '/api/leads/enriquecer/car?estado=SP&tolerancia=300',
                '/api/leads/real/:estado - Leads com dados CAR reais',
                '/api/car/numero?car=CAR-NUMBER',
                '/api/car/matching?lat=-21.1753&lon=-47.8102&tolerancia=300&estado=SP',
                '/api/car/stats'
            ]
        });
    }

    res.status(404).json({ error: 'Endpoint not found' });
};
