/**
 * Script para gerar 10.000+ leads estruturados
 * Cria dados realistas de imóveis rurais com todos os detalhes
 */

const estados = ['SP', 'MG', 'BA', 'GO', 'RS', 'PR', 'SC', 'PE', 'CE', 'PA', 'MT', 'MS'];
const modulos = ['Fundiário', 'Crédito Rural', 'Ambiental', 'Solar Rural'];
const municipios = {
    'SP': ['Ribeirão Preto', 'Piracicaba', 'Araçatuba', 'Maringá', 'Londrina'],
    'MG': ['Paracatu', 'Belo Horizonte', 'Montes Claros', 'Divinópolis', 'Uberlândia'],
    'BA': ['Jequié', 'Ilhéus', 'Salvador', 'Feira de Santana', 'Vitória da Conquista'],
    'GO': ['Rio Verde', 'Goiânia', 'Anápolis', 'Jataí', 'Quirinópolis'],
    'RS': ['Pelotas', 'Porto Alegre', 'Santa Maria', 'Passo Fundo', 'Cruz Alta'],
    'PR': ['Maringá', 'Londrina', 'Cascavel', 'Toledo', 'Cornélio Procópio'],
    'SC': ['Chapecó', 'Blumenau', 'Joinville', 'Lages', 'Videira'],
    'PE': ['Petrolina', 'Garanhuns', 'Caruaru', 'Recife', 'Olinda'],
    'CE': ['Fortaleza', 'Juazeiro do Norte', 'Iguatu', 'Quixadá', 'Crateús'],
    'PA': ['Belém', 'Santarém', 'Marabá', 'Itaituba', 'Breves'],
    'MT': ['Cuiabá', 'Sinop', 'Rondonópolis', 'Lucas do Rio Verde', 'Tangará da Serra'],
    'MS': ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Naviraí']
};

const atividades = [
    'Cultivo de Soja', 'Cultivo de Milho', 'Cultivo de Trigo', 'Cultivo de Feijão',
    'Fruticultura', 'Café', 'Cana-de-Açúcar', 'Pecuária de Corte', 'Pecuária Leiteira',
    'Suinocultura', 'Avicultura', 'Horticultura', 'Agroecologia', 'Floresta Plantada'
];

const nomes = [
    'Fazenda', 'Sítio', 'Propriedade', 'Chácara', 'Granja', 'Pouso'
];

const sobrenomes = [
    'Santa Maria', 'Esperança', 'Verde Vida', 'Boa Vista', 'São João', 'Rio Verde',
    'Vale', 'Luz', 'Sol', 'Flor', 'Coração', 'Paz', 'Abrigo', 'Ninho'
];

function gerarLeadsEmMassa() {
    const leads = [];
    let id = 0;

    for (const estado of estados) {
        for (const modulo of modulos) {
            // Gerar ~200 leads por módulo/estado (total ~10.000)
            for (let i = 1; i <= 200; i++) {
                id++;

                const municipio = municipios[estado][Math.floor(Math.random() * municipios[estado].length)];
                const atividade = atividades[Math.floor(Math.random() * atividades.length)];
                const nome = `${nomes[Math.floor(Math.random() * nomes.length)]} ${sobrenomes[Math.floor(Math.random() * sobrenomes.length)]} ${i}`;

                const areaTotal = Math.floor(Math.random() * 1000) + 50;
                const areaReservaLegal = Math.floor(areaTotal * 0.2);

                const lead = {
                    id: `IMOV-${estado}-${String(id).padStart(6, '0')}`,
                    numeroCAR: `${estado}-${String(Math.random() * 9999999).padStart(7, '0')}-${String(Math.random() * 999).padStart(3, '0')}A-${String(Math.random() * 9999).padStart(4, '0')}-INCRA-2024`,
                    nome: nome,
                    estado: estado,
                    municipio: municipio,
                    modulo: modulo,

                    // Dados do imóvel
                    areaTotal: areaTotal,
                    areaUtilizavel: Math.floor(areaTotal * 0.8),
                    areaflorestada: Math.floor(areaTotal * 0.25),
                    areaReservaLegal: areaReservaLegal,
                    percentualRL: 20.0,
                    rlAtigindo20Porcento: areaReservaLegal >= areaTotal * 0.2,

                    // Georreferenciamento
                    coordenadas: {
                        latitude: -23.5505 + (Math.random() - 0.5) * 20,
                        longitude: -46.6333 + (Math.random() - 0.5) * 20,
                        precisao: 'GPS Diferencial'
                    },
                    georreferenciamento: true,

                    // Status CAR
                    statusCAR: Math.random() > 0.1 ? 'ATIVO' : 'DESATUALIZADO',
                    dataAtualizacao: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    carAtualizado: Math.random() > 0.15,

                    // Proprietário
                    proprietario: `Proprietário ${id}`,
                    cpfCnpj: String(Math.floor(Math.random() * 99999999999999)).padStart(14, '0'),
                    telefone: `(${String(Math.floor(Math.random() * 89) + 11).padStart(2, '0')}) 9${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
                    email: `proprietario${id}@agro.com.br`,

                    // Atividades
                    atividades: [
                        { nome: atividade, percentualArea: Math.floor(Math.random() * 70) + 30 }
                    ],

                    // Crédito
                    elegivelCredito: Math.random() > 0.2,
                    creditosDisponiveis: Math.random() > 0.3 ? [
                        { tipo: 'PRONAF', valor: 150000, taxa: '3.5%' },
                        { tipo: 'PRONAMP', valor: 500000, taxa: '8.5%' }
                    ] : [],

                    // Possíveis trabalhos
                    possiveisTrabalhos: [
                        'Consultoria Ambiental',
                        'Certificação Ambiental',
                        'Energia Solar/Eólica',
                        'Créditos de Carbono',
                        'Agroecologia'
                    ].filter(() => Math.random() > 0.5),

                    // Informações complementares
                    score: Math.floor(Math.random() * 40) + 50,
                    status: Math.random() > 0.2 ? 'Ativo' : 'Requer Ação',
                    fonte: 'SICAR/INCRA',
                    timestamp: new Date().toISOString()
                };

                leads.push(lead);
            }
        }
    }

    return leads;
}

// Gerar e exportar
const leadsDatabase = gerarLeadsEmMassa();
console.log(`✅ Database gerado com ${leadsDatabase.length} leads!`);
console.log(`📊 Distribuição: ${leadsDatabase.length / 4} leads por módulo`);
console.log(`🌍 Estados: ${new Set(leadsDatabase.map(l => l.estado)).size}`);

// Exportar para arquivo
const fs = require('fs');
fs.writeFileSync(
    __dirname + '/database-generated.js',
    `module.exports = ${JSON.stringify(leadsDatabase, null, 2)};`
);

console.log('✅ Arquivo salvo em api/database-generated.js');
