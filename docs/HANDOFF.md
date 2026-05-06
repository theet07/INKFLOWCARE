# 🤝 HANDOFF — InkFlowCare

> Este arquivo é o ponto de entrada para qualquer nova sessão de IA.
> Leia este arquivo ANTES de qualquer outro. Ele contém o estado exato do projeto.

---

## 🗺️ VISÃO GERAL DO PROJETO

**InkFlowCare** é um app mobile (React Native / Expo) de acompanhamento de cicatrização de tatuagens, com gamificação (XP, badges, streak).

- **Backend**: Spring Boot + SQL Server (hospedado no Render + Somee)
- **Mobile**: React Native + Expo Router
- **Auth**: JWT (24h), header `Authorization: Bearer <token>`
- **Backend URL**: `https://inkflowbackend-4w1g.onrender.com/api`
- **Credenciais de teste**: `cat@gmail.com` / `cat`

### Estrutura de Pastas
```
INKFLOWBACKEND/          ← Backend Java (Spring Boot)
  src/main/java/com/backend/INKFLOW/
    controller/          ← REST Controllers
    service/             ← Lógica de negócio
    repository/          ← JPA Repositories
    model/               ← Entidades JPA
    security/            ← JWT + Filters
  src/main/resources/
    application.properties
  migration/             ← Scripts SQL executados manualmente

INKFLOWCARE/             ← App Mobile (React Native)
  app/                   ← Telas (Expo Router)
  hooks/                 ← Hooks de dados (useCicatrizacao, useBadges, etc.)
  services/api.ts        ← Axios instance com interceptor JWT
  docs/                  ← Documentação do projeto
```

---

## 📋 REGRAS OBRIGATÓRIAS (nunca violar)

### Regras de Código
1. **Não remover código existente** sem pedido explícito do usuário
2. **Não adicionar testes** sem pedido explícito
3. **Mínimo de código** — apenas o necessário para resolver o problema
4. **Sem estimativas de tempo** em documentação ou respostas
5. **Sem comentários verbose** — código deve ser autoexplicativo

### Regras de Segurança e Confidencialidade (CRÍTICO)
- **Nunca commitar credenciais reais** — senhas, tokens, API keys, secrets
- **Sempre usar variáveis de ambiente** — `${NOME_DA_VAR}` no `application.properties`, nunca valores hardcoded
- **Arquivos sensíveis devem estar no `.gitignore`** antes de qualquer commit:
  - `.env` e variantes (`*.env`, `.env.local`, `.env.production`)
  - `application-local.properties`, `application-dev.properties`, `application-prod.properties`
  - Certificados e chaves: `*.key`, `*.pem`, `*.p12`, `*.jks`
  - Arquivos com `*secret*`, `*password*`, `*credentials*` no nome
- **Credenciais de teste** (ex: `cat@gmail.com` / `cat`) só podem aparecer em docs se forem dados descartáveis sem acesso a produção
- **Antes de qualquer push**, verificar se nenhum arquivo com valor real de credencial está staged
- **Se uma credencial for acidentalmente commitada**: revogar imediatamente a credencial no serviço (não basta remover do código)

### Regras de Compatibilidade (CRÍTICO)
- **Nunca mudar** URLs de endpoints existentes
- **Nunca remover** campos de response JSON
- **Nunca mudar** tipos de dados em responses
- **Nunca mudar** códigos HTTP de retorno
- **Pode adicionar** novos campos, novos endpoints, otimizações internas

### Banco de Dados
- **SQL Server** (Somee) — sintaxe T-SQL, não PostgreSQL
- Usar `IF NOT EXISTS` em migrations
- Usar `GO` como separador de batches
- Tabelas criadas pelo Hibernate com `ddl-auto=update`

---

## ✅ O QUE JÁ FOI FEITO

### Sprint 1 — Quick Wins (CONCLUÍDO)
| O que | Arquivo | Resultado |
|-------|---------|-----------|
| Schema completo + índices SQL Server | `migration/002_schema_completo_sqlserver.sql` | Executado no banco ✅ |
| Connection pool 5 → 15 conexões | `application.properties` | Aplicado ✅ |
| Logging SQL INFO → WARN | `application.properties` | Aplicado ✅ |

### Sprint 2 — Otimização de Queries (CONCLUÍDO)
| O que | Arquivo | Resultado |
|-------|---------|-----------|
| Fetch join item+checkpoint+cicatrizacao | `repository/ChecklistItemRepository.java` | Aplicado ✅ |
| Fetch join checkpoint+cicatrizacao | `repository/CheckpointDiaRepository.java` | Aplicado ✅ |
| Fetch join badge+usuario | `repository/BadgeUsuarioRepository.java` | Aplicado ✅ |
| Batch insert checklist (saveAll) | `service/CicatrizacaoService.java` | Aplicado ✅ |
| BadgeController usa query otimizada | `controller/BadgeController.java` | Aplicado ✅ |

### Sprint 3 — Cache e Lazy Updates (CONCLUÍDO)
| O que | Arquivo | Resultado |
|-------|---------|-----------|
| `atualizarStatusDias()` movido para `@Scheduled` | `service/StatusDiasScheduler.java` (novo) | Aplicado ✅ |
| Removida chamada em `buscarCaminho()` | `service/CicatrizacaoService.java` | Aplicado ✅ |
| `@EnableCaching` + Caffeine | `InkflowApplication.java`, `pom.xml`, `application.properties` | Aplicado ✅ |
| `@Cacheable` em dicas (TTL 1h) | `controller/DicaController.java` | Aplicado ✅ |
| `@Cacheable` em quiz (TTL 1h) | `controller/QuizController.java` | Aplicado ✅ |

### Sprint 4 — Endpoints Faltantes (CONCLUÍDO)
| O que | Arquivo | Resultado |
|-------|---------|-----------|
| `POST /api/cicatrizacao/criar` | `controller/CicatrizacaoController.java`, `service/CicatrizacaoService.java` | Aplicado ✅ |
| `GET /api/cicatrizacao/usuario/{id}/historico` | `controller/CicatrizacaoController.java`, `repository/CicatrizacaoRepository.java` | Aplicado ✅ |
| `PUT /api/clientes/{id}` integrado no mobile | `app/(tabs)/perfil.tsx` | Aplicado ✅ |
| `nova-tatuagem.tsx` integrado com API | `app/nova-tatuagem.tsx` | Aplicado ✅ |
| Histórico real no perfil | `app/(tabs)/perfil.tsx` | Aplicado ✅ |

### Seed Data (CONCLUÍDO)
| O que | Status |
|-------|--------|
| 9 badges populadas | ✅ Confirmado via API |
| 28 dicas populadas | ✅ Confirmado via API |
| 15 perguntas de quiz | ✅ Confirmado via API |
| 60 opções de quiz | ✅ Confirmado via API |

### Sprint 6 — Notificações Locais (CONCLUÍDO)
| O que | Arquivo | Resultado |
|-------|---------|-----------|
| Permissão com `requestPermissionsAsync` | `hooks/useNotifications.ts` | Aplicado ✅ |
| Agendamento diário com `DAILY` trigger | `hooks/useNotifications.ts` | Aplicado ✅ |
| Cancelar e reagendar ao alterar preferências | `hooks/useNotifications.ts` | Aplicado ✅ |
| No-op na web | `hooks/useNotifications.ts` | Aplicado ✅ |

### Documentação Consolidada
- Deletados 3 arquivos desatualizados (STATUS_BACKEND_REAL, RELATORIO_PENDENCIAS, RESUMO_EXECUTIVO)
- Criado `STATUS_CONSOLIDADO.md` com status real
- Criado `GUIA_RAPIDO.md` consolidando referências
- Renomeado `SEED_DATA.sql` → `SEED_DATA_POSTGRESQL.sql`
- README.md consolidado na raiz do projeto

---

## 🔜 PRÓXIMA TAREFA — Sem sprints críticos pendentes

Todos os sprints planejados foram concluídos. O projeto está estável.

### Melhorias opcionais para sessões futuras
- Badge de notificações dinâmico no dashboard (atualmente fixo em "3")
- Toggle de tema escuro funcional
- Botão voltar no perfil funcional
- Paginação em fotos (`GET /fotos/cicatrizacao/{id}`)

---

## 🗄️ ESTADO DO BANCO DE DADOS

**Servidor**: `INKFLOW.mssql.somee.com:1433`
**Banco**: `INKFLOW`

### Tabelas Existentes
- `clientes` ✅ (com dados de teste)
- `agendamentos` ✅ (com dados de teste)
- `cicatrizacoes` ✅
- `checkpoint_dias` ✅
- `checklist_itens` ✅
- `badges` ✅ (9 registros — seed executado)
- `badge_usuario` ✅
- `fotos_evolucao` ✅
- `notificacao_preferencias` ✅
- `dicas` ✅ (28 registros — seed executado)
- `quiz_perguntas` ✅ (15 registros — seed executado)
- `quiz_opcoes` ✅ (60 registros — seed executado)

---

## ❌ ENDPOINTS FALTANDO NO BACKEND

Todos os endpoints críticos foram implementados. Nenhum pendente.

---

## 📱 PROBLEMAS NO MOBILE

Nenhum problema crítico pendente.

### Melhorias menores (não bloqueantes)
- Badge de notificações fixo em "3" no dashboard
- Botão voltar no perfil não funciona
- Toggle de tema escuro não faz nada

### Bugs Conhecidos do Mobile (não regredir)
1. `AsyncStorage.multiRemove` não existe na v3+ → usar `removeItem` individual
2. `Alert.alert` não funciona na web → usar `Platform.OS === 'web' ? window.confirm() : Alert.alert()`
3. Guard com Redirect deve ficar dentro de `(tabs)/_layout.tsx`, não fora
4. `Redirect` não reage a state changes → usar `useEffect + router.replace()`
5. Token deve sempre ser salvo no AsyncStorage, nunca só em useState

---

## 🔑 ARQUIVOS MAIS IMPORTANTES

### Backend
- `service/CicatrizacaoService.java` — lógica central (cicatrização, checklist, toggle)
- `controller/BadgeController.java` — badges com cálculo de progresso
- `repository/ChecklistItemRepository.java` — queries otimizadas (Sprint 2)
- `application.properties` — config pool, logging, JWT

### Mobile
- `services/api.ts` — Axios com interceptor JWT
- `hooks/useCicatrizacao.ts` — hook principal do app
- `hooks/useChecklist.ts` — toggle de itens
- `context/auth.tsx` — contexto de autenticação

### Documentação
- `docs/STATUS_CONSOLIDADO.md` — status real do projeto
- `docs/PLANO_OTIMIZACAO.md` — plano completo com análise de performance
- `docs/API_ENDPOINTS.md` — todos os endpoints documentados
- `docs/GUIA_RAPIDO.md` — referência rápida com curl commands

---

## 🧭 ORDEM DE EXECUÇÃO RECOMENDADA

```
Sprint 1 (CONCLUÍDO) ✅
  └── Índices de banco, connection pool, logging

Sprint 2 (CONCLUÍDO) ✅
  └── Fetch joins, batch insert, query otimizada badges

Sprint 3 (CONCLUÍDO) ✅
  └── @Scheduled para atualizarStatusDias()
  └── Cache Caffeine para dicas e quiz

Sprint 4 (CONCLUÍDO) ✅
  └── POST /api/cicatrizacao/criar
  └── GET /api/cicatrizacao/usuario/{id}/historico
  └── Integração mobile: nova-tatuagem, perfil, histórico

Sprint 5 (CONCLUÍDO) ✅
  └── Seed data executado e confirmado
  └── Documentação consolidada e atualizada

Sprint 6 (CONCLUÍDO) ✅
  └── Notificações locais reais com expo-notifications
```

---

## ⚡ COMO COMEÇAR A PRÓXIMA SESSÃO

### Passo 1 — Leitura Obrigatória (nesta ordem)

Leia os arquivos abaixo sequencialmente antes de escrever qualquer código:

```
1. INKFLOWCARE/docs/HANDOFF.md                          ← este arquivo (contexto geral)
2. INKFLOWCARE/docs/STATUS_CONSOLIDADO.md               ← o que está feito e o que falta
3. INKFLOWCARE/docs/PLANO_OTIMIZACAO.md                 ← plano completo com análise de performance
4. INKFLOWCARE/docs/API_ENDPOINTS.md                    ← contratos de API (não quebrar)
5. INKFLOWCARE/docs/DOCS.md                             ← design system, bugs conhecidos, padrões de código mobile
6. INKFLOWCARE/docs/GUIA_RAPIDO.md                      ← tabela de endpoints e como testar
```

### Passo 2 — Leitura dos Arquivos Relevantes

```
7. INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/service/CicatrizacaoService.java
8. INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/controller/CicatrizacaoController.java
9. INKFLOWCARE/hooks/useNotifications.ts
10. INKFLOWCARE/app/(tabs)/perfil.tsx
11. INKFLOWCARE/app/nova-tatuagem.tsx
```

### Passo 3 — Estado Atual

Todos os sprints planejados estão concluídos. Consulte a seção **Melhorias opcionais** acima para próximos passos.

---

## 📂 LEITURA COMPLETA DO PROJETO (Entendimento Profundo)

> Faça esta leitura por último, após os Passos 1 e 2. O objetivo é ter visão completa do código antes de qualquer sprint futuro.

### Backend — Ler nesta ordem

```
── Models (Entidades JPA)
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/model/Cliente.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/model/Agendamento.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/model/Cicatrizacao.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/model/CheckpointDia.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/model/ChecklistItem.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/model/Badge.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/model/BadgeUsuario.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/model/FotoEvolucao.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/model/Dica.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/model/QuizPergunta.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/model/QuizOpcao.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/model/NotificacaoPreferencia.java

── Repositories
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/repository/CicatrizacaoRepository.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/repository/CheckpointDiaRepository.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/repository/ChecklistItemRepository.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/repository/BadgeRepository.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/repository/BadgeUsuarioRepository.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/repository/DicaRepository.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/repository/QuizPerguntaRepository.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/repository/QuizOpcaoRepository.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/repository/FotoEvolucaoRepository.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/repository/NotificacaoPreferenciaRepository.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/repository/ClienteRepository.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/repository/AgendamentoRepository.java

── Services
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/service/CicatrizacaoService.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/service/ClienteService.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/service/FotoService.java

── Controllers
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/controller/CicatrizacaoController.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/controller/BadgeController.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/controller/EstatisticasController.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/controller/DicaController.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/controller/QuizController.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/controller/FotoEvolucaoController.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/controller/NotificacaoController.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/controller/ClienteController.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/controller/AuthController.java

── Segurança e Config
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/security/SecurityConfig.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/security/JwtUtil.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/security/JwtFilter.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/config/GlobalExceptionHandler.java
INKFLOWBACKEND/src/main/java/com/backend/INKFLOW/InkflowApplication.java
INKFLOWBACKEND/src/main/resources/application.properties
INKFLOWBACKEND/pom.xml
```

### Mobile — Ler nesta ordem

```
── Configuração e Serviços
INKFLOWCARE/services/api.ts
INKFLOWCARE/context/auth.tsx
INKFLOWCARE/constants/theme.ts

── Hooks (lógica de dados)
INKFLOWCARE/hooks/useCicatrizacao.ts
INKFLOWCARE/hooks/useCaminho.ts
INKFLOWCARE/hooks/useChecklist.ts
INKFLOWCARE/hooks/useBadges.ts
INKFLOWCARE/hooks/useEstatisticas.ts
INKFLOWCARE/hooks/useFotos.ts
INKFLOWCARE/hooks/useQuiz.ts
INKFLOWCARE/hooks/useNotifications.ts

── Telas (Expo Router)
INKFLOWCARE/app/_layout.tsx
INKFLOWCARE/app/login.tsx
INKFLOWCARE/app/nova-tatuagem.tsx
INKFLOWCARE/app/(tabs)/_layout.tsx
INKFLOWCARE/app/(tabs)/index.tsx
INKFLOWCARE/app/(tabs)/caminho.tsx
INKFLOWCARE/app/(tabs)/perfil.tsx
INKFLOWCARE/app/(tabs)/explore.tsx
INKFLOWCARE/app/dia/[numero].tsx
INKFLOWCARE/app/quiz/[diaId].tsx

── Configuração do Projeto
INKFLOWCARE/app.json
INKFLOWCARE/package.json
```
