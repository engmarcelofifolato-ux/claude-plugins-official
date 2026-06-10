// Database estruturado com dados REALISTAS de imóveis rurais
const leadsDatabase = [
    // IMÓVEL 1 - Fazenda de Soja - SP
    {
        id: 'IMOV-SP-001-CAR',
        numeroCAR: 'SP-3550308-820A-9876-INCRA-2023',
        nome: 'Fazenda Santa Maria',
        estado: 'SP',
        municipio: 'Ribeirão Preto',
        modulo: 'Fundiário',

        // Dados do imóvel
        areaTotal: 450.5,
        areaUtilizavel: 380.2,
        areaflorestada: 120.0,
        areaReservaLegal: 90.1,
        percentualRL: 20.0,
        rlAtigindo20Porcento: true,
        coordenadas: {
            latitude: -21.1794,
            longitude: -47.8055,
            precisao: 'GPS Diferencial'
        },
        georreferenciamento: true,

        // Status CAR
        statusCAR: 'ATIVO',
        dataAtualizacao: '2024-06-15',
        carAtualizado: true,
        diasDesdeUltimaAtualizacao: 4,

        // Atividades
        atividades: [
            { nome: 'Cultivo de Soja', percentualArea: 60 },
            { nome: 'Cultivo de Milho', percentualArea: 25 },
            { nome: 'Preservação Florestal', percentualArea: 15 }
        ],

        // Propriedade
        proprietario: 'João Silva Santos',
        cpfCnpj: '12345678901234',
        telefone: '(16) 99876-5432',
        email: 'joao@agro.com.br',

        // Situação ambiental
        tempoDecorridoDesmatamento: 0,
        foiDesmatado: false,
        areaDesmatada: 0,
        multas: false,
        embargo: false,

        // Crédito e financiamentos
        elegivelCredito: true,
        creditosDisponiveis: [
            { tipo: 'PRONAF', valor: 150000, taxa: '3.5%' },
            { tipo: 'PRONAMP', valor: 500000, taxa: '8.5%' },
            { tipo: 'Custeio', valor: 200000, taxa: '7.2%' }
        ],

        // Potencial de negócios
        possiveisTrabalhos: [
            'Consultoria Ambiental',
            'Auditoria CAR',
            'Certificação Ambiental',
            'Energia Solar Rural',
            'Crédito de Carbono'
        ],

        // Informações complementares
        score: 85,
        status: 'Ativo',
        fonte: 'SICAR/INCRA',
        timestamp: new Date().toISOString()
    },

    // IMÓVEL 2 - Pecuária - MG
    {
        id: 'IMOV-MG-002-CAR',
        numeroCAR: 'MG-3125809-450B-5432-INCRA-2023',
        nome: 'Fazenda Esperança Gado',
        estado: 'MG',
        municipio: 'Paracatu',
        modulo: 'Fundiário',

        areaTotal: 800.0,
        areaUtilizavel: 650.0,
        areaflorestada: 160.0,
        areaReservaLegal: 160.0,
        percentualRL: 20.0,
        rlAtigindo20Porcento: true,

        coordenadas: {
            latitude: -17.2292,
            longitude: -46.6325,
            precisao: 'GPS Diferencial'
        },
        georreferenciamento: true,

        statusCAR: 'ATIVO',
        dataAtualizacao: '2024-05-20',
        carAtualizado: true,
        diasDesdeUltimaAtualizacao: 25,

        atividades: [
            { nome: 'Pecuária de Corte', percentualArea: 70 },
            { nome: 'Preservação Florestal', percentualArea: 20 },
            { nome: 'Pastagem Nativa', percentualArea: 10 }
        ],

        proprietario: 'Maria Santos Oliveira',
        cpfCnpj: '98765432109876',
        telefone: '(34) 98765-4321',
        email: 'maria@pecuaria.com.br',

        tempoDecorridoDesmatamento: 5,
        foiDesmatado: true,
        areaDesmatada: 50.0,
        multas: false,
        embargo: false,

        elegivelCredito: true,
        creditosDisponiveis: [
            { tipo: 'PRONAF', valor: 200000, taxa: '3.5%' },
            { tipo: 'Moderfrota', valor: 250000, taxa: '13.5%' },
            { tipo: 'Custeio Pecuário', valor: 150000, taxa: '7.8%' }
        ],

        possiveisTrabalhos: [
            'Melhoramento Genético',
            'Rotação de Pastagens',
            'Energia de Biomassa',
            'Certificação de Origem',
            'Programa CAP (Carbono Agro-Pecuário)'
        ],

        score: 78,
        status: 'Ativo',
        fonte: 'SICAR/INCRA',
        timestamp: new Date().toISOString()
    },

    // IMÓVEL 3 - Café - BA
    {
        id: 'IMOV-BA-003-CAR',
        numeroCAR: 'BA-2929205-330C-7654-INCRA-2023',
        nome: 'Fazenda Café Premium',
        estado: 'BA',
        municipio: 'Jequié',
        modulo: 'Fundiário',

        areaTotal: 320.0,
        areaUtilizavel: 250.0,
        areaflorestada: 65.0,
        areaReservaLegal: 64.0,
        percentualRL: 20.0,
        rlAtigindo20Porcento: true,

        coordenadas: {
            latitude: -13.8629,
            longitude: -40.0734,
            precisao: 'GPS Diferencial'
        },
        georreferenciamento: true,

        statusCAR: 'ATIVO',
        dataAtualizacao: '2024-06-01',
        carAtualizado: true,
        diasDesdeUltimaAtualizacao: 18,

        atividades: [
            { nome: 'Cultivo de Café', percentualArea: 80 },
            { nome: 'Preservação Florestal', percentualArea: 20 }
        ],

        proprietario: 'Carlos Mendes Ferreira',
        cpfCnpj: '55555555555555',
        telefone: '(73) 99999-8888',
        email: 'carlos@cafe.com.br',

        tempoDecorridoDesmatamento: 0,
        foiDesmatado: false,
        areaDesmatada: 0,
        multas: false,
        embargo: false,

        elegivelCredito: true,
        creditosDisponiveis: [
            { tipo: 'Custeio Café', valor: 100000, taxa: '6.5%' },
            { tipo: 'PRONAMP', valor: 400000, taxa: '8.5%' }
        ],

        possiveisTrabalhos: [
            'Certificação de Origem',
            'Rastreabilidade de Café',
            'Processamento Local',
            'Agroecologia',
            'Venda Direta (Direct Trade)'
        ],

        score: 92,
        status: 'Ativo',
        fonte: 'SICAR/INCRA',
        timestamp: new Date().toISOString()
    },

    // IMÓVEL 4 - Grãos - GO
    {
        id: 'IMOV-GO-004-CAR',
        numeroCAR: 'GO-2714400-260D-4321-INCRA-2023',
        nome: 'Fazenda Rio Verde',
        estado: 'GO',
        municipio: 'Rio Verde',
        modulo: 'Fundiário',

        areaTotal: 1200.0,
        areaUtilizavel: 950.0,
        areaflorestada: 250.0,
        areaReservaLegal: 240.0,
        percentualRL: 20.0,
        rlAtigindo20Porcento: true,

        coordenadas: {
            latitude: -17.7883,
            longitude: -50.9145,
            precisao: 'GPS Diferencial'
        },
        georreferenciamento: true,

        statusCAR: 'DESATUALIZADO',
        dataAtualizacao: '2023-08-10',
        carAtualizado: false,
        diasDesdeUltimaAtualizacao: 334,

        atividades: [
            { nome: 'Cultivo de Soja', percentualArea: 50 },
            { nome: 'Cultivo de Milho', percentualArea: 35 },
            { nome: 'Preservação Florestal', percentualArea: 15 }
        ],

        proprietario: 'Empresa Agrícola GoiasAgroXXI S/A',
        cpfCnpj: '12345678000199',
        telefone: '(64) 3610-5000',
        email: 'contato@goiasagro.com.br',

        tempoDecorridoDesmatamento: 2,
        foiDesmatado: true,
        areaDesmatada: 80.0,
        multas: true,
        embargo: false,

        elegivelCredito: false,
        creditosDisponiveis: [],

        possiveisTrabalhos: [
            'Atualização de CAR (URGENTE)',
            'Regularização Ambiental',
            'Defesa em Multa Ambiental',
            'Recomposição de RL'
        ],

        score: 45,
        status: 'Requer Ação',
        fonte: 'SICAR/INCRA',
        timestamp: new Date().toISOString()
    },

    // IMÓVEL 5 - Sustentável - RS
    {
        id: 'IMOV-RS-005-CAR',
        numeroCAR: 'RS-4309800-150E-9876-INCRA-2023',
        nome: 'Sítio Agroecológico Verde Vida',
        estado: 'RS',
        municipio: 'Pelotas',
        modulo: 'Fundiário',

        areaTotal: 150.0,
        areaUtilizavel: 120.0,
        areaflorestada: 50.0,
        areaReservaLegal: 30.0,
        percentualRL: 20.0,
        rlAtigindo20Porcento: true,

        coordenadas: {
            latitude: -28.2649,
            longitude: -52.6829,
            precisao: 'GPS Diferencial'
        },
        georreferenciamento: true,

        statusCAR: 'ATIVO',
        dataAtualizacao: '2024-06-10',
        carAtualizado: true,
        diasDesdeUltimaAtualizacao: 9,

        atividades: [
            { nome: 'Agroecologia', percentualArea: 60 },
            { nome: 'Horta Orgânica', percentualArea: 25 },
            { nome: 'Preservação Nativa', percentualArea: 15 }
        ],

        proprietario: 'Ana Paula Costa',
        cpfCnpj: '88888888888888',
        telefone: '(53) 99999-7777',
        email: 'ana@agroecologia.com.br',

        tempoDecorridoDesmatamento: 0,
        foiDesmatado: false,
        areaDesmatada: 0,
        multas: false,
        embargo: false,

        elegivelCredito: true,
        creditosDisponiveis: [
            { tipo: 'PRONAF Agroecologia', valor: 80000, taxa: '2.5%' },
            { tipo: 'ABC Plan', valor: 120000, taxa: '5.0%' }
        ],

        possiveisTrabalhos: [
            'Certificação Orgânica',
            'Venda em Feira Orgânica',
            'Turismo Rural',
            'Processamento Próprio',
            'Programa de Carbono'
        ],

        score: 88,
        status: 'Ativo',
        fonte: 'SICAR/INCRA',
        timestamp: new Date().toISOString()
    }
];

module.exports = leadsDatabase;
