const https = require('https');

const BASE_URL = 'inkflowbackend-4w1g.onrender.com';
let TOKEN = '';
let CLIENT_ID = null;
let AGENDAMENTO_ID = null;
let CICATRIZACAO_ID = null;

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test1_Login() {
  log('\n📝 TESTE 1: Login', 'cyan');
  log('POST /api/auth/login', 'blue');
  
  const response = await makeRequest('POST', '/auth/login', {
    email: 'SEU_EMAIL_AQUI',  // Substitua por credenciais reais para testar
    password: 'SUA_SENHA_AQUI',
  });

  if (response.status === 200 && response.data.success) {
    TOKEN = response.data.token;
    CLIENT_ID = response.data.user.id;
    log(`✅ Login bem-sucedido! ClienteID: ${CLIENT_ID}`, 'green');
    log(`Token: ${TOKEN.substring(0, 30)}...`, 'yellow');
  } else {
    log(`❌ Falha no login: ${JSON.stringify(response.data)}`, 'red');
    process.exit(1);
  }
}

async function test2_BuscarAgendamento() {
  log('\n📝 TESTE 2: Buscar Agendamentos do Artista', 'cyan');
  log(`GET /api/agendamentos/artista/${CLIENT_ID}`, 'blue');

  const response = await makeRequest('GET', `/agendamentos/artista/${CLIENT_ID}`, null, TOKEN);

  if (response.status === 200 && response.data.length > 0) {
    // Procura um agendamento que NÃO seja REALIZADO para testar o gatilho
    const naoRealizado = response.data.find(a => a.status !== 'REALIZADO' && a.status !== 'FINALIZADO' && a.status !== 'CANCELADO');
    
    if (naoRealizado) {
      AGENDAMENTO_ID = naoRealizado.id;
      global.CLIENTE_DO_AGENDAMENTO_ID = naoRealizado.cliente?.id || naoRealizado.cliente?.clienteId;
      log(`✅ Encontrado ${response.data.length} agendamento(s)`, 'green');
      log(`Usando AgendamentoID: ${AGENDAMENTO_ID} (Status: ${naoRealizado.status})`, 'yellow');
      log(`Cliente do agendamento: ${global.CLIENTE_DO_AGENDAMENTO_ID}`, 'yellow');
      log(`Vamos mudar para REALIZADO para testar o gatilho...`, 'cyan');
    } else {
      log(`⚠️  Todos os agendamentos já estão REALIZADO/FINALIZADO/CANCELADO`, 'yellow');
      log(`Crie um novo agendamento com status PENDENTE ou CONFIRMADO`, 'yellow');
      process.exit(0);
    }
  } else {
    log(`⚠️  Nenhum agendamento encontrado. Crie um agendamento primeiro.`, 'yellow');
    log(`Você pode criar via web ou usar o endpoint POST /api/agendamentos`, 'yellow');
    process.exit(0);
  }
}

async function test3_MudarStatusParaRealizado() {
  log('\n📝 TESTE 3: Mudar Status para REALIZADO (Testar Gatilho)', 'cyan');
  log(`PATCH /api/agendamentos/${AGENDAMENTO_ID}/status`, 'blue');

  const response = await makeRequest('PATCH', `/agendamentos/${AGENDAMENTO_ID}/status`, 
    { status: 'REALIZADO' }, TOKEN);

  if (response.status === 200) {
    log(`✅ Status alterado para REALIZADO!`, 'green');
    log(`🚀 Gatilho deve ter disparado - cicatrização sendo criada...`, 'yellow');
    // Aguarda 2 segundos para o backend processar
    await new Promise(resolve => setTimeout(resolve, 2000));
  } else {
    log(`❌ Erro ao mudar status: ${JSON.stringify(response.data)}`, 'red');
  }
}

async function test4_IniciarCicatrizacao() {
  log('\n📝 TESTE 4: Iniciar Cicatrização Manualmente (Admin - Fallback)', 'cyan');
  log(`POST /api/cicatrizacao/iniciar/${AGENDAMENTO_ID}`, 'blue');

  const response = await makeRequest('POST', `/cicatrizacao/iniciar/${AGENDAMENTO_ID}`, null, TOKEN);

  if (response.status === 200) {
    CICATRIZACAO_ID = response.data.id;
    log(`✅ Cicatrização iniciada! ID: ${CICATRIZACAO_ID}`, 'green');
    log(`Período: ${response.data.periodoTotalDias} dias`, 'yellow');
    log(`Fase atual: ${response.data.faseAtual}`, 'yellow');
  } else if (response.status === 409) {
    log(`⚠️  Cicatrização já existe para este agendamento`, 'yellow');
    // Tenta buscar a cicatrização existente
    await test4_BuscarCicatrizacaoAtiva();
  } else if (response.status === 403) {
    log(`⚠️  Você não tem permissão de admin. Vamos buscar cicatrização existente...`, 'yellow');
    await test5_BuscarCicatrizacaoAtiva();
  } else {
    log(`❌ Erro: ${JSON.stringify(response.data)}`, 'red');
  }
}

async function test5_BuscarCicatrizacaoAtiva() {
  const clienteId = global.CLIENTE_DO_AGENDAMENTO_ID || CLIENT_ID;
  log('\n📝 TESTE 5: Buscar Cicatrização Ativa', 'cyan');
  log(`GET /api/cicatrizacao/ativa/${clienteId}`, 'blue');

  const response = await makeRequest('GET', `/cicatrizacao/ativa/${clienteId}`, null, TOKEN);

  if (response.status === 200) {
    CICATRIZACAO_ID = response.data.id;
    log(`✅ Cicatrização ativa encontrada! ID: ${CICATRIZACAO_ID}`, 'green');
    log(`Dia atual: ${response.data.diaAtual}/${response.data.periodoTotalDias}`, 'yellow');
    log(`XP Total: ${response.data.xpTotal}`, 'yellow');
    log(`Fase: ${response.data.faseAtual}`, 'yellow');
  } else if (response.status === 204) {
    log(`⚠️  Nenhuma cicatrização ativa encontrada`, 'yellow');
    log(`Marque um agendamento como REALIZADO no web para criar uma cicatrização`, 'yellow');
    process.exit(0);
  } else {
    log(`❌ Erro: ${JSON.stringify(response.data)}`, 'red');
  }
}

async function test6_BuscarCaminho() {
  log('\n📝 TESTE 6: Buscar Caminho Completo', 'cyan');
  log(`GET /api/cicatrizacao/${CICATRIZACAO_ID}/caminho`, 'blue');

  const response = await makeRequest('GET', `/cicatrizacao/${CICATRIZACAO_ID}/caminho`, null, TOKEN);

  if (response.status === 200) {
    log(`✅ Caminho carregado! Total de dias: ${response.data.length}`, 'green');
    
    const completos = response.data.filter(d => d.statusDia === 'COMPLETO').length;
    const disponiveis = response.data.filter(d => d.statusDia === 'DISPONIVEL').length;
    const bloqueados = response.data.filter(d => d.statusDia === 'BLOQUEADO').length;
    
    log(`Completos: ${completos} | Disponíveis: ${disponiveis} | Bloqueados: ${bloqueados}`, 'yellow');
    
    // Mostra os primeiros 3 dias
    log('\nPrimeiros 3 dias:', 'cyan');
    response.data.slice(0, 3).forEach(dia => {
      log(`  Dia ${dia.numeroDia}: ${dia.statusDia} | Estrelas: ${dia.estrelas} | XP: ${dia.xpGanho}`, 'yellow');
    });
  } else {
    log(`❌ Erro: ${JSON.stringify(response.data)}`, 'red');
  }
}

async function test7_BuscarChecklistDia() {
  log('\n📝 TESTE 7: Buscar Checklist do Dia 1', 'cyan');
  log(`GET /api/cicatrizacao/${CICATRIZACAO_ID}/checklist/dia/1`, 'blue');

  const response = await makeRequest('GET', `/cicatrizacao/${CICATRIZACAO_ID}/checklist/dia/1`, null, TOKEN);

  if (response.status === 200) {
    log(`✅ Checklist carregado! Total de itens: ${response.data.length}`, 'green');
    
    const manha = response.data.filter(i => i.periodo === 'MANHA');
    const tarde = response.data.filter(i => i.periodo === 'TARDE');
    const noite = response.data.filter(i => i.periodo === 'NOITE');
    
    log(`Manhã: ${manha.length} itens | Tarde: ${tarde.length} itens | Noite: ${noite.length} itens`, 'yellow');
    
    // Mostra os primeiros 2 itens da manhã
    log('\nPrimeiros 2 itens da manhã:', 'cyan');
    manha.slice(0, 2).forEach(item => {
      log(`  ${item.concluido ? '✅' : '⬜'} ${item.descricao}`, 'yellow');
    });
    
    // Salva o ID do primeiro item para o próximo teste
    global.ITEM_ID = response.data[0].id;
  } else {
    log(`❌ Erro: ${JSON.stringify(response.data)}`, 'red');
  }
}

async function test8_ToggleItem() {
  log('\n📝 TESTE 8: Marcar/Desmarcar Item do Checklist', 'cyan');
  log(`PATCH /api/cicatrizacao/${CICATRIZACAO_ID}/checklist/${global.ITEM_ID}/toggle`, 'blue');

  const response = await makeRequest('PATCH', `/cicatrizacao/${CICATRIZACAO_ID}/checklist/${global.ITEM_ID}/toggle`, null, TOKEN);

  if (response.status === 200) {
    log(`✅ Item marcado/desmarcado com sucesso!`, 'green');
    log(`Estrelas do dia: ${response.data.estrelas}`, 'yellow');
    log(`XP ganho: ${response.data.xpGanho}`, 'yellow');
    log(`Status do dia: ${response.data.statusDia}`, 'yellow');
  } else {
    log(`❌ Erro: ${JSON.stringify(response.data)}`, 'red');
  }
}

async function runAllTests() {
  log('🚀 INICIANDO TESTES DO BACKEND - SISTEMA DE CICATRIZAÇÃO', 'cyan');
  log(`Base URL: https://${BASE_URL}/api`, 'blue');
  
  try {
    await test1_Login();
    await test2_BuscarAgendamento();
    await test3_MudarStatusParaRealizado();
    await test4_IniciarCicatrizacao();
    
    if (!CICATRIZACAO_ID) {
      await test5_BuscarCicatrizacaoAtiva();
    }
    
    if (CICATRIZACAO_ID) {
      await test6_BuscarCaminho();
      await test7_BuscarChecklistDia();
      await test8_ToggleItem();
    }
    
    log('\n✅ TODOS OS TESTES CONCLUÍDOS!', 'green');
  } catch (error) {
    log(`\n❌ ERRO DURANTE OS TESTES: ${error.message}`, 'red');
    console.error(error);
  }
}

runAllTests();
