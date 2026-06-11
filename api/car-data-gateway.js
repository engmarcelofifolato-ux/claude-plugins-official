/**
 * CAR Data Gateway - Integração com dados públicos do Cadastro Ambiental Rural
 *
 * Funcionalidade:
 * - Carregamento de dados do CAR (via downloads públicos)
 * - Matching baseado em coordenadas geográficas
 * - Cache inteligente de resultados
 * - Enriquecimento de propriedades com dados reais do CAR
 *
 * Fontes de dados CAR:
 * - https://consultapublica.car.gov.br/publico/imoveis/index (portal de consulta)
 * - https://consultapublica.car.gov.br/publico/downloads (base de dados)
 */

const NodeCache = require('node-cache');

// Cache com TTL de 7 dias para dados do CAR
const carCache = new NodeCache({ stdTTL: 604800, checkperiod: 3600 });

/**
 * Base de dados de exemplo do CAR
 * Em produção, isso seria carregado a partir dos downloads públicos do CAR
 * Estrutura baseada em dados reais do CAR
 * Expandido com múltiplos registros por estado para melhor matching
 */
const carSampleDatabase = [
  // MATO GROSSO
  {
    carId: 'MT-2800000-00000001-A-INCRA-2024',
    estado: 'MT',
    municipio: 'Cuiabá',
    proprietario: 'Fazenda Exemplo 1',
    coordenadas: { latitude: -15.5891, longitude: -56.0955 },
    areaTotal: 250, areaReservaLegal: 50, percentualRL: 20,
    rlCompleta: true, statusCAR: 'ATIVO', carAtualizado: true,
    dataRegistro: '2022-06-15', dataAtualizacao: '2024-06-10',
    geometriaValidada: true, cnpjCpf: '00000000000191'
  },
  {
    carId: 'MT-2800000-00000011-A-INCRA-2024',
    estado: 'MT',
    municipio: 'Sinop',
    proprietario: 'Propriedade Sinop 1',
    coordenadas: { latitude: -11.8554, longitude: -55.4915 },
    areaTotal: 320, areaReservaLegal: 64, percentualRL: 20,
    rlCompleta: true, statusCAR: 'ATIVO', carAtualizado: true,
    dataRegistro: '2023-02-10', dataAtualizacao: '2024-05-20',
    geometriaValidada: true, cnpjCpf: '00000000000201'
  },
  // SÃO PAULO
  {
    carId: 'SP-3500000-00000002-A-INCRA-2024',
    estado: 'SP',
    municipio: 'Ribeirão Preto',
    proprietario: 'Propriedade Agrícola 2',
    coordenadas: { latitude: -21.1753, longitude: -47.8102 },
    areaTotal: 150, areaReservaLegal: 30, percentualRL: 20,
    rlCompleta: true, statusCAR: 'ATIVO', carAtualizado: true,
    dataRegistro: '2023-01-20', dataAtualizacao: '2024-05-15',
    geometriaValidada: true, cnpjCpf: '00000000000192'
  },
  {
    carId: 'SP-3500000-00000012-A-INCRA-2024',
    estado: 'SP',
    municipio: 'Piracicaba',
    proprietario: 'Fazenda Piracicaba',
    coordenadas: { latitude: -22.7297, longitude: -47.6489 },
    areaTotal: 180, areaReservaLegal: 36, percentualRL: 20,
    rlCompleta: true, statusCAR: 'ATIVO', carAtualizado: true,
    dataRegistro: '2022-11-05', dataAtualizacao: '2024-04-18',
    geometriaValidada: true, cnpjCpf: '00000000000202'
  },
  // MINAS GERAIS
  {
    carId: 'MG-3100000-00000003-A-INCRA-2024',
    estado: 'MG',
    municipio: 'Paracatu',
    proprietario: 'Sítio da Esperança',
    coordenadas: { latitude: -17.2288, longitude: -46.3028 },
    areaTotal: 100, areaReservaLegal: 20, percentualRL: 20,
    rlCompleta: true, statusCAR: 'ATIVO', carAtualizado: true,
    dataRegistro: '2021-09-10', dataAtualizacao: '2024-04-20',
    geometriaValidada: true, cnpjCpf: '00000000000193'
  },
  {
    carId: 'MG-3100000-00000013-A-INCRA-2024',
    estado: 'MG',
    municipio: 'Uberlândia',
    proprietario: 'Propriedade Uberlândia',
    coordenadas: { latitude: -18.9117, longitude: -48.2777 },
    areaTotal: 280, areaReservaLegal: 56, percentualRL: 20,
    rlCompleta: true, statusCAR: 'ATIVO', carAtualizado: true,
    dataRegistro: '2023-05-22', dataAtualizacao: '2024-06-01',
    geometriaValidada: true, cnpjCpf: '00000000000203'
  },
  // BAHIA
  {
    carId: 'BA-2900000-00000004-A-INCRA-2024',
    estado: 'BA',
    municipio: 'Feira de Santana',
    proprietario: 'Fazenda Feira',
    coordenadas: { latitude: -12.2626, longitude: -38.9585 },
    areaTotal: 220, areaReservaLegal: 44, percentualRL: 20,
    rlCompleta: true, statusCAR: 'ATIVO', carAtualizado: true,
    dataRegistro: '2023-03-15', dataAtualizacao: '2024-05-25',
    geometriaValidada: true, cnpjCpf: '00000000000204'
  },
  // GOIÁS
  {
    carId: 'GO-2700000-00000005-A-INCRA-2024',
    estado: 'GO',
    municipio: 'Rio Verde',
    proprietario: 'Sítio Rio Verde',
    coordenadas: { latitude: -17.7942, longitude: -50.9192 },
    areaTotal: 200, areaReservaLegal: 40, percentualRL: 20,
    rlCompleta: true, statusCAR: 'ATIVO', carAtualizado: true,
    dataRegistro: '2022-08-30', dataAtualizacao: '2024-06-05',
    geometriaValidada: true, cnpjCpf: '00000000000205'
  },
  // RIO GRANDE DO SUL
  {
    carId: 'RS-4300000-00000006-A-INCRA-2024',
    estado: 'RS',
    municipio: 'Porto Alegre',
    proprietario: 'Propriedade Porto Alegre',
    coordenadas: { latitude: -30.0277, longitude: -51.2287 },
    areaTotal: 120, areaReservaLegal: 24, percentualRL: 20,
    rlCompleta: true, statusCAR: 'ATIVO', carAtualizado: true,
    dataRegistro: '2023-10-10', dataAtualizacao: '2024-06-10',
    geometriaValidada: true, cnpjCpf: '00000000000206'
  },
  // PARANÁ
  {
    carId: 'PR-4100000-00000007-A-INCRA-2024',
    estado: 'PR',
    municipio: 'Maringá',
    proprietario: 'Fazenda Maringá',
    coordenadas: { latitude: -23.4250, longitude: -51.4670 },
    areaTotal: 160, areaReservaLegal: 32, percentualRL: 20,
    rlCompleta: true, statusCAR: 'ATIVO', carAtualizado: true,
    dataRegistro: '2023-04-20', dataAtualizacao: '2024-05-30',
    geometriaValidada: true, cnpjCpf: '00000000000207'
  }
];

/**
 * Calcula distância entre dois pontos usando fórmula de Haversine
 * Distância em metros
 */
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Raio da Terra em metros
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distância em metros
}

/**
 * Busca registro CAR pelo número de CAR
 */
function buscarPorNumeroCar(carNumber) {
  const cacheKey = `car_number_${carNumber}`;

  if (carCache.has(cacheKey)) {
    console.log(`✅ CAR número (CACHE): ${carNumber}`);
    return carCache.get(cacheKey);
  }

  // Em produção, seria consultado na API/base de dados real do CAR
  const carData = carSampleDatabase.find(car => car.carId === carNumber);

  if (carData) {
    carCache.set(cacheKey, carData);
    console.log(`✅ CAR encontrado: ${carNumber}`);
    return carData;
  }

  console.warn(`⚠️ CAR não encontrado: ${carNumber}`);
  return null;
}

/**
 * Busca registros CAR por estado
 */
function buscarPorEstado(estado) {
  const cacheKey = `car_estado_${estado}`;

  if (carCache.has(cacheKey)) {
    console.log(`✅ CAR por estado (CACHE): ${estado}`);
    return carCache.get(cacheKey);
  }

  const records = carSampleDatabase.filter(car => car.estado === estado);
  carCache.set(cacheKey, records);
  console.log(`✅ CAR encontrados: ${estado} - ${records.length} registros`);
  return records;
}

/**
 * Algoritmo principal: Matching por coordenadas
 *
 * Implementa matching fuzzy baseado em distância geográfica
 * com tolerância configurável para levar em conta imprecisão de GPS
 *
 * @param {number} latitude - Latitude do imóvel
 * @param {number} longitude - Longitude do imóvel
 * @param {number} toleranciaMetros - Tolerância em metros (padrão: 300m)
 * @param {string} estado - Estado para restringir busca (otimização)
 * @returns {Object} Dados do CAR encontrados ou null
 */
function matchingPorCoordenada(latitude, longitude, toleranciaMetros = 300, estado = null) {
  if (!latitude || !longitude) {
    console.warn('⚠️ Coordenadas inválidas');
    return null;
  }

  const cacheKey = `car_coord_${latitude.toFixed(5)}_${longitude.toFixed(5)}_${toleranciaMetros}`;

  if (carCache.has(cacheKey)) {
    console.log(`✅ CAR por coordenada (CACHE): ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
    return carCache.get(cacheKey);
  }

  // Filtrar por estado se fornecido (otimização)
  const baseBusca = estado
    ? carSampleDatabase.filter(car => car.estado === estado)
    : carSampleDatabase;

  let melhorMatch = null;
  let menorDistancia = toleranciaMetros;

  // Procurar o registro CAR mais próximo dentro da tolerância
  for (const carRecord of baseBusca) {
    const distancia = calcularDistancia(
      latitude,
      longitude,
      carRecord.coordenadas.latitude,
      carRecord.coordenadas.longitude
    );

    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      melhorMatch = {
        ...carRecord,
        distanciaMetros: Math.round(distancia),
        confianca: Math.max(0, 1 - (distancia / toleranciaMetros)) // 0 a 1
      };
    }
  }

  if (melhorMatch) {
    carCache.set(cacheKey, melhorMatch);
    console.log(`✅ CAR matching: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} (${Math.round(menorDistancia)}m distância)`);
    return melhorMatch;
  }

  console.warn(`⚠️ Nenhum CAR encontrado próximo às coordenadas: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
  return null;
}

/**
 * Matching por município e estado
 * Útil quando coordenadas não estão disponíveis
 */
function matchingPorMunicipio(municipio, estado) {
  const cacheKey = `car_municipio_${estado}_${municipio}`;

  if (carCache.has(cacheKey)) {
    return carCache.get(cacheKey);
  }

  const registros = carSampleDatabase.filter(car =>
    car.estado === estado && car.municipio === municipio
  );

  carCache.set(cacheKey, registros);
  return registros;
}

/**
 * Enriquecimento de propriedade com dados reais do CAR
 * Retorna propriedade original com dados do CAR mesclados
 */
function enriquecerComCAR(propriedade, toleranciaMetros = 300) {
  if (!propriedade.coordenadas) {
    console.warn(`⚠️ Propriedade sem coordenadas: ${propriedade.id}`);
    return {
      ...propriedade,
      carData: null,
      carMatched: false,
      carValidacao: 'coordenadas_ausentes'
    };
  }

  // Tentar match por coordenadas primeiro (mais preciso)
  let carData = matchingPorCoordenada(
    propriedade.coordenadas.latitude,
    propriedade.coordenadas.longitude,
    toleranciaMetros,
    propriedade.estado
  );

  // Se não encontrar por coordenadas, tentar por município
  if (!carData) {
    const registrosMunicipio = matchingPorMunicipio(propriedade.municipio, propriedade.estado);
    if (registrosMunicipio.length > 0) {
      carData = registrosMunicipio[0]; // Pegar primeiro match
      console.log(`ℹ️ CAR encontrado por município: ${propriedade.municipio}`);
    }
  }

  if (!carData) {
    return {
      ...propriedade,
      carData: null,
      carMatched: false,
      carValidacao: 'nao_encontrado'
    };
  }

  // Validação: confirmar dados CAR
  const validacao = validarDadosCAR(propriedade, carData);

  return {
    ...propriedade,
    carData: {
      carId: carData.carId,
      numeroCAR: carData.carId,
      proprietarioCAR: carData.proprietario,
      areaTotalCAR: carData.areaTotal,
      areaRLCAR: carData.areaReservaLegal,
      percentualRLCAR: carData.percentualRL,
      rlComletaCAR: carData.rlCompleta,
      statusCAR: carData.statusCAR,
      carAtualizado: carData.carAtualizado,
      geometriaValidada: carData.geometriaValidada,
      dataAtualizacaoCAR: carData.dataAtualizacao,
      distanciaMetros: carData.distanciaMetros || 0,
      confianca: carData.confianca || 1
    },
    carMatched: true,
    carValidacao: validacao.status,
    carValidacaoDetalhes: validacao.detalhes
  };
}

/**
 * Valida dados CAR comparando com dados da propriedade
 * Retorna status de validação e detalhes
 */
function validarDadosCAR(propriedade, carData) {
  const detalhes = {
    areaCorresponde: false,
    rlCorresponde: false,
    coordenadasCorrespondem: false
  };

  // Validar área (tolerância de ±10%)
  if (propriedade.areaTotal && carData.areaTotal) {
    const diferenca = Math.abs(propriedade.areaTotal - carData.areaTotal) / carData.areaTotal;
    detalhes.areaCorresponde = diferenca <= 0.1;
  }

  // Validar RL
  if (propriedade.areaReservaLegal && carData.areaReservaLegal) {
    const diferenca = Math.abs(propriedade.areaReservaLegal - carData.areaReservaLegal) / carData.areaReservaLegal;
    detalhes.rlCorresponde = diferenca <= 0.15; // Tolerância maior para RL
  }

  // Validar coordenadas (se distância < 100m, consideramos correspondência)
  if (carData.distanciaMetros !== undefined) {
    detalhes.coordenadasCorrespondem = carData.distanciaMetros < 100;
  }

  // Determinar status geral
  const validacoes = Object.values(detalhes).filter(v => v === true).length;
  let status = 'nao_validado';

  if (validacoes === 3) {
    status = 'validado_completo';
  } else if (validacoes === 2) {
    status = 'validado_parcial';
  } else if (validacoes === 1) {
    status = 'validado_minimo';
  }

  return { status, detalhes };
}

/**
 * Busca em massa: Enriquece múltiplas propriedades com dados CAR
 */
function enriquecerMultiplas(propriedades, toleranciaMetros = 300) {
  console.log(`\n🔄 Enriquecendo ${propriedades.length} propriedades com dados CAR...`);

  const enriquecidas = propriedades.map(prop =>
    enriquecerComCAR(prop, toleranciaMetros)
  );

  const com_car = enriquecidas.filter(p => p.carMatched).length;
  const taxa_matching = ((com_car / propriedades.length) * 100).toFixed(1);

  console.log(`✅ Enriquecimento concluído: ${com_car}/${propriedades.length} (${taxa_matching}% com CAR matching)\n`);

  return {
    propriedades: enriquecidas,
    totalProcessados: propriedades.length,
    comCAR: com_car,
    semCAR: propriedades.length - com_car,
    taxaMatching: taxa_matching,
    timestamp: new Date().toISOString()
  };
}

/**
 * Estatísticas do CAR
 */
function obterEstatisticasCAR() {
  const porEstado = {};
  const porStatusCAR = {};

  carSampleDatabase.forEach(car => {
    porEstado[car.estado] = (porEstado[car.estado] || 0) + 1;
    porStatusCAR[car.statusCAR] = (porStatusCAR[car.statusCAR] || 0) + 1;
  });

  return {
    totalRegistros: carSampleDatabase.length,
    porEstado,
    porStatusCAR,
    dataAtualizacao: new Date().toISOString()
  };
}

module.exports = {
  buscarPorNumeroCar,
  buscarPorEstado,
  matchingPorCoordenada,
  matchingPorMunicipio,
  enriquecerComCAR,
  enriquecerMultiplas,
  validarDadosCAR,
  obterEstatisticasCAR,
  calcularDistancia,
  carCache
};
