/**
 * Real Data Backend - Endpoints com dados REAIS das APIs públicas brasileiras
 * ReceitaWS + IBGE SIDRA + INMET WIS 2.0 + Banco Central
 */

const realData = require('./real-data-gateway');

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
      tipo: 'Real Data Gateway',
      apis: [
        'ReceitaWS',
        'IBGE SIDRA',
        'INMET WIS 2.0',
        'Banco Central'
      ],
      timestamp: new Date().toISOString()
    });
  }

  // ============ BUSCAR LEAD REAL POR CNPJ ============
  if (pathname === '/api/lead/real') {
    const cnpj = searchParams.get('cnpj');
    const estado = searchParams.get('estado') || 'SP';

    if (!cnpj) {
      return res.status(400).json({
        sucesso: false,
        erro: 'CNPJ é obrigatório (ex: ?cnpj=06990590000123&estado=SP)'
      });
    }

    try {
      const lead = await realData.buscarLeadReal(cnpj, estado);

      if (!lead) {
        return res.status(404).json({
          sucesso: false,
          erro: `Lead real não encontrado para CNPJ: ${cnpj}`
        });
      }

      return res.status(200).json({
        sucesso: true,
        lead: lead,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        erro: `Erro ao buscar lead real: ${error.message}`
      });
    }
  }

  // ============ BUSCAR PROPRIETÁRIO POR CNPJ ============
  if (pathname === '/api/proprietario') {
    const cnpj = searchParams.get('cnpj');

    if (!cnpj) {
      return res.status(400).json({
        sucesso: false,
        erro: 'CNPJ é obrigatório'
      });
    }

    try {
      const proprietario = await realData.buscarProprietarioPorCNPJ(cnpj);

      return res.status(200).json({
        sucesso: true,
        proprietario: proprietario,
        fonte: 'ReceitaWS',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        erro: `Erro ao buscar proprietário: ${error.message}`
      });
    }
  }

  // ============ BUSCAR PRODUÇÃO AGRÍCOLA ============
  if (pathname === '/api/producao-agricola') {
    const estado = searchParams.get('estado') || 'SP';
    const cultura = searchParams.get('cultura') || 'Milho';

    try {
      const producao = await realData.buscarProducaoAgricola(estado, cultura);

      return res.status(200).json({
        sucesso: true,
        producao: producao,
        fonte: 'IBGE SIDRA',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        erro: `Erro ao buscar produção agrícola: ${error.message}`
      });
    }
  }

  // ============ BUSCAR DADOS METEOROLÓGICOS ============
  if (pathname === '/api/meteorologia') {
    const estado = searchParams.get('estado') || 'SP';

    try {
      const meteorologia = await realData.buscarDadosMeterologicos(estado);

      return res.status(200).json({
        sucesso: true,
        estacoes: meteorologia,
        total: meteorologia.length,
        fonte: 'INMET WIS 2.0',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        erro: `Erro ao buscar dados meteorológicos: ${error.message}`
      });
    }
  }

  // ============ BUSCAR CRÉDITO RURAL ============
  if (pathname === '/api/credito-rural') {
    try {
      const credito = realData.buscarCreditoRuralBC();

      return res.status(200).json({
        sucesso: true,
        credito: credito,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        erro: `Erro ao buscar crédito rural: ${error.message}`
      });
    }
  }

  // ============ ROOT ============
  if (pathname === '/' || pathname === '') {
    return res.status(200).json({
      status: 'ok',
      tipo: 'Real Data Gateway',
      descricao: 'Backend com dados REAIS das APIs públicas brasileiras',
      apis: [
        'ReceitaWS - Proprietários',
        'IBGE SIDRA - Produção Agrícola',
        'INMET WIS 2.0 - Dados Meteorológicos',
        'Banco Central - Crédito Rural'
      ],
      endpoints: [
        '/health',
        '/api/lead/real?cnpj=XXXXXXXXXXXXXXXX&estado=SP',
        '/api/proprietario?cnpj=XXXXXXXXXXXXXXXX',
        '/api/producao-agricola?estado=SP&cultura=Milho',
        '/api/meteorologia?estado=SP',
        '/api/credito-rural'
      ],
      timestamp: new Date().toISOString()
    });
  }

  res.status(404).json({ erro: 'Endpoint not found' });
};
