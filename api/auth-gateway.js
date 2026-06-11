/**
 * Authentication Gateway - Sistema de Planos Pagos
 *
 * Funcionalidades:
 * - Cadastro de usuários
 * - Login/Logout
 * - Geração de tokens JWT (futuro)
 * - Controle de acesso por plano
 * - Rate limiting por plano
 */

const NodeCache = require('node-cache');

// Cache para sessões e tokens
const authCache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 }); // 24 horas

// ============ DEFINIÇÃO DE PLANOS ============

const PLANOS = {
  GRATUITO: {
    id: 'gratuito',
    nome: 'Gratuito',
    preco: 0,
    moeda: 'BRL',
    leads_por_mes: 100,
    funcionalidades: [
      'Busca básica',
      'Filtro por estado',
      'Visualizar detalhes',
      'Exportar CSV (10 leads/mês)',
      'WhatsApp (10 contatos/mês)'
    ],
    limite_requisicoes_por_hora: 100,
    descricao: 'Para explorar a plataforma'
  },

  PROFISSIONAL: {
    id: 'profissional',
    nome: 'Profissional',
    preco: 99.90,
    moeda: 'BRL',
    leads_por_mes: 5000,
    funcionalidades: [
      'Busca avançada',
      'Todos os filtros',
      'CAR enrichment',
      'Exportar CSV (sem limite)',
      'WhatsApp (sem limite)',
      'API access',
      'Relatórios básicos',
      'Suporte por email'
    ],
    limite_requisicoes_por_hora: 1000,
    descricao: 'Para profissionais e pequenas empresas'
  },

  ENTERPRISE: {
    id: 'enterprise',
    nome: 'Enterprise',
    preco: 499.90,
    moeda: 'BRL',
    leads_por_mes: 50000,
    funcionalidades: [
      'Tudo do plano Profissional',
      'Acesso completo a APIs',
      'Dados reais do CAR',
      'Geolocalização avançada',
      'Análises detalhadas',
      'Dashboard personalizado',
      'Relatórios automáticos',
      'Suporte prioritário 24/7',
      'SLA garantido',
      'Integração customizada'
    ],
    limite_requisicoes_por_hora: 10000,
    descricao: 'Para grandes empresas e instituições'
  }
};

// ============ SIMULAÇÃO DE BANCO DE DADOS DE USUÁRIOS ============
// Em produção, usar banco de dados real (PostgreSQL, MongoDB, etc)

const usuariosDB = new Map();
let proximoUserID = 1000;

// Usuário de teste
usuariosDB.set('teste@georadar.com', {
  id: 1,
  email: 'teste@georadar.com',
  nome: 'Usuário Teste',
  senha: 'senha123', // Em produção, usar bcrypt
  plano: 'gratuito',
  data_cadastro: new Date(),
  data_expiracao: null,
  ativo: true,
  uso_mes: {
    leads_consultados: 45,
    exportacoes_csv: 5,
    mensagens_whatsapp: 8,
    requisicoes_api: 450
  }
});

// ============ FUNÇÕES DE AUTENTICAÇÃO ============

/**
 * Cadastrar novo usuário
 */
function cadastrarUsuario(email, senha, nome, plano = 'gratuito') {
  // Validações
  if (!email || !email.includes('@')) {
    return {
      sucesso: false,
      erro: 'Email inválido',
      codigo: 'EMAIL_INVALIDO'
    };
  }

  if (!senha || senha.length < 6) {
    return {
      sucesso: false,
      erro: 'Senha deve ter no mínimo 6 caracteres',
      codigo: 'SENHA_FRACA'
    };
  }

  if (usuariosDB.has(email)) {
    return {
      sucesso: false,
      erro: 'Email já cadastrado',
      codigo: 'EMAIL_EXISTENTE'
    };
  }

  if (!PLANOS[plano.toUpperCase()]) {
    return {
      sucesso: false,
      erro: 'Plano inválido',
      codigo: 'PLANO_INVALIDO'
    };
  }

  // Criar novo usuário
  const novoUsuario = {
    id: proximoUserID++,
    email: email,
    nome: nome || email.split('@')[0],
    senha: senha, // Em produção: hash com bcrypt
    plano: plano.toLowerCase(),
    data_cadastro: new Date(),
    data_expiracao: null,
    ativo: true,
    tokens: [],
    uso_mes: {
      leads_consultados: 0,
      exportacoes_csv: 0,
      mensagens_whatsapp: 0,
      requisicoes_api: 0
    }
  };

  usuariosDB.set(email, novoUsuario);

  console.log(`✅ Usuário cadastrado: ${email} (Plano: ${plano})`);

  return {
    sucesso: true,
    usuario: {
      id: novoUsuario.id,
      email: novoUsuario.email,
      nome: novoUsuario.nome,
      plano: novoUsuario.plano,
      data_cadastro: novoUsuario.data_cadastro
    },
    mensagem: 'Cadastro realizado com sucesso'
  };
}

/**
 * Login de usuário
 */
function login(email, senha) {
  const usuario = usuariosDB.get(email);

  if (!usuario) {
    return {
      sucesso: false,
      erro: 'Email ou senha incorretos',
      codigo: 'CREDENCIAIS_INVALIDAS'
    };
  }

  if (!usuario.ativo) {
    return {
      sucesso: false,
      erro: 'Conta desativada',
      codigo: 'CONTA_DESATIVADA'
    };
  }

  // Em produção, usar bcrypt.compare()
  if (usuario.senha !== senha) {
    return {
      sucesso: false,
      erro: 'Email ou senha incorretos',
      codigo: 'CREDENCIAIS_INVALIDAS'
    };
  }

  // Gerar token (simples, em produção usar JWT com RS256)
  const token = `token_${usuario.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  if (!usuario.tokens) usuario.tokens = [];
  usuario.tokens.push({
    token: token,
    data_criacao: new Date(),
    data_expiracao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
  });

  // Guardar em cache
  authCache.set(`token_${token}`, {
    usuario_id: usuario.id,
    email: usuario.email,
    plano: usuario.plano
  });

  console.log(`✅ Login realizado: ${email}`);

  return {
    sucesso: true,
    token: token,
    usuario: {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      plano: usuario.plano
    },
    plano_info: PLANOS[usuario.plano.toUpperCase()],
    validade: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };
}

/**
 * Validar token
 */
function validarToken(token) {
  if (!token) {
    return { valido: false, erro: 'Token não fornecido' };
  }

  const tokenData = authCache.get(`token_${token}`);

  if (!tokenData) {
    return { valido: false, erro: 'Token inválido ou expirado' };
  }

  return {
    valido: true,
    usuario_id: tokenData.usuario_id,
    email: tokenData.email,
    plano: tokenData.plano
  };
}

/**
 * Obter informações do usuário
 */
function obterUsuario(email) {
  const usuario = usuariosDB.get(email);

  if (!usuario) {
    return {
      sucesso: false,
      erro: 'Usuário não encontrado'
    };
  }

  const planoInfo = PLANOS[usuario.plano.toUpperCase()];

  return {
    sucesso: true,
    usuario: {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      plano: usuario.plano,
      ativo: usuario.ativo,
      data_cadastro: usuario.data_cadastro
    },
    plano_info: planoInfo,
    uso_mes: usuario.uso_mes,
    limites_disponiveis: {
      leads_consultados: planoInfo.leads_por_mes - usuario.uso_mes.leads_consultados,
      exportacoes_csv: usuario.plano === 'gratuito' ? 10 - usuario.uso_mes.exportacoes_csv : 'ilimitado',
      mensagens_whatsapp: usuario.plano === 'gratuito' ? 10 - usuario.uso_mes.mensagens_whatsapp : 'ilimitado',
      requisicoes_api: planoInfo.limite_requisicoes_por_hora
    }
  };
}

/**
 * Verificar limite de requisições
 */
function verificarLimiteRequisicoes(email) {
  const usuario = usuariosDB.get(email);

  if (!usuario) {
    return {
      permitido: false,
      erro: 'Usuário não encontrado'
    };
  }

  const planoInfo = PLANOS[usuario.plano.toUpperCase()];
  const reqPorHora = usuario.uso_mes.requisicoes_api;
  const limite = planoInfo.limite_requisicoes_por_hora;

  if (reqPorHora >= limite) {
    return {
      permitido: false,
      erro: `Limite de ${limite} requisições/hora atingido`,
      uso_atual: reqPorHora,
      limite: limite
    };
  }

  usuario.uso_mes.requisicoes_api++;

  return {
    permitido: true,
    uso_atual: reqPorHora + 1,
    limite: limite
  };
}

/**
 * Verificar limite de leads consultados
 */
function verificarLimiteLead(email) {
  const usuario = usuariosDB.get(email);

  if (!usuario) {
    return { permitido: false };
  }

  const planoInfo = PLANOS[usuario.plano.toUpperCase()];
  const leadsConsultados = usuario.uso_mes.leads_consultados;
  const limite = planoInfo.leads_por_mes;

  if (leadsConsultados >= limite) {
    return {
      permitido: false,
      erro: `Limite mensal de ${limite} leads atingido`,
      uso_atual: leadsConsultados,
      limite: limite
    };
  }

  usuario.uso_mes.leads_consultados++;

  return {
    permitido: true,
    uso_atual: leadsConsultados + 1,
    limite: limite
  };
}

/**
 * Registrar uso de exportação CSV
 */
function registrarExportacaoCSV(email) {
  const usuario = usuariosDB.get(email);

  if (!usuario) return false;

  if (usuario.plano === 'gratuito' && usuario.uso_mes.exportacoes_csv >= 10) {
    return false;
  }

  usuario.uso_mes.exportacoes_csv++;
  return true;
}

/**
 * Registrar envio WhatsApp
 */
function registrarWhatsApp(email) {
  const usuario = usuariosDB.get(email);

  if (!usuario) return false;

  if (usuario.plano === 'gratuito' && usuario.uso_mes.mensagens_whatsapp >= 10) {
    return false;
  }

  usuario.uso_mes.mensagens_whatsapp++;
  return true;
}

/**
 * Obter informações de plano
 */
function obterPlano(plano_id) {
  const plano = PLANOS[plano_id.toUpperCase()];

  if (!plano) {
    return null;
  }

  return plano;
}

/**
 * Listar todos os planos
 */
function listarPlanos() {
  return Object.values(PLANOS).map(plano => ({
    id: plano.id,
    nome: plano.nome,
    preco: plano.preco,
    moeda: plano.moeda,
    descricao: plano.descricao,
    funcionalidades: plano.funcionalidades.length,
    leads_por_mes: plano.leads_por_mes
  }));
}

module.exports = {
  PLANOS,
  cadastrarUsuario,
  login,
  validarToken,
  obterUsuario,
  verificarLimiteRequisicoes,
  verificarLimiteLead,
  registrarExportacaoCSV,
  registrarWhatsApp,
  obterPlano,
  listarPlanos,
  authCache,
  usuariosDB
};
