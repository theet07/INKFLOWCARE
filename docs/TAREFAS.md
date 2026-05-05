# InkFlowCare Mobile — Tarefas Restantes

## ✅ Pronto
- Autenticação JWT com AsyncStorage
- Hooks de integração backend (useCicatrizacao, useChecklist, useCaminho)
- Dashboard com progresso e checklist funcional
- Caminho estilo Duolingo com navegação
- Tela de detalhes do dia com checklist por período
- Perfil com dados do usuário
- Design system completo (#0e0e0e, #ff8d8c, #262626)
- Navegação 4 tabs (grid, bandage, document, person)

---

## 🚧 Backlog (por prioridade)

### 1️⃣ Melhorias na tela dia/[numero] — PRIORIDADE ALTA
- [ ] Header fixo com voltar e título "Dia X"
- [ ] Card de resumo (XP, estrelas, status)
- [ ] Seção dicas do dia (`GET /api/dicas/dia/{numeroDia}`)
- [ ] Botão quiz se `temQuiz === true`
- [ ] Botão "📷 Adicionar Foto"

### 2️⃣ Notificações Locais — PRIORIDADE ALTA
- [ ] Instalar `expo-notifications` + `expo-device`
- [ ] Criar `hooks/useNotifications.ts`
- [ ] Agendar 3 notificações diárias (manhã, tarde, noite)
- [ ] Toggle em perfil.tsx + modal TimePicker
- [ ] Sincronizar com backend (`GET/PUT /api/notificacoes/usuario/{id}`)

### 3️⃣ Sistema de Badges — PRIORIDADE MÉDIA
- [ ] Criar `hooks/useBadges.ts` (`GET /api/badges/usuario/{id}`)
- [ ] Criar `components/BadgeCard.tsx` (colorido vs cinza)
- [ ] Seção "Conquistas" em perfil.tsx (grid 3 colunas)
- [ ] Modal de detalhes ao clicar
- [ ] Animação de confete ao desbloquear

### 4️⃣ Upload de Fotos — PRIORIDADE MÉDIA
- [ ] Instalar `expo-image-picker`
- [ ] Criar `hooks/useFotos.ts` (upload multipart → Cloudinary)
- [ ] Criar `components/FotoGallery.tsx` (grid 2 colunas)
- [ ] Botão em dia/[numero].tsx
- [ ] Compressão antes do upload (max 1MB)

### 5️⃣ Gráficos de Progresso — PRIORIDADE BAIXA
- [ ] Instalar `react-native-chart-kit` + `react-native-svg`
- [ ] Criar `hooks/useEstatisticas.ts`
- [ ] Gráfico de linha XP + barras conclusão diária
- [ ] Seção em perfil.tsx ou nova tela

### 6️⃣ Tela de Quiz — PRIORIDADE BAIXA
- [ ] Criar `app/quiz/[diaId].tsx`
- [ ] Criar `hooks/useQuiz.ts` (`GET /api/quiz/dia/{id}`)
- [ ] 4 opções, feedback verde/vermelho, explicação
- [ ] Animação XP ganho

### 7️⃣ Tela de Explore/Guia — PRIORIDADE BAIXA
- [ ] Criar `app/(tabs)/explore.tsx` (conteúdo real)
- [ ] Criar `hooks/useGuia.ts` (`GET /api/guia/categorias`)
- [ ] Cards com ícones + navegação para artigo
- [ ] Renderizar Markdown (`react-native-markdown-display`)

---

## 📦 Dependências a Instalar
```bash
npx expo install expo-notifications expo-device      # Notificações
npx expo install expo-image-picker                    # Upload fotos
npm install react-native-chart-kit react-native-svg   # Gráficos
npm install react-native-markdown-display             # Guia
```

## 🔑 Referências
- Backend: `https://inkflowbackend-4w1g.onrender.com/api`
- Design: `docs/REFERENCIAS_TELAS/`
- Docs: `docs/DOCS.md`
