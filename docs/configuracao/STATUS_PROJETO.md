# 📊 STATUS CONSOLIDADO - InkFlowCare

**Última atualização**: Sessão Sprint 6 concluído

---

## ✅ BACKEND — TUDO FUNCIONANDO

| Grupo | Endpoints | Status |
|-------|-----------|--------|
| Auth | `POST /auth/login` | ✅ |
| Cicatrização | `GET /ativa/{id}`, `GET /{id}/caminho`, `GET /{id}/checklist/dia/{n}`, `PATCH /{id}/checklist/{itemId}/toggle`, `POST /iniciar/{agendamentoId}`, `POST /criar`, `GET /usuario/{id}/historico` | ✅ |
| Badges | `GET /badges/usuario/{id}` | ✅ |
| Estatísticas | `GET /estatisticas/cicatrizacao/{id}` | ✅ |
| Dicas | `GET /dicas/dia/{n}` — com cache Caffeine TTL 1h | ✅ |
| Fotos | `GET`, `POST`, `DELETE /fotos/...` | ✅ |
| Quiz | `GET /quiz/dia/{n}` — com cache Caffeine TTL 1h | ✅ |
| Notificações | `GET`, `PUT /notificacoes/usuario/{id}` | ✅ |
| Clientes | `PUT /clientes/{id}` | ✅ |

**Nenhum endpoint pendente.**

---

## ✅ OTIMIZAÇÕES APLICADAS

| Otimização | Status |
|-----------|--------|
| Índices SQL Server (6 índices) | ✅ |
| Connection pool 5 → 15 conexões | ✅ |
| Logging SQL INFO → WARN | ✅ |
| Fetch joins em repositories (N+1 eliminado) | ✅ |
| Batch insert checklist (210 inserts → saveAll) | ✅ |
| `atualizarStatusDias()` movido para `@Scheduled` (00:01 diário) | ✅ |
| Cache Caffeine para dicas e quiz (TTL 1h) | ✅ |

---

## ✅ BANCO DE DADOS

**Servidor**: `INKFLOW.mssql.somee.com:1433` | **Banco**: `INKFLOW`

| Tabela | Status |
|--------|--------|
| `clientes` | ✅ com dados de teste |
| `agendamentos` | ✅ com dados de teste |
| `cicatrizacoes` | ✅ |
| `checkpoint_dias` | ✅ |
| `checklist_itens` | ✅ |
| `badges` | ✅ 9 registros |
| `badge_usuario` | ✅ |
| `fotos_evolucao` | ✅ |
| `notificacao_preferencias` | ✅ |
| `dicas` | ✅ 28 registros |
| `quiz_perguntas` | ✅ 15 registros |
| `quiz_opcoes` | ✅ 60 registros |

---

## ✅ MOBILE — TUDO FUNCIONANDO

| Funcionalidade | Status |
|---------------|--------|
| Login JWT + persistência AsyncStorage | ✅ |
| Dashboard com cicatrização ativa e checklist | ✅ |
| Caminho Duolingo (30 dias) | ✅ |
| Checklist do dia com toggle | ✅ |
| Perfil com badges, stats, histórico real | ✅ |
| Edição de perfil salva no backend | ✅ |
| Nova tatuagem cria cicatrização via API | ✅ |
| Quiz interativo com envio de respostas | ✅ |
| Fotos de evolução (upload/delete Cloudinary) | ✅ |
| Notificações locais diárias com expo-notifications | ✅ |
| Guia de cuidados | ✅ |

---

## ⚠️ MELHORIAS MENORES (não bloqueantes)

- Badge de notificações fixo em "3" no dashboard
- Botão voltar no perfil não funciona
- Toggle de tema escuro não faz nada
- Sem paginação em fotos (`GET /fotos/cicatrizacao/{id}` retorna tudo)

---

## 🐛 BUGS CONHECIDOS (não regredir)

1. `AsyncStorage.multiRemove` não existe na v3+ → usar `removeItem` individual
2. `Alert.alert` não funciona na web → usar `Platform.OS === 'web' ? window.confirm() : Alert.alert()`
3. Guard com Redirect deve ficar dentro de `(tabs)/_layout.tsx`, não fora
4. `Redirect` não reage a state changes → usar `useEffect + router.replace()`
5. Token deve sempre ser salvo no AsyncStorage, nunca só em useState
