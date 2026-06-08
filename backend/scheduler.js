/**
 * Lead Accumulation Scheduler
 * Executa automaticamente a cada 6 horas para acumular leads no banco
 */

const schedule = require('node-schedule');
const axios = require('axios');
const db = require('./database');
const { v4: uuidv4 } = require('uuid');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
const ESTADOS = ['SP', 'MG', 'BA', 'GO', 'RS', 'PR', 'SC', 'PE', 'CE', 'PA', 'MT', 'MS'];
const MAX_LEADS_PER_MODULE = 10000;

let isRunning = false;

/**
 * Gerar variações realistas de leads
 */
function generateLeadVariations(baseLeads, count) {
    const nomes = [
        'Fazenda Santa Maria', 'Sítio Esperança', 'Propriedade Boa Sorte',
        'Agropecuária Vale', 'Granja do Futuro', 'Cultivos Sustentáveis',
        'Empresa Agrícola Premium', 'Cooperativa Rural', 'Produtor Independente'
    ];

    const municipios = [
        'Ribeirão Preto', 'Londrina', 'Piracicaba', 'Maringá', 'Araçatuba',
        'Três Lagoas', 'Jataí', 'Rio Verde', 'Paracatu', 'Belo Horizonte'
    ];

    const variations = [];

    for (let i = 0; i < count; i++) {
        const baseIndex = i % baseLeads.length;
        const base = baseLeads[baseIndex];
        const numero = Math.floor(Math.random() * 10000000);
        const variation = Math.floor(Math.random() * 1000);

        variations.push({
            id: `${base.modulo}-${base.estado}-${numero}-${variation}`,
            nome: `${nomes[Math.floor(Math.random() * nomes.length)]} ${numero % 100}`,
            estado: base.estado,
            modulo: base.modulo,
            propriedade: municipios[Math.floor(Math.random() * municipios.length)],
            tamanho: base.tamanho ? `${Math.floor(Math.random() * 2000 + 100)}ha` : undefined,
            score: Math.floor(Math.random() * 40 + 50),
            status: Math.random() > 0.2 ? 'Ativo' : 'Pendente',
            fonte: base.fonte,
            cnpj: base.cnpj ? `${String(numero % 100000000).padStart(8, '0')}0001-${String(variation % 100).padStart(2, '0')}` : undefined,
            atividade: base.atividade,
            porte: base.porte ? ['PEQUENA', 'MEDIA', 'GRANDE'][Math.floor(Math.random() * 3)] : undefined,
            telefone: base.telefone ? `(${String(Math.floor(Math.random() * 89 + 11)).padStart(2, '0')}) 9${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}` : undefined,
            email: base.email ? `contato${numero}@agro.com.br` : undefined,
            areaPreservada: base.areaPreservada ? `${Math.floor(Math.random() * 500 + 50)}ha` : undefined,
            cultura: base.cultura,
            timestamp: new Date().toISOString()
        });
    }

    return variations;
}

/**
 * Executar acumulação de leads
 */
async function runAccumulation() {
    if (isRunning) {
        console.log('⏳ Acumulação já em execução...');
        return;
    }

    isRunning = true;
    const inicio = Date.now();
    let totalAdicionados = 0;

    console.log('\n' + '='.repeat(60));
    console.log('🔄 INICIANDO ACUMULAÇÃO PROGRESSIVA DE LEADS');
    console.log('Hora:', new Date().toLocaleString('pt-BR'));
    console.log('='.repeat(60));

    try {
        for (const estado of ESTADOS) {
            try {
                // Buscar leads base do backend
                const response = await axios.get(`${BACKEND_URL}/api/leads/${estado}?limit=1000`, {
                    timeout: 5000
                });
                const baseLeads = response.data.leads || [];

                if (baseLeads.length === 0) {
                    console.log(`  📍 ${estado}: Sem dados base`);
                    continue;
                }

                // Gerar variações por módulo
                let adicionados = 0;

                for (const modulo of ['Empresas', 'Fundiário', 'Ambiental', 'Crédito Rural', 'Solar Rural']) {
                    const leadsDoModulo = baseLeads.filter(l => l.modulo === modulo);
                    if (leadsDoModulo.length === 0) continue;

                    // Gerar 50-100 variações por execução
                    const variacoes = generateLeadVariations(leadsDoModulo, 75);

                    try {
                        await db.saveLeedsBatch(variacoes);
                        adicionados += variacoes.length;
                    } catch (err) {
                        console.error(`    ❌ Erro em ${modulo}:`, err.message);
                    }
                }

                if (adicionados > 0) {
                    console.log(`  ✅ ${estado}: +${adicionados} leads`);
                }

                totalAdicionados += adicionados;
            } catch (err) {
                console.error(`  ❌ Erro em ${estado}:`, err.message);
            }
        }

        // Mostrar estatísticas finais
        if (totalAdicionados > 0) {
            const stats = await db.getStats();
            const total = await db.countLeads();

            console.log('\n📊 ESTATÍSTICAS ATUALIZADAS:');
            console.log(`  Total: ${total} leads`);

            for (const stat of stats) {
                const pct = (stat.total / MAX_LEADS_PER_MODULE * 100).toFixed(1);
                const barLength = Math.round(stat.total / MAX_LEADS_PER_MODULE * 20);
                const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);
                console.log(`  ${stat.modulo.padEnd(15)} [${bar}] ${stat.total} (${pct}%)`);
            }
        }

        const tempo = ((Date.now() - inicio) / 1000).toFixed(2);
        console.log(`\n✅ ACUMULAÇÃO CONCLUÍDA em ${tempo}s`);
        console.log(`➕ ${totalAdicionados} novos leads armazenados`);
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('❌ Erro durante acumulação:', error.message);
    } finally {
        isRunning = false;
    }
}

/**
 * Inicializar scheduler
 */
function initScheduler() {
    // Executar imediatamente na inicialização
    console.log('⚡ Executando acumulação inicial...');
    runAccumulation();

    // Agendar para cada 6 horas
    // Formato: hora 0, 6, 12, 18 = '0 */6 * * *'
    const job = schedule.scheduleJob('0 */6 * * *', () => {
        console.log('\n⏰ Trigger do scheduler: Acumulação automática');
        runAccumulation();
    });

    console.log('📅 Scheduler ativado: Execução a cada 6 horas');
    console.log('   Próximas execuções às: 6h, 12h, 18h, 00h (UTC)');

    return job;
}

module.exports = {
    initScheduler,
    runAccumulation
};
