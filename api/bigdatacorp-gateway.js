/**
 * BigDataCorp Gateway - API profissional de dados CAR/SICAR
 *
 * https://docs.bigdatacorp.com.br/
 * 500 requisições/mês GRÁTIS
 *
 * Integração técnica para automação em massa
 */

const https = require('https');
const NodeCache = require('node-cache');

// Cache 24 horas
const bdcCache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

// Configuração (será substituída por variável de ambiente em produção)
const BDC_API_KEY = process.env.BDC_API_KEY || 'demo'; // Solicitar em https://bigdatacorp.com.br

/**
 * Buscar propriedades por estado via BigDataCorp
 * API profissional com documentação e suporte
 */
async function buscarPropriedadesEstado(estado, limite = 500) {
  const cacheKey = `bdc_${estado}_${limite}`;

  if (bdcCache.has(cacheKey)) {
    console.log(`✅ BigDataCorp (CACHE): ${estado}`);
    return bdcCache.get(cacheKey);
  }

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      estado: estado,
      limit: Math.min(limite, 500),
      offset: 0,
      filters: {
        ativo: true
      }
    });

    const options = {
      hostname: 'api.bigdatacorp.com.br',
      path: '/v2/rural/properties',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${BDC_API_KEY}`
      },
      timeout: 15000
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);

          if (response.status !== 'success' || !response.data) {
            console.warn(`⚠️ BigDataCorp: Erro na resposta: ${response.message}`);
            // Fallback para CAR público
            resolve([]);
            return;
          }

          const propriedades = response.data.map(item => ({
            id: `BDC-${item.id || item.car}`,
            numeroCAR: item.car,
            nome: item.property_name || item.denominacao,
            proprietario: item.owner_name || item.proprietario_nome,
            estado: estado,
            municipio: item.municipality || item.municipio,
            modulo: 'Fundiário',

            areaTotal: parseFloat(item.total_area) || 0,
            areaReservaLegal: parseFloat(item.legal_reserve_area) || 0,
            areaPreservacao: parseFloat(item.app_area) || 0,
            percentualRL: item.legal_reserve_percentage || 20,

            coordenadas: {
              latitude: parseFloat(item.latitude) || 0,
              longitude: parseFloat(item.longitude) || 0,
              precisao: 'BigDataCorp API'
            },

            statusCAR: item.car_status === 'ATIVA' ? 'ATIVO' : 'DESATUALIZADO',
            carAtualizado: item.car_status === 'ATIVA',
            rlAtigindo20Porcento: (item.legal_reserve_percentage || 0) >= 20,

            // Dados adicionais BigDataCorp
            cnpjCpf: item.owner_cnpj || item.owner_cpf || '',
            email: item.owner_email || '',
            telefone: item.owner_phone || '',
            tipoProprietario: item.owner_type || 'Pessoa Física',

            fonte: 'BigDataCorp API - Dados CAR/SICAR em Tempo Real',
            dataFonte: new Date().toISOString()
          }));

          bdcCache.set(cacheKey, propriedades);

          console.log(`✅ BigDataCorp: ${propriedades.length} propriedades reais carregadas`);
          resolve(propriedades);
        } catch (error) {
          console.error(`❌ BigDataCorp parse error: ${error.message}`);
          resolve([]);
        }
      });
    });

    req.on('error', (err) => {
      console.warn(`⚠️ BigDataCorp request error: ${err.message}`);
      resolve([]);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Buscar propriedade por CNPJ/CPF do proprietário
 */
async function buscarPorProprietario(cnpjCpf) {
  const cacheKey = `bdc_owner_${cnpjCpf}`;

  if (bdcCache.has(cacheKey)) {
    return bdcCache.get(cacheKey);
  }

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      cnpj_cpf: cnpjCpf.replace(/\D/g, '')
    });

    const options = {
      hostname: 'api.bigdatacorp.com.br',
      path: '/v2/rural/owner-properties',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${BDC_API_KEY}`
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);

          if (response.status !== 'success') {
            resolve([]);
            return;
          }

          const propriedades = response.data || [];
          bdcCache.set(cacheKey, propriedades);

          console.log(`✅ BigDataCorp: ${propriedades.length} propriedades do proprietário ${cnpjCpf}`);
          resolve(propriedades);
        } catch (error) {
          resolve([]);
        }
      });
    });

    req.on('error', (err) => {
      console.warn(`⚠️ BigDataCorp owner search error: ${err.message}`);
      resolve([]);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Estatísticas de requisições (para monitorar limite de 500/mês grátis)
 */
async function obterEstatisticas() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.bigdatacorp.com.br',
      path: '/v2/account/usage',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BDC_API_KEY}`
      },
      timeout: 5000
    };

    https.get(options, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log(`📊 BigDataCorp Usage:`, response.data);
          resolve(response.data);
        } catch (error) {
          resolve({});
        }
      });
    }).on('error', (err) => {
      console.warn(`⚠️ BigDataCorp stats error: ${err.message}`);
      resolve({});
    });
  });
}

module.exports = {
  buscarPropriedadesEstado,
  buscarPorProprietario,
  obterEstatisticas,
  bdcCache
};
