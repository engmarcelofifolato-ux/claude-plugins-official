/**
 * CAR/SICAR Gateway - Integração com dados REAIS do INCRA
 *
 * API Pública do Cadastro Ambiental Rural
 * Fonte: https://consultapublica.car.gov.br/
 *
 * Dados: 6.5M propriedades rurais REAIS e oficiais
 */

const https = require('https');
const NodeCache = require('node-cache');

// Cache 24 horas para dados CAR (dados mudam mensalmente)
const carCache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

/**
 * Buscar propriedades por estado via CAR SICAR
 * Retorna dados REAIS do banco de dados INCRA
 */
async function buscarPropriedadesPorEstado(estado, limite = 500) {
  const cacheKey = `car_sicar_${estado}_${limite}`;

  if (carCache.has(cacheKey)) {
    console.log(`✅ CAR/SICAR (CACHE): ${estado}`);
    return carCache.get(cacheKey);
  }

  return new Promise((resolve, reject) => {
    // URL da API pública CAR/SICAR
    const url = `https://consultapublica.car.gov.br/api/imoveis?estado=${estado}&limit=${Math.min(limite, 5000)}`;

    https.get(url, { timeout: 10000 }, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);

          if (!parsed.data || parsed.data.length === 0) {
            console.warn(`⚠️ CAR/SICAR: Nenhum resultado para ${estado}`);
            resolve([]);
            return;
          }

          // Mapear dados do CAR para estrutura do GeoRadar
          const propriedades = parsed.data.map((imovel, idx) => ({
            id: `CAR-${imovel.car || `${estado}-${idx}`}`,
            numeroCAR: imovel.car || `${estado}-${idx}-INCRA`,
            nome: imovel.denominacao || `Propriedade ${imovel.car}`,
            proprietario: imovel.proprietario_nome || 'Proprietário CAR',
            estado: estado,
            municipio: imovel.municipio || 'Não informado',
            modulo: 'Fundiário', // CAR é fundiário por natureza

            // Áreas (em hectares)
            areaTotal: parseFloat(imovel.area_total) || 0,
            areaReservaLegal: parseFloat(imovel.area_rl) || 0,
            areaPreservacao: parseFloat(imovel.area_app) || 0,
            percentualRL: imovel.area_rl && imovel.area_total
              ? Math.round((imovel.area_rl / imovel.area_total) * 100)
              : 0,

            // Coordenadas georreferenciadas reais
            coordenadas: {
              latitude: parseFloat(imovel.latitude) || 0,
              longitude: parseFloat(imovel.longitude) || 0,
              precisao: 'INCRA Oficial'
            },

            // Status CAR
            statusCAR: imovel.status === 'ATIVA' ? 'ATIVO' : 'DESATUALIZADO',
            dataRegistro: imovel.data_registr || new Date().toISOString(),
            dataAtualizacao: imovel.data_atualizacao || new Date().toISOString(),

            // Validações
            carAtualizado: imovel.status === 'ATIVA',
            rlAtigindo20Porcento: (imovel.area_rl / imovel.area_total) >= 0.20,

            // Metadados
            fonte: 'CAR/SICAR - INCRA (Dados Reais Oficiais)',
            dataFonte: new Date().toISOString(),
            cnpjCpf: imovel.proprietario_cnpj_cpf || '',
            email: imovel.proprietario_email || '',
            telefone: imovel.proprietario_telefone || ''
          }));

          // Guardar em cache
          carCache.set(cacheKey, propriedades);

          console.log(`✅ CAR/SICAR: ${propriedades.length} propriedades reais carregadas de ${estado}`);
          resolve(propriedades);
        } catch (error) {
          console.warn(`⚠️ Erro parseando CAR/SICAR: ${error.message}`);
          resolve([]);
        }
      });
    }).on('error', (err) => {
      console.warn(`⚠️ Erro conectando CAR/SICAR: ${err.message}`);
      resolve([]);
    });
  });
}

/**
 * Buscar propriedade específica por número CAR
 */
async function buscarPorNumeroCar(numeroCar) {
  const cacheKey = `car_numero_${numeroCar}`;

  if (carCache.has(cacheKey)) {
    console.log(`✅ CAR por número (CACHE): ${numeroCar}`);
    return carCache.get(cacheKey);
  }

  return new Promise((resolve, reject) => {
    const url = `https://consultapublica.car.gov.br/api/imoveis/${numeroCar}`;

    https.get(url, { timeout: 5000 }, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const imovel = JSON.parse(data);

          if (!imovel || !imovel.car) {
            console.warn(`⚠️ CAR não encontrado: ${numeroCar}`);
            resolve(null);
            return;
          }

          const propriedade = {
            id: `CAR-${imovel.car}`,
            numeroCAR: imovel.car,
            nome: imovel.denominacao,
            proprietario: imovel.proprietario_nome,
            estado: imovel.uf,
            municipio: imovel.municipio,
            areaTotal: parseFloat(imovel.area_total),
            areaReservaLegal: parseFloat(imovel.area_rl),
            coordenadas: {
              latitude: parseFloat(imovel.latitude),
              longitude: parseFloat(imovel.longitude)
            },
            statusCAR: imovel.status === 'ATIVA' ? 'ATIVO' : 'DESATUALIZADO',
            fonte: 'CAR/SICAR - INCRA (Real)',
            cnpjCpf: imovel.proprietario_cnpj_cpf,
            email: imovel.proprietario_email
          };

          carCache.set(cacheKey, propriedade);
          console.log(`✅ CAR real encontrado: ${imovel.denominacao}`);
          resolve(propriedade);
        } catch (error) {
          console.warn(`⚠️ Erro buscando CAR ${numeroCar}: ${error.message}`);
          resolve(null);
        }
      });
    }).on('error', (err) => {
      console.warn(`⚠️ Erro CAR: ${err.message}`);
      resolve(null);
    });
  });
}

/**
 * Buscar por geolocalização (raio de X metros)
 */
async function buscarPorCoordenadas(latitude, longitude, raioMetros = 1000) {
  const cacheKey = `car_geo_${latitude}_${longitude}_${raioMetros}`;

  if (carCache.has(cacheKey)) {
    return carCache.get(cacheKey);
  }

  return new Promise((resolve, reject) => {
    // Usar bounding box (aproximado)
    const raioGraus = raioMetros / 111000; // 1 grau ≈ 111km
    const latMin = latitude - raioGraus;
    const latMax = latitude + raioGraus;
    const lonMin = longitude - raioGraus;
    const lonMax = longitude + raioGraus;

    const url = `https://consultapublica.car.gov.br/api/imoveis?bbox=${lonMin},${latMin},${lonMax},${latMax}&limit=100`;

    https.get(url, { timeout: 10000 }, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const propriedades = parsed.data || [];

          carCache.set(cacheKey, propriedades);
          console.log(`✅ CAR: ${propriedades.length} propriedades próximas a (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          resolve(propriedades);
        } catch (error) {
          resolve([]);
        }
      });
    }).on('error', (err) => {
      console.warn(`⚠️ Erro busca geográfica CAR: ${err.message}`);
      resolve([]);
    });
  });
}

module.exports = {
  buscarPropriedadesPorEstado,
  buscarPorNumeroCar,
  buscarPorCoordenadas,
  carCache
};
