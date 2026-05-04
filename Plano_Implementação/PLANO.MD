📋 PLANO COMPLETO — INKFLOWCARE MOBILE
🎯 Visão Geral do Projeto
InkFlowCare é um app mobile (React Native + Expo) que funciona como extensão do sistema web InkFlow (estúdio de tatuagem). O objetivo é ser um guia gamificado de cuidados pós-tatuagem, inspirado na mecânica do Duolingo.

Fluxo do Usuário
Cliente agenda tatuagem no web (React + Vite)

Artista realiza a sessão e marca como REALIZADO no web

Backend Spring Boot cria automaticamente a cicatrização

Cliente acessa o mobile e acompanha o guia de cuidados dia a dia

Sistema de streak, XP, badges e caminho visual estilo Duolingo

🏗️ Arquitetura do Sistema
Stack Tecnológica
Frontend Web (já existente)

React 18 + Vite

Deploy: Vercel

Auth: JWT armazenado em localStorage

Backend (já existente + novas funcionalidades)

Spring Boot 3.x + Java 17

Banco: SQL Server (somee.com)

Auth: JWT (HS256, 24h expiração) com blacklist

Storage: Cloudinary

Deploy: Render

URL: https://inkflowbackend-4w1g.onrender.com/api

Mobile (80% UI pronta, 0% integrado)

React Native + Expo 54

TypeScript

Expo Router (file-based routing)

React Navigation (tabs)

Tema: Escuro (#000000 → #0a0a2e → #0d1b4b), cor primária #FF0000

📊 Modelagem de Dados — Backend
Entidades Existentes
Cliente

id, username, email, password, fullName, telefone, 
profileImage, contaVerificada, createdAt

Copy
Agendamento

id, cliente (FK), artista (FK), dataHora, servico, descricao, 
status (PENDENTE → CONFIRMADO → REALIZADO → FINALIZADO), 
preco, regiao, largura, altura, tags, imagemReferenciaUrl, 
imagemResultadoUrl, createdAt, updatedAt

Copy
Artista

id, nome, especialidades, bio, fotoUrl, email

Copy
Entidades Novas (Criadas)
Cicatrizacao

id, agendamento (FK OneToOne), dataInicio, dataFim, 
periodoTotalDias, status (ATIVA/CONCLUIDA/ABANDONADA), 
xpTotal, diaAtual, faseAtual

Copy
java
CheckpointDia

id, cicatrizacao (FK), numeroDia, fase, statusDia 
(BLOQUEADO/DISPONIVEL/COMPLETO/PARCIAL/PERDIDO), 
xpGanho, estrelas (0-3), temQuiz, data

Copy
java
ChecklistItem

id, checkpointDia (FK), periodo (MANHA/TARDE/NOITE), 
ordem, descricao, concluido, dataMarcacao

Copy
java
Relacionamentos
Cliente 1 ──→ N Agendamento
Agendamento 1 ──→ 1 Cicatrizacao
Cicatrizacao 1 ──→ N CheckpointDia
CheckpointDia 1 ──→ N ChecklistItem

Copy
🎮 Sistema de Caminho Duolingo
Estrutura das Fases
O caminho é dividido em 4 fases (como "unidades" do Duolingo), com 1 parada por dia:

Fase	Dias	Cor	Descrição
Fase 1	Dia 1	🔴 Vermelho	Primeiras 24h — curativo, cuidados iniciais
Fase 2	Dias 2-7	🟠 Laranja	Cicatrização inicial — limpeza e pomada
Fase 3	Dias 8-14	🟡 Amarelo	Descamação — hidratação intensiva
Fase 4	Dias 15-30+	🟢 Verde	Cicatrização profunda — manutenção
Total de paradas: 21 a 45 dias (variável por tamanho/região)

Desbloqueio de Paradas
Desbloqueio temporal (não condicional)

Cada dia desbloqueia automaticamente à meia-noite

Usuário pode voltar e completar dias anteriores perdidos

Dias não completados ficam marcados como ⚠️ PARCIAL ou ❌ PERDIDO

Checkpoints de Fase
Dias especiais com mini-quiz de 3 perguntas:

Dia 1 (fim da Fase 1)

Dia 7 (fim da Fase 2)

Dia 14 (fim da Fase 3)

Último dia (fim da Fase 4)

Quiz:

3 perguntas de múltipla escolha

Baseadas nos cuidados da fase anterior

Respostas certas = +15 XP por pergunta

Sem punição por erro (mostra resposta certa + explicação)

🏆 Sistema de Gamificação
Sistema de XP
Ação	XP Ganho
Completar 1 item do checklist	+5 XP
Completar período completo (manhã/tarde/noite)	+30 XP (20 dos itens + 10 bônus)
Completar 100% do dia	+100 XP (60 dos períodos + 40 bônus)
Acertar pergunta do quiz	+15 XP
Streak de 7 dias	+100 XP bônus
Streak de 14 dias	+200 XP bônus
Completar cicatrização	+500 XP
Sistema de Estrelas
Cada dia pode ganhar de 0 a 3 estrelas:

⭐⭐⭐ (3 estrelas) = 100% do checklist concluído

⭐⭐ (2 estrelas) = 50-99% concluído

⭐ (1 estrela) = 1-49% concluído

(0 estrelas) = 0% concluído

Sistema de Streak
Streak = dias consecutivos com ≥80% do checklist concluído

Se completar <80% → streak quebra no dia seguinte

Streak Freeze: 1 freeze gratuito a cada 7 dias de streak

Máximo de 2 freezes acumulados

Consumido automaticamente se pular 1 dia

Perder streak não tem punição, apenas reinicia o contador

Badges Definidas
Badge	Condição	Ícone
Primeiro Passo	Completar Dia 1	🦶
Semana Completa	Streak de 7 dias	🔥
Duas Semanas	Streak de 14 dias	⚡
Mestre dos Cuidados	Completar cicatrização inteira	🏆
Perfeição	100% de todos os dias	💎
Sabedoria	Acertar todos os quizzes	🧠
Inabalável	Streak de 21+ dias	🛡️
Colecionador	Completar 3+ cicatrizações	📚
🧮 Cálculo do Período de Cicatrização
O período varia de 21 a 45 dias baseado em:

Fator Base (por região)
Região	Dias Base
Braço	25
Perna	28
Costas	30
Peito	28
Pescoço	21
Mão	35
Pé	35
Outro	30
Multiplicador (por tamanho)
Área (cm²)	Multiplicador
≤ 50 (pequena)	0.85x
51-200 (média)	1.0x
201-500 (grande)	1.15x
> 500 (extra grande)	1.3x
Fórmula
periodoTotal = Math.round(fatorBase * multiplicador)
// Mínimo: 21 dias | Máximo: 45 dias

Copy
java
Distribuição das Fases
Para um período de N dias:

Fase 1: Dia 1 (sempre fixo)

Fase 2: Dias 2-7 (sempre fixo)

Fase 3: Dias 8-14 (sempre fixo)

Fase 4: Dias 15-N (variável — absorve o restante)

Fases 1-3 são fixas (14 dias) porque o processo biológico é igual. Apenas a Fase 4 se estende.

📝 Conteúdo do Checklist por Fase
Fase 1 — Primeiras 24h
Manhã:

Manter o curativo original por pelo menos 2-4 horas

Não molhar a tatuagem

Evitar exposição ao sol

Tarde:

Verificar se o curativo está íntegro

Evitar roupas apertadas sobre a tatuagem

Não coçar ou tocar desnecessariamente

Noite:

Remover o curativo com cuidado após 4-6 horas

Lavar suavemente com água morna e sabão neutro

Aplicar camada fina de pomada cicatrizante e deixar sem curativo

Fase 2 — Cicatrização Inicial (Dias 2-7)
Manhã:

Lavar suavemente com água morna e sabão neutro

Secar com papel toalha limpo (sem esfregar)

Aplicar camada fina de pomada cicatrizante

Tarde:

Reaplicar pomada cicatrizante se necessário

Evitar exposição ao sol diretamente

Não mergulhar em piscina ou mar

Noite:

Lavar suavemente antes de dormir

Aplicar pomada cicatrizante

Dormir com lençol limpo — evitar tecidos sintéticos

Fase 3 — Descamação (Dias 8-14)
Manhã:

Lavar suavemente com água morna e sabão neutro

Secar com papel toalha limpo

Aplicar hidratante sem perfume

Tarde:

Não arrancar as cascas — deixar cair naturalmente

Reaplicar hidratante se sentir ressecamento

Evitar exposição ao sol sem protetor

Noite:

Lavar suavemente antes de dormir

Aplicar hidratante generosamente

Dormir com lençol limpo

Fase 4 — Cicatrização Profunda (Dias 15-30+)
Manhã:

Lavar suavemente com água morna

Aplicar hidratante sem perfume

Verificar sinais de infecção

Tarde:

Reaplicar hidratante se necessário

Evitar exposição prolongada ao sol

Usar protetor solar FPS 50+ se exposto ao sol

Noite:

Lavar suavemente antes de dormir

Aplicar hidratante

Verificar aparência geral da tatuagem

🔌 Endpoints REST — Backend
Autenticação (já existente)
POST /api/auth/login
Body: { email, password }
Retorna: { success, token, user: { id, email, nome, role } }
Roles: ROLE_CLIENTE, ROLE_ARTISTA, ROLE_ADMIN

Copy
Agendamentos (já existente)
GET /api/agendamentos/cliente/{clienteId}
→ Retorna todos os agendamentos do cliente

PATCH /api/agendamentos/{id}/status
Body: { status: "REALIZADO" }
→ Atualiza status e GATILHO: inicia cicatrização automaticamente

Copy
Cicatrização (NOVO)
GET /api/cicatrizacao/ativa/{clienteId}
→ Retorna a cicatrização ativa do cliente (se existir)
→ Inclui: diaAtual, faseAtual, progresso, xpTotal

GET /api/cicatrizacao/{id}/caminho
→ Retorna TODOS os checkpoints do caminho
→ Para renderizar a tela do "caminho Duolingo"
→ Inclui: status de cada dia, estrelas, quizzes disponíveis

GET /api/cicatrizacao/{id}/checklist/dia/{numeroDia}
→ Retorna todos os itens do checklist para um dia específico
→ Agrupados por período (manhã/tarde/noite)

PATCH /api/cicatrizacao/{id}/checklist/{itemId}/toggle
→ Marca/desmarca um item do checklist
→ Recalcula estrelas e XP do dia
→ Retorna: CheckpointDiaDTO atualizado

POST /api/cicatrizacao/iniciar/{agendamentoId}
→ Endpoint manual para iniciar cicatrização (admin/teste)
→ Requer ROLE_ADMIN


Copy
🔄 Fluxo Completo do Sistema
1. Agendamento (Web)
Cliente faz login no web

Agenda sessão com artista (data, região, tamanho, estilo)

Backend cria Agendamento com status PENDENTE

2. Realização da Sessão (Web)
Artista marca agendamento como REALIZADO

GATILHO: Backend chama cicatrizacaoService.iniciar(agendamentoId)

Backend cria:

1 registro Cicatrizacao

N registros CheckpointDia (21-45 dias)

N×12 registros ChecklistItem (4 manhã + 4 tarde + 4 noite por dia)

3. Acesso ao Mobile
Cliente faz login no mobile com mesmo email/senha

Mobile chama GET /api/cicatrizacao/ativa/{clienteId}

Se existe cicatrização ativa → mostra tela do caminho

Se não existe → mostra dashboard vazio

4. Uso Diário (Mobile)
Usuário abre o app

Vê o caminho com o dia atual pulsando

Toca no dia → abre checklist (manhã/tarde/noite)

Marca itens como feitos → PATCH /toggle

Backend recalcula XP e estrelas

Se é dia de checkpoint → oferece quiz

5. Conclusão
Último dia completado → status muda para CONCLUIDA

Badge final "Mestre dos Cuidados" 🏆

Histórico salvo no perfil

📱 Estrutura do Mobile (Estado Atual)
Telas Existentes (com dados mockados)
app/
├── login.tsx                    # Login com validação
├── (tabs)/
│   ├── index.tsx               # Dashboard: progresso, lembretes, dicas
│   ├── explore.tsx             # Guia de cuidados (4 fases)
│   └── perfil.tsx              # Perfil, histórico, configurações
└── nova-tatuagem.tsx           # Formulário (pode ser removido)

Copy
Componentes
context/
└── auth.tsx                    # Context API (login/logout) — MOCKADO

constants/
└── theme.ts                    # Tema escuro, cores, fontes

Copy
O Que Precisa Ser Modificado
Arquivo	Mudança
context/auth.tsx	Substituir login mock → chamada REST real + JWT
(tabs)/index.tsx	Trocar dados mockados → buscar cicatrização ativa
(tabs)/explore.tsx	Pode virar referência estática ou ser substituída
(tabs)/perfil.tsx	Conectar com dados reais do backend
NOVA: (tabs)/caminho.tsx	Tela principal do caminho Duolingo
NOVA: dia/[numero].tsx	Tela de detalhes do dia (checklist + quiz)
🚀 Plano de Implementação
✅ Fase 1 — Backend Foundation (CONCLUÍDA)
1.1 Entidades criadas:

Cicatrizacao.java

CheckpointDia.java

ChecklistItem.java

1.2 Repositórios criados:

CicatrizacaoRepository

CheckpointDiaRepository

ChecklistItemRepository

1.3 Service criado:

CicatrizacaoService com:

calcularPeriodo(regiao, largura, altura)

gerarCheckpoints(cicatrizacao, periodo, dataInicio)

gerarChecklistItens(checkpoint, dia)

recalcularCheckpoint(checkpoint) — XP e estrelas

atualizarStatusDias(cicatrizacaoId) — DISPONIVEL/PERDIDO

1.4 Gatilho implementado:

AgendamentoService.updateStatus() modificado

Quando status → REALIZADO, chama cicatrizacaoService.iniciar()

1.5 Controller criado:

CicatrizacaoController com 5 endpoints REST

1.6 Segurança atualizada:

SecurityConfig liberou rotas /api/cicatrizacao/** para autenticados

CORS atualizado para aceitar Expo (exp://*, http://192.168.*)

🔄 Fase 2 — Mobile Integration (PRÓXIMA)
2.1 Autenticação real

Criar services/api.ts com Axios + interceptor JWT

Substituir lógica mockada em context/auth.tsx

Guardar token no AsyncStorage

2.2 Dashboard conectado

Modificar (tabs)/index.tsx

Chamar GET /cicatrizacao/ativa/{clienteId}

Mostrar progresso real

2.3 Tela do Caminho

Criar (tabs)/caminho.tsx — nova tab principal

ScrollView vertical com nós em zigzag

Estados visuais: COMPLETO (⭐), DISPONIVEL (pulsando), BLOQUEADO (🔒), PERDIDO (⚠️)

2.4 Tela do Dia

Criar dia/[numero].tsx

Buscar checklist via GET /checklist/dia/{numero}

Agrupar por período (manhã/tarde/noite)

Toggle via PATCH /toggle

2.5 Perfil real

Conectar (tabs)/perfil.tsx com dados do backend

Mostrar histórico de cicatrizações

🎮 Fase 3 — Gamificação (FUTURO)
3.1 Backend:

Entidades StreakUsuario, BadgeUsuario, QuizResposta

Endpoints de streak e badges

Banco de perguntas dos quizzes (JSON ou tabela)

3.2 Mobile:

Tela de quiz quiz/[dia].tsx

Animações de streak, XP, badges

Notificações locais (Expo Notifications)

🎨 Fase 4 — Polimento (FUTURO)
Animações do caminho (react-native-reanimated)

Upload de fotos da evolução

Gráfico de progresso visual

Sons de feedback

Tela de estatísticas/leaderboard

🔐 Segurança e CORS
CORS Configurado
"https://inkflowfrontend.vercel.app",
"https://inkflow-*.vercel.app",
"http://localhost:*",
"https://*.app.github.dev",
"exp://*",              // Expo
"http://192.168.*"      // Rede local (desenvolvimento)

Copy
java
Autenticação
JWT no header: Authorization: Bearer <token>

Validação no JwtFilter

Rotas protegidas por role (CLIENTE, ARTISTA, ADMIN)

📊 Status do Projeto
Componente	Status	Progresso
Backend — Entidades	✅ Concluído	100%
Backend — Repositórios	✅ Concluído	100%
Backend — Service	✅ Concluído	100%
Backend — Controller	✅ Concluído	100%
Backend — Gatilho	✅ Concluído	100%
Mobile — UI	✅ Concluído	80%
Mobile — Integração	⏳ Pendente	0%
Mobile — Caminho Duolingo	⏳ Pendente	0%
Gamificação (Streak/Badges)	⏳ Pendente	0%
Notificações	⏳ Pendente	0%
🎯 Próximos Passos Imediatos
Testar o backend — fazer deploy no Render e testar endpoints

Integrar auth no mobile — login real com JWT

Criar tela do caminho — visualização Duolingo

Conectar checklist — toggle de itens

Implementar notificações locais — lembretes diários

📚 Referências
Documentação do backend: INKFLOWBACKEND/CLAUDE.md

Fluxograma: inkflow_integration_flow.svg

Contexto original: Arquivos .txt na pasta Plano_Implementação

Versão: 1.0