# 🔌 API ENDPOINTS - InkFlowCare Mobile

Documentação completa de todos os endpoints necessários para integração com o backend.

**Base URL**: `https://inkflowbackend-4w1g.onrender.com/api`

---

## ✅ ENDPOINTS JÁ IMPLEMENTADOS E FUNCIONANDO

### 🔐 Autenticação
- `POST /auth/login` - Login com email/senha → retorna JWT + dados do usuário
- Usado em: `context/auth.tsx`

### 🩹 Cicatrização
- `GET /cicatrizacao/usuario/{usuarioId}/ativa` - Busca cicatrização ativa do usuário
- Usado em: `hooks/useCicatrizacao.ts`

### ✅ Checklist
- `GET /checklist/cicatrizacao/{cicatrizacaoId}/dia/{numeroDia}` - Lista itens do checklist do dia
- `PATCH /checklist/item/{itemId}/toggle` - Marca/desmarca item do checklist
- Usado em: `hooks/useChecklist.ts`

### 🛤️ Caminho (Checkpoint Dias)
- `GET /checkpoint-dias/cicatrizacao/{cicatrizacaoId}` - Lista todos os dias do caminho Duolingo
- Usado em: `hooks/useCaminho.ts`

---

## ✅ MAIS ENDPOINTS IMPLEMENTADOS
### 1️⃣ NOTIFICAÇÕES

#### `GET /notificacoes/usuario/{usuarioId}`
**Descrição**: Busca preferências de notificação do usuário

**Response**:
```json
{
  "id": 1,
  "usuario": { "id": 1 },
  "horarioManha": "08:00",
  "horarioTarde": "14:00",
  "horarioNoite": "21:00",
  "notificacoesAtivas": true
}
```

**Usado em**: `hooks/useNotifications.ts` (linha 47 - atualmente usando AsyncStorage local)

---

#### `PUT /notificacoes/usuario/{usuarioId}`
**Descrição**: Atualiza preferências de notificação

**Request Body**:
```json
{
  "horarioManha": "08:00",
  "horarioTarde": "14:00",
  "horarioNoite": "21:00",
  "notificacoesAtivas": true
}
```

**Response**: Mesma estrutura do GET

**Usado em**: `hooks/useNotifications.ts` (linha 56 - atualmente salvando apenas local)

---

### 2️⃣ BADGES

#### `GET /badges/usuario/{usuarioId}`
**Descrição**: Lista todas as badges do usuário (desbloqueadas e bloqueadas)

**Response**:
```json
[
  {
    "id": 1,
    "nome": "Primeiro Passo",
    "descricao": "Complete o primeiro dia de cuidados",
    "icone": "footsteps",
    "categoria": "CONCLUSAO",
    "desbloqueado": true,
    "dataDesbloqueio": "2025-07-10T10:30:00",
    "progresso": 100
  },
  {
    "id": 2,
    "nome": "Semana Completa",
    "descricao": "Mantenha um streak de 7 dias",
    "icone": "flame",
    "categoria": "STREAK",
    "desbloqueado": false,
    "progresso": 64
  }
]
```

**Categorias**: `STREAK`, `XP`, `CONCLUSAO`, `ESPECIAL`

**Ícones disponíveis**: `footsteps`, `flame`, `flash`, `trophy`, `diamond`, `bulb`, `shield-checkmark`, `library`, `water`

**Usado em**: `hooks/useBadges.ts` (linha 38 - atualmente usando mock)

---

#### `GET /badges/disponiveis`
**Descrição**: Lista todas as badges possíveis do sistema (opcional - para admin)

**Response**: Array com mesma estrutura acima

**Usado em**: Não implementado ainda (futuro)

---

### 3️⃣ FOTOS

#### `POST /fotos/cicatrizacao/{cicatrizacaoId}`
**Descrição**: Upload de foto da evolução da tatuagem

**Request**: `multipart/form-data`
- `file`: Arquivo de imagem (JPEG/PNG)
- `numeroDia`: Número do dia (integer)
- `legenda`: Texto opcional (string)

**Response**:
```json
{
  "id": 1,
  "cicatrizacao": { "id": 1 },
  "urlImagem": "https://res.cloudinary.com/inkflow/image/upload/v123456/foto.jpg",
  "numeroDia": 7,
  "dataUpload": "2025-07-17T14:30:00",
  "legenda": "Descamação começando"
}
```

**Usado em**: `hooks/useFotos.ts` (linha 73 - atualmente usando mock local)

---

#### `GET /fotos/cicatrizacao/{cicatrizacaoId}`
**Descrição**: Lista todas as fotos de uma cicatrização

**Response**: Array com estrutura acima

**Usado em**: `hooks/useFotos.ts` (linha 35 - atualmente usando mock)

---

#### `DELETE /fotos/{fotoId}`
**Descrição**: Remove uma foto

**Response**: `204 No Content`

**Usado em**: `hooks/useFotos.ts` (linha 95 - atualmente apenas remove local)

---

### 4️⃣ ESTATÍSTICAS

#### `GET /estatisticas/cicatrizacao/{cicatrizacaoId}`
**Descrição**: Dados para gráficos de progresso

**Response**:
```json
{
  "xpPorDia": [
    { "dia": 1, "xp": 100 },
    { "dia": 2, "xp": 85 },
    { "dia": 3, "xp": 95 }
  ],
  "streakAtual": 5,
  "melhorStreak": 12,
  "diasCompletos": 15,
  "totalDias": 30,
  "taxaConclusao": 72
}
```

**Usado em**: `hooks/useEstatisticas.ts` (linha 38 - atualmente usando mock com 18 dias)

---

### 5️⃣ QUIZ

#### `GET /quiz/dia/{checkpointDiaId}`
**Descrição**: Busca perguntas do quiz de um dia específico

**Response**:
```json
[
  {
    "id": 1,
    "pergunta": "Qual é o melhor momento para aplicar pomada cicatrizante?",
    "opcoes": [
      "Antes de lavar",
      "Depois de lavar e secar",
      "Junto com sabão",
      "Não precisa aplicar"
    ],
    "respostaCorreta": 1,
    "explicacao": "A pomada deve ser aplicada sempre após lavar e secar a tatuagem com papel toalha. Isso garante máxima absorção.",
    "xpBonus": 15
  }
]
```

**Notas**:
- `respostaCorreta` é o índice do array `opcoes` (0-3)
- Retornar array vazio se o dia não tiver quiz
- Dias com quiz: 7, 14, 21, 28 (sugestão)

**Usado em**: `hooks/useQuiz.ts` (linha 60 - atualmente usando mock para dias 7 e 14)

---

#### `POST /quiz/responder`
**Descrição**: Envia respostas do quiz (para salvar histórico e calcular XP)

**Request Body**:
```json
{
  "checkpointDiaId": 7,
  "respostas": {
    "1": 1,
    "2": 1,
    "3": 1
  }
}
```

**Response**:
```json
{
  "acertos": 3,
  "totalPerguntas": 3,
  "xpGanho": 45,
  "percentualAcerto": 100
}
```

**Usado em**: `hooks/useQuiz.ts` (linha 103 - atualmente apenas log)

---

### 6️⃣ DICAS DO DIA

#### `GET /dicas/dia/{numeroDia}`
**Descrição**: Busca dicas específicas de um dia

**Response**:
```json
[
  {
    "id": 1,
    "titulo": "Hidratação é essencial",
    "descricao": "Aplique pomada 3x ao dia para manter a pele hidratada e acelerar a cicatrização.",
    "icone": "water-drop"
  },
  {
    "id": 2,
    "titulo": "Evite coçar",
    "descricao": "A coceira é normal, mas coçar pode danificar a tatuagem. Aplique pomada para aliviar.",
    "icone": "hand-left"
  }
]
```

**Usado em**: `app/dia/[numero].tsx` (linha 89 - atualmente usando mock)

---

### 7️⃣ GUIA DE CUIDADOS (OPCIONAL)

#### `GET /guia/categorias`
**Descrição**: Lista categorias do guia

**Response**:
```json
[
  {
    "id": 1,
    "nome": "Higiene",
    "icone": "water-outline",
    "cor": "#4A90E2",
    "totalArtigos": 5
  },
  {
    "id": 2,
    "nome": "Alimentação",
    "icone": "nutrition-outline",
    "cor": "#7ED321",
    "totalArtigos": 3
  }
]
```

**Usado em**: `app/(tabs)/explore.tsx` (atualmente hardcoded com fases)

---

#### `GET /guia/categoria/{categoriaId}`
**Descrição**: Lista artigos de uma categoria

**Response**:
```json
[
  {
    "id": 1,
    "categoria": { "id": 1, "nome": "Higiene" },
    "titulo": "Como lavar sua tatuagem corretamente",
    "resumo": "Aprenda a técnica correta para lavar sem danificar",
    "conteudo": "# Como lavar\n\n1. Use água morna...",
    "icone": "water",
    "dataPublicacao": "2025-01-01"
  }
]
```

**Usado em**: Não implementado (explore.tsx usa dados estáticos)

---

## 📊 RESUMO DE PRIORIDADES

| Endpoint | Prioridade | Status | Hook |
|----------|-----------|--------|------|
| GET /badges/usuario/{id} | 🔴 ALTA | Mock | useBadges.ts |
| GET /estatisticas/cicatrizacao/{id} | 🔴 ALTA | Mock | useEstatisticas.ts |
| GET /dicas/dia/{numero} | 🔴 ALTA | Mock | dia/[numero].tsx |
| POST /fotos/cicatrizacao/{id} | 🟡 MÉDIA | Mock | useFotos.ts |
| GET /fotos/cicatrizacao/{id} | 🟡 MÉDIA | Mock | useFotos.ts |
| DELETE /fotos/{id} | 🟡 MÉDIA | Mock | useFotos.ts |
| GET /quiz/dia/{id} | 🟡 MÉDIA | Mock | useQuiz.ts |
| POST /quiz/responder | 🟡 MÉDIA | Mock | useQuiz.ts |
| GET /notificacoes/usuario/{id} | 🟢 BAIXA | Local | useNotifications.ts |
| PUT /notificacoes/usuario/{id} | 🟢 BAIXA | Local | useNotifications.ts |
| GET /guia/categorias | 🟢 BAIXA | Hardcoded | explore.tsx |
| GET /guia/categoria/{id} | 🟢 BAIXA | Hardcoded | explore.tsx |

---

## 🔧 COMO TESTAR CADA ENDPOINT

### 1. Badges
```bash
# Testar GET
curl -H "Authorization: Bearer {JWT}" \
  https://inkflowbackend-4w1g.onrender.com/api/badges/usuario/1
```

### 2. Estatísticas
```bash
# Testar GET
curl -H "Authorization: Bearer {JWT}" \
  https://inkflowbackend-4w1g.onrender.com/api/estatisticas/cicatrizacao/1
```

### 3. Fotos
```bash
# Testar GET
curl -H "Authorization: Bearer {JWT}" \
  https://inkflowbackend-4w1g.onrender.com/api/fotos/cicatrizacao/1

# Testar POST (upload)
curl -X POST \
  -H "Authorization: Bearer {JWT}" \
  -F "file=@foto.jpg" \
  -F "numeroDia=7" \
  -F "legenda=Teste" \
  https://inkflowbackend-4w1g.onrender.com/api/fotos/cicatrizacao/1
```

### 4. Quiz
```bash
# Testar GET
curl -H "Authorization: Bearer {JWT}" \
  https://inkflowbackend-4w1g.onrender.com/api/quiz/dia/7

# Testar POST
curl -X POST \
  -H "Authorization: Bearer {JWT}" \
  -H "Content-Type: application/json" \
  -d '{"checkpointDiaId":7,"respostas":{"1":1,"2":0}}' \
  https://inkflowbackend-4w1g.onrender.com/api/quiz/responder
```

### 5. Dicas
```bash
# Testar GET
curl -H "Authorization: Bearer {JWT}" \
  https://inkflowbackend-4w1g.onrender.com/api/dicas/dia/7
```

---

## 📝 NOTAS IMPORTANTES

1. **Todos os hooks já estão preparados** com fallback para mock data
2. **Quando o endpoint retornar dados**, o app automaticamente usará a API real
3. **JWT é adicionado automaticamente** pelo interceptor em `services/api.ts`
4. **Erros são tratados** com console.log e fallback para mock
5. **Não há necessidade de alterar código do app** - apenas implementar os endpoints

---

## 🎯 PRÓXIMOS PASSOS

1. Testar cada endpoint com curl/Postman
2. Verificar se o app mobile detecta automaticamente os dados reais
3. Remover mock data após confirmação (opcional - pode manter como fallback)

---

## 🧪 COMO TESTAR RAPIDAMENTE (Atalhos)

**1. Obter Token:**
```bash
TOKEN=$(curl -s -X POST https://inkflowbackend-4w1g.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"cat@gmail.com","password":"cat"}' \
  | jq -r '.token')
```

**2. Fazer Requisição:**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://inkflowbackend-4w1g.onrender.com/api/seu-endpoint-aqui
```

> **Atenção:** Em caso de erro 500, o problema geralmente é no banco Somee (timeout/cold-start) ou dados de teste inconsistentes. Tente novamente ou recrie o JWT.
