/**
 * Gerador eficiente de leads sob demanda
 * Não armazena 9.600 objetos em memória
 * Gera dinamicamente quando solicitado
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

// Coordenadas centrais de cada município (para geração de coordenadas realistas)
const coordenacionaMunicipios = {
    'SP': {
        'Ribeirão Preto': { lat: -21.1753, lon: -47.8102 },
        'Piracicaba': { lat: -22.7297, lon: -47.6489 },
        'Araçatuba': { lat: -21.2043, lon: -50.4365 },
        'Maringá': { lat: -23.4250, lon: -51.4670 },
        'Londrina': { lat: -23.3045, lon: -51.1696 }
    },
    'MG': {
        'Paracatu': { lat: -17.2288, lon: -46.3028 },
        'Belo Horizonte': { lat: -19.9167, lon: -43.9345 },
        'Montes Claros': { lat: -16.7399, lon: -43.8579 },
        'Divinópolis': { lat: -20.1395, lon: -44.8886 },
        'Uberlândia': { lat: -18.9117, lon: -48.2777 }
    },
    'BA': {
        'Jequié': { lat: -13.8619, lon: -40.0803 },
        'Ilhéus': { lat: -14.7834, lon: -39.0427 },
        'Salvador': { lat: -12.9822, lon: -38.5108 },
        'Feira de Santana': { lat: -12.2626, lon: -38.9585 },
        'Vitória da Conquista': { lat: -14.8450, lon: -40.8394 }
    },
    'GO': {
        'Rio Verde': { lat: -17.7942, lon: -50.9192 },
        'Goiânia': { lat: -16.6869, lon: -49.2645 },
        'Anápolis': { lat: -16.3339, lon: -48.9489 },
        'Jataí': { lat: -17.8848, lon: -51.7195 },
        'Quirinópolis': { lat: -18.4786, lon: -50.4480 }
    },
    'RS': {
        'Pelotas': { lat: -31.7627, lon: -52.3383 },
        'Porto Alegre': { lat: -30.0277, lon: -51.2287 },
        'Santa Maria': { lat: -29.6843, lon: -53.8066 },
        'Passo Fundo': { lat: -28.2604, lon: -52.4080 },
        'Cruz Alta': { lat: -28.6363, lon: -53.6069 }
    },
    'PR': {
        'Maringá': { lat: -23.4250, lon: -51.4670 },
        'Londrina': { lat: -23.3045, lon: -51.1696 },
        'Cascavel': { lat: -24.9539, lon: -53.4673 },
        'Toledo': { lat: -24.7141, lon: -54.7457 },
        'Cornélio Procópio': { lat: -23.1813, lon: -50.5874 }
    },
    'SC': {
        'Chapecó': { lat: -27.0969, lon: -52.6181 },
        'Blumenau': { lat: -26.8791, lon: -49.0694 },
        'Joinville': { lat: -26.3045, lon: -48.8487 },
        'Lages': { lat: -27.8122, lon: -50.3339 },
        'Videira': { lat: -27.0056, lon: -51.1495 }
    },
    'PE': {
        'Petrolina': { lat: -9.3947, lon: -40.5069 },
        'Garanhuns': { lat: -8.8998, lon: -36.4936 },
        'Caruaru': { lat: -8.2829, lon: -35.9767 },
        'Recife': { lat: -8.0476, lon: -34.8770 },
        'Olinda': { lat: -8.0081, lon: -34.8566 }
    },
    'CE': {
        'Fortaleza': { lat: -3.7319, lon: -38.5267 },
        'Juazeiro do Norte': { lat: -7.2114, lon: -39.3167 },
        'Iguatu': { lat: -6.3611, lon: -38.9819 },
        'Quixadá': { lat: -5.1944, lon: -39.2839 },
        'Crateús': { lat: -5.1658, lon: -40.6578 }
    },
    'PA': {
        'Belém': { lat: -1.4558, lon: -48.5044 },
        'Santarém': { lat: -2.4262, lon: -54.7099 },
        'Marabá': { lat: -5.3697, lon: -49.3017 },
        'Itaituba': { lat: -4.2767, lon: -55.9839 },
        'Breves': { lat: -1.6858, lon: -50.4828 }
    },
    'MT': {
        'Cuiabá': { lat: -15.5891, lon: -56.0955 },
        'Sinop': { lat: -11.8554, lon: -55.4915 },
        'Rondonópolis': { lat: -16.4674, lon: -54.6367 },
        'Lucas do Rio Verde': { lat: -12.7631, lon: -55.9166 },
        'Tangará da Serra': { lat: -14.6418, lon: -57.4192 }
    },
    'MS': {
        'Campo Grande': { lat: -20.4428, lon: -54.6469 },
        'Dourados': { lat: -22.2237, lon: -54.8040 },
        'Três Lagoas': { lat: -20.7530, lon: -51.6789 },
        'Corumbá': { lat: -19.0160, lon: -57.6509 },
        'Naviraí': { lat: -22.0833, lon: -55.3833 }
    }
};

const atividades = [
    'Cultivo de Soja', 'Cultivo de Milho', 'Cultivo de Trigo', 'Fruticultura',
    'Café', 'Pecuária de Corte', 'Pecuária Laiteira', 'Suinocultura'
];

const nomes = ['Fazenda', 'Sítio', 'Propriedade', 'Chácara'];
const sobrenomes = ['Santa Maria', 'Esperança', 'Verde Vida', 'Boa Vista', 'São João'];

const nomesPropietarios = [
    'Carlos Silva', 'Maria Santos', 'João Oliveira', 'Ana Costa', 'Roberto Lima',
    'Fernanda Gomes', 'Leonardo Dias', 'Patricia Mendes', 'Bruno Ferreira', 'Claudia Rocha',
    'Marco Campos', 'Teresa Rodrigues', 'Felipe Alves', 'Lucia Martins', 'Diego Souza'
];

const possiveisServicos = [
    'Consultoria Ambiental',
    'Certificação Ambiental',
    'Energia Solar Rural',
    'Energia Eólica',
    'Créditos de Carbono',
    'Agroecologia',
    'Agricultura Sustentável',
    'Reflorestamento'
];

function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function gerarLead(indice) {
    const estado = estados[Math.floor(indice / 800) % estados.length];
    const modulo = modulos[Math.floor((indice % 800) / 200)];
    const rand = (offset) => seededRandom(indice + offset);

    const municipio = municipios[estado][Math.floor(rand(1) * municipios[estado].length)];
    const atividade = atividades[Math.floor(rand(2) * atividades.length)];

    const areaTotal = Math.floor(rand(5) * 1000) + 50;
    const areaReservaLegal = Math.floor(areaTotal * 0.2);

    return {
        id: `IMOV-${estado}-${String(indice).padStart(6, '0')}`,
        numeroCAR: `${estado}-${String(Math.floor(rand(6) * 9999999)).padStart(7, '0')}A-INCRA-2024`,
        nome: `${nomes[Math.floor(rand(3) * nomes.length)]} ${sobrenomes[Math.floor(rand(4) * sobrenomes.length)]}`,
        estado: estado,
        municipio: municipio,
        modulo: modulo,

        areaTotal: areaTotal,
        areaReservaLegal: areaReservaLegal,
        percentualRL: 20,
        rlAtigindo20Porcento: true,

        coordenadas: (() => {
            const coords = coordenacionaMunicipios[estado]?.[municipio];
            if (coords) {
                return {
                    latitude: coords.lat + (rand(9) - 0.5) * 0.1,
                    longitude: coords.lon + (rand(10) - 0.5) * 0.1
                };
            }
            return {
                latitude: -23.5505 + (rand(9) - 0.5) * 20,
                longitude: -46.6333 + (rand(10) - 0.5) * 20
            };
        })(),
        georreferenciamento: true,

        statusCAR: 'ATIVO',
        carAtualizado: true,
        proprietario: nomesPropietarios[Math.floor(rand(11) * nomesPropietarios.length)],
        cpfCnpj: String(Math.floor(rand(14) * 99999999999999)).padStart(14, '0'),
        email: `proprietario.${indice}@agro.com.br`,

        atividades: [{ nome: atividade, percentualArea: 70 }],
        possiveisTrabalhos: possiveisServicos.filter(() => rand(15) > 0.4),
        elegivelCredito: true,
        creditosDisponiveis: [{ tipo: 'PRONAF', valor: 150000, taxa: '3.5%' }],

        score: Math.floor(rand(21) * 40) + 50,
        status: 'Ativo',
        fonte: 'SICAR/INCRA'
    };
}

function gerarLeadsEmMassa(filtroEstado = null, limit = 50) {
    const leads = [];
    let contador = 0;

    for (let i = 0; i < 9600 && contador < limit; i++) {
        const lead = gerarLead(i);
        if (filtroEstado && lead.estado !== filtroEstado) continue;
        leads.push(lead);
        contador++;
    }

    return leads;
}

module.exports = {
    gerarLeadsEmMassa,
    TOTAL_LEADS: 9600
};
