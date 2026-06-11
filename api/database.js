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
        nome: `${nomes[Math.floor(rand(3) * nomes.length)]} ${indice}`,
        estado: estado,
        municipio: municipio,
        modulo: modulo,

        areaTotal: areaTotal,
        areaReservaLegal: areaReservaLegal,
        percentualRL: 20,
        rlAtigindo20Porcento: true,

        coordenadas: {
            latitude: -23.5505 + (rand(9) - 0.5) * 20,
            longitude: -46.6333 + (rand(10) - 0.5) * 20
        },
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
