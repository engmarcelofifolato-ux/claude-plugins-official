/**
 * APIManager - Abstração de camada de dados
 * Gerencia integração com APIs públicas e cache local
 */

class APIManager {
  constructor() {
    this.cache = new Map();
    this.db = null;
    this.initDB();
  }

  // Initialize IndexedDB for offline cache
  async initDB() {
    return new Promise((resolve) => {
      const request = indexedDB.open('georadar-cache', 1);

      request.onerror = () => console.error('IndexedDB error:', request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('leads')) {
          db.createObjectStore('leads', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }
      };
    });
  }

  // Cache helper - get or fetch data
  async getOrFetch(cacheKey, fetchFn, ttlMinutes = 1440) {
    // Check memory cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < ttlMinutes * 60 * 1000) {
        console.log(`✅ Cache hit: ${cacheKey}`);
        return cached.data;
      }
    }

    // Try to fetch fresh data
    try {
      console.log(`⏳ Fetching: ${cacheKey}`);
      const data = await fetchFn();

      // Store in memory cache
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      // Store in IndexedDB
      await this.setCache(cacheKey, data, ttlMinutes);

      return data;
    } catch (error) {
      console.warn(`❌ Fetch failed for ${cacheKey}:`, error);

      // Fall back to IndexedDB
      const cached = await this.getCache(cacheKey);
      if (cached) {
        console.log(`📦 Using IndexedDB backup: ${cacheKey}`);
        return cached;
      }

      throw error;
    }
  }

  // IndexedDB operations
  async setCache(key, data, ttlMinutes = 1440) {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['cache'], 'readwrite');
      const store = tx.objectStore('cache');
      store.put({
        key,
        data,
        timestamp: Date.now(),
        ttl: ttlMinutes * 60 * 1000
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getCache(key) {
    if (!this.db) return null;

    return new Promise((resolve) => {
      const tx = this.db.transaction(['cache'], 'readonly');
      const store = tx.objectStore('cache');
      const req = store.get(key);

      req.onsuccess = () => {
        const item = req.result;
        if (item && Date.now() - item.timestamp < item.ttl) {
          resolve(item.data);
        } else {
          resolve(null);
        }
      };
    });
  }

  // ===== PUBLIC API INTEGRATIONS =====

  // Get credit scoring data (ECB rates + proprietary algorithm)
  async getCreditScores(region = 'SP') {
    return this.getOrFetch(`credit-scores-${region}`, async () => {
      // In Phase 1: Return calculated scores based on ECB reference rates
      // In Phase 2+: Integrate real ECB API (https://api.stlouisfed.org/)

      const baseRate = 0.05; // 5% base (PRONAF reference)
      const regionalMultiplier = region === 'SP' ? 0.95 : 1.0; // SP has lower rates

      return {
        pronafBase: baseRate * regionalMultiplier,
        pronampBase: (baseRate + 0.03) * regionalMultiplier,
        creditGreen: (baseRate - 0.01) * regionalMultiplier,
        timestamp: new Date().toISOString(),
        source: 'ECB/BNCC Reference'
      };
    }, 1440); // Cache 24h
  }

  // Get CAR data from SICAR
  async searchCAR(cpfCnpj) {
    return this.getOrFetch(`car-${cpfCnpj}`, async () => {
      // In Phase 1: Mock SICAR API response
      // In Phase 2: Real SICAR API integration (https://servicos.incra.gov.br/)

      const carId = 'SP' + Math.random().toString().slice(2, 10);

      return {
        carId,
        proprietario: 'Fazenda Example',
        municipio: 'Ribeirão Preto',
        area: 150.5,
        status: 'validado',
        dataValidacao: new Date().toISOString(),
        dataProximaRenovacao: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        areaPreservada: 45.2,
        percentualPreservacao: 30,
        atividades: ['agricultura', 'pecuária'],
        classeProdutividade: 'III',
        score: 85,
        avisos: ['Renovação em 11 meses']
      };
    }, 1440); // Cache 24h (CAR changes slowly)
  }

  // Get CNPJ data
  async searchCNPJ(cnpj) {
    return this.getOrFetch(`cnpj-${cnpj}`, async () => {
      // In Phase 1: Mock CNPJ response
      // In Phase 2: Real Receita Federal API or B3 CNPJ dataset

      return {
        cnpj: cnpj,
        razaoSocial: 'Agronegócio Example LTDA',
        nomeFantasia: 'Fazenda XYZ',
        status: 'ativa',
        dataCadastro: '2020-05-15',
        capitalSocial: 250000,
        naturezaJuridica: '2062',
        atividades: ['Cultivo de soja', 'Cultivo de milho'],
        credibilidade: 92,
        endereco: {
          logradouro: 'Fazenda Principal',
          municipio: 'Ribeirão Preto',
          uf: 'SP'
        }
      };
    }, 7 * 1440); // Cache 7 days (CNPJ changes slowly)
  }

  // Get weather/climate data for solar calculation
  async getSolarPotential(latitude, longitude) {
    return this.getOrFetch(`solar-${latitude}-${longitude}`, async () => {
      // In Phase 1: Hardcoded average for SP region
      // In Phase 2: Real INMET API (https://www.inmet.gov.br/)

      // São Paulo average: ~4.5 peak sun hours/day
      const baseSolarRadiation = 4.5; // kWh/m²/day
      const capacity = 1.1; // Performance factor

      return {
        latitude,
        longitude,
        dailySolarRadiation: baseSolarRadiation,
        peakSunHours: baseSolarRadiation,
        performanceRatio: capacity,
        monthlyAverage: baseSolarRadiation * 30 * capacity,
        annualProduction: baseSolarRadiation * 365 * capacity,
        source: 'INMET Reference Data',
        reliability: '95% (3+ years average)'
      };
    }, 30 * 1440); // Cache 30 days
  }

  // Calculate credit score (proprietary algorithm - Phase 1)
  calculateCreditScore(lead, regionalRates) {
    const weights = {
      area: 0.15,
      cnpjCredibility: 0.20,
      carStatus: 0.20,
      age: 0.15,
      previousCredit: 0.15,
      region: 0.15
    };

    let score = 0;

    // Area scoring (bigger = better)
    const areaScore = Math.min(100, (lead.area / 500) * 100); // 500ha = 100pt
    score += areaScore * weights.area;

    // CNPJ credibility (if available)
    const cnpjScore = lead.cnpjCredibilidade || 70;
    score += cnpjScore * weights.cnpjCredibility;

    // CAR status scoring
    let carScore = 60;
    if (lead.carStatus === 'validado') carScore = 100;
    else if (lead.carStatus === 'ativo') carScore = 80;
    score += carScore * weights.carStatus;

    // Age of property (3+ years = better)
    const ageScore = Math.min(100, (lead.anoFundacao ? 2024 - lead.anoFundacao : 5) * 15);
    score += ageScore * weights.age;

    // Previous credit operations
    score += (lead.linhasCredito?.length || 0) * 20 * weights.previousCredit;

    // Regional boost (SP gets 5% bonus)
    const regionBoost = lead.estado === 'SP' ? 1.05 : 1.0;

    const finalScore = Math.min(100, Math.round(score * regionBoost));

    return {
      score: finalScore,
      approval: this.scoreToApprovalChance(finalScore),
      breakdown: {
        area: areaScore,
        cnpj: cnpjScore,
        car: carScore,
        age: ageScore
      }
    };
  }

  // Convert score to approval chance %
  scoreToApprovalChance(score) {
    if (score >= 85) return 0.90; // 90%
    if (score >= 75) return 0.75; // 75%
    if (score >= 65) return 0.55; // 55%
    if (score >= 50) return 0.30; // 30%
    return 0.10; // 10%
  }

  // Get all leads with scores (Phase 1 - still mock, will be real API)
  async getLeadsWithScores(moduloNome) {
    return this.getOrFetch(`leads-${moduloNome}`, async () => {
      // This will be replaced with real API call in Phase 2
      // For now, will use existing mock data from main HTML
      return window.leadsDataByModulo[moduloNome] || [];
    }, 24 * 60); // Cache 24h
  }
}

// Global instance
const apiManager = new APIManager();
