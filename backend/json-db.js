/**
 * JSON-based database using built-in Node.js fs module
 * Works reliably on Railway without native dependencies
 */

const fs = require('fs');
const path = require('path');

// Use /tmp for Railway (ephemeral but reliable), local for dev
const DB_FILE = process.env.NODE_ENV === 'production'
    ? '/tmp/leads.json'
    : path.join(__dirname, 'leads.json');

let leadsData = {
    leads: [],
    stats: {
        lastUpdated: new Date().toISOString(),
        totalLeads: 0
    }
};

// Load from file if exists
function loadDatabase() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            leadsData = JSON.parse(data);
            console.log('✅ Banco JSON carregado:', DB_FILE);
            return true;
        }
    } catch (err) {
        console.warn('⚠️ Erro ao carregar banco JSON, usando em-memória:', err.message);
    }

    // Initialize with sample data
    initializeSampleData();
    saveDatabase();
    return false;
}

// Save to file
function saveDatabase() {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(leadsData, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.warn('⚠️ Erro ao salvar banco:', err.message);
        // Continue anyway - data stays in memory
        return false;
    }
}

// Initialize with sample data from all modules
function initializeSampleData() {
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

    leadsData.stats.totalLeads = leadsData.leads.length;
    leadsData.stats.lastUpdated = new Date().toISOString();

    console.log(`✅ ${leadsData.leads.length} leads inicializados`);
}

// Get leads by state
function getLeadsByState(estado, modulo = null) {
    let filtered = leadsData.leads.filter(l => l.estado === estado);

    if (modulo) {
        filtered = filtered.filter(l => l.modulo === modulo);
    }

    return filtered;
}

// Get all leads
function getAllLeads() {
    return leadsData.leads;
}

// Add lead
function addLead(lead) {
    leadsData.leads.push(lead);
    leadsData.stats.totalLeads = leadsData.leads.length;
    leadsData.stats.lastUpdated = new Date().toISOString();
    saveDatabase();
    return lead;
}

// Add multiple leads
function addLeads(leads) {
    leadsData.leads.push(...leads);
    leadsData.stats.totalLeads = leadsData.leads.length;
    leadsData.stats.lastUpdated = new Date().toISOString();
    saveDatabase();
    return leads;
}

// Get stats
function getStats() {
    const stats = {
        totalLeads: leadsData.leads.length,
        lastUpdated: leadsData.stats.lastUpdated,
        porModulo: []
    };

    const byModule = {};
    leadsData.leads.forEach(lead => {
        byModule[lead.modulo] = (byModule[lead.modulo] || 0) + 1;
    });

    stats.porModulo = Object.entries(byModule).map(([modulo, total]) => ({
        modulo,
        total
    }));

    return stats;
}

module.exports = {
    loadDatabase,
    saveDatabase,
    getLeadsByState,
    getAllLeads,
    addLead,
    addLeads,
    getStats
};
