# 🔄 FLUXO DE DADOS - Mobile ↔️ Backend

Diagrama visual de como os dados fluem entre o app mobile e o backend.

---

## 📱 ARQUITETURA GERAL

```
┌─────────────────────────────────────────────────────────────┐
│                      APP MOBILE (React Native)               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │  Telas   │───▶│  Hooks   │───▶│   API    │              │
│  │ (UI/UX)  │◀───│ (Lógica) │◀───│ (Axios)  │              │
│  └──────────┘    └──────────┘    └──────────┘              │
│                                         │                     │
│                                         │ JWT Token           │
│                                         │ AsyncStorage        │
└─────────────────────────────────────────┼───────────────────┘
                                          │
                                          │ HTTPS
                                          │
┌─────────────────────────────────────────┼───────────────────┐
│                                         ▼                     │
│                   BACKEND (Spring Boot)                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │Controller│───▶│ Service  │───▶│Repository│              │
│  │  (REST)  │◀───│ (Lógica) │◀───│   (JPA)  │              │
│  └──────────┘    └──────────┘    └──────────┘              │
│                                         │                     │
│                                         ▼                     │
│                                  ┌──────────┐                │
│                                  │PostgreSQL│                │
│                                  └──────────┘                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 FLUXO DE AUTENTICAÇÃO

```
┌─────────────┐                                    ┌─────────────┐
│   Mobile    │                                    │   Backend   │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  POST /auth/login                               │
       │  { email, senha }                               │
       ├────────────────────────────────────────────────▶│
       │                                                  │
       │                                    Valida credenciais
       │                                    Gera JWT (24h)
       │                                                  │
       │  { token, usuario }                             │
       │◀────────────────────────────────────────────────┤
       │                                                  │
  Salva no AsyncStorage                                  │
  @inkflow:token                                         │
  @inkflow:user                                          │
       │                                                  │
       │  GET /cicatrizacao/usuario/1                    │
       │  Header: Authorization: Bearer {token}          │
       ├────────────────────────────────────────────────▶│
       │                                                  │
       │                                    Valida JWT
       │                                    Busca dados
       │                                                  │
       │  { cicatrizacao }                               │
       │◀────────────────────────────────────────────────┤
       │                                                  │
```

---

## 📊 FLUXO DE DADOS POR TELA

### 1️⃣ DASHBOARD

```
┌──────────────────────────────────────────────────────────────┐
│                         Dashboard                             │
└───────────────────────────┬──────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
    ┌─────────────────────┐ ┌─────────────────────┐
    │ useCicatrizacao()   │ │  useChecklist()     │
    └──────────┬──────────┘ └──────────┬──────────┘
               │                       │
               ▼                       ▼
    GET /cicatrizacao/     GET /checklist/
    usuario/1/ativa        cicatrizacao/1/dia/18
               │                       │
               ▼                       ▼
    ┌─────────────────────┐ ┌─────────────────────┐
    │ Cicatrização ativa  │ │ Checklist do dia    │
    │ - ID                │ │ - Manhã (3 itens)   │
    │ - Dia atual: 18     │ │ - Tarde (2 itens)   │
    │ - Fase: 3           │ │ - Noite (2 itens)   │
    │ - XP: 1580          │ │                     │
    └─────────────────────┘ └─────────────────────┘
               │                       │
               └───────────┬───────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Renderiza   │
                    │  Dashboard   │
                    └──────────────┘
```

### 2️⃣ CAMINHO (Path)

```
┌──────────────────────────────────────────────────────────────┐
│                      Caminho (Path)                           │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
                ┌─────────────────────┐
                │   useCaminho()      │
                └──────────┬──────────┘
                           │
                           ▼
            GET /checkpoint-dias/cicatrizacao/1
                           │
                           ▼
                ┌─────────────────────┐
                │ Array de 30 dias    │
                │ - Dia 1: COMPLETO   │
                │ - Dia 2: COMPLETO   │
                │ - ...               │
                │ - Dia 18: DISPONIVEL│
                │ - Dia 19: BLOQUEADO │
                └──────────┬──────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ Renderiza zigzag     │
                │ com 30 nós coloridos │
                └──────────────────────┘
```

### 3️⃣ DETALHES DO DIA

```
┌──────────────────────────────────────────────────────────────┐
│                    Dia 18 (Detalhes)                          │
└───────────────────────────┬──────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│useChecklist()│  │  useDicas()  │  │  useFotos()  │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                  │
       ▼                 ▼                  ▼
GET /checklist/   GET /dicas/      GET /fotos/
cicatrizacao/1/   dia/18           cicatrizacao/1
dia/18                                     │
       │                 │                  │
       ▼                 ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 7 itens      │  │ 2 dicas      │  │ 5 fotos      │
│ - 3 manhã    │  │ - Pele nova  │  │ - Dia 1      │
│ - 2 tarde    │  │ - Continue   │  │ - Dia 3      │
│ - 2 noite    │  │   cuidando   │  │ - Dia 7      │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                  │
       └─────────────────┼──────────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  Renderiza   │
                  │  tela dia    │
                  └──────────────┘
```

### 4️⃣ PERFIL

```
┌──────────────────────────────────────────────────────────────┐
│                          Perfil                               │
└───────────────────────────┬──────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ useBadges()  │  │useEstatisticas│ │ AuthContext  │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                  │
       ▼                 ▼                  │
GET /badges/      GET /estatisticas/       │
usuario/1         cicatrizacao/1           │
       │                 │                  │
       ▼                 ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 9 badges     │  │ Estatísticas │  │ Usuário      │
│ - 3 desbloq. │  │ - XP: 1580   │  │ - Nome       │
│ - 6 bloq.    │  │ - Streak: 5  │  │ - Email      │
│              │  │ - Taxa: 72%  │  │ - Avatar     │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                  │
       └─────────────────┼──────────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  Renderiza   │
                  │   perfil     │
                  └──────────────┘
```

---

## 🔄 FLUXO DE INTERAÇÕES

### Toggle Checklist Item

```
┌─────────────┐                                    ┌─────────────┐
│   Mobile    │                                    │   Backend   │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
  Usuário clica no item                                  │
       │                                                  │
  Atualiza UI (otimista)                                 │
       │                                                  │
       │  PATCH /checklist/item/123/toggle               │
       ├────────────────────────────────────────────────▶│
       │                                                  │
       │                                    Atualiza DB
       │                                    concluido = true
       │                                    dataMarcacao = now()
       │                                                  │
       │  { item atualizado }                            │
       │◀────────────────────────────────────────────────┤
       │                                                  │
  Confirma UI                                            │
       │                                                  │
```

### Upload de Foto

```
┌─────────────┐                                    ┌─────────────┐
│   Mobile    │                                    │   Backend   │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
  Usuário seleciona foto                                 │
  (ImagePicker)                                          │
       │                                                  │
  Comprime imagem (70%)                                  │
       │                                                  │
       │  POST /fotos/cicatrizacao/1                     │
       │  multipart/form-data                            │
       │  - file: foto.jpg                               │
       │  - numeroDia: 18                                │
       │  - legenda: "Quase curada!"                     │
       ├────────────────────────────────────────────────▶│
       │                                                  │
       │                                    Upload Cloudinary
       │                                    Salva URL no DB
       │                                                  │
       │  { id, urlImagem, numeroDia, ... }              │
       │◀────────────────────────────────────────────────┤
       │                                                  │
  Adiciona à galeria                                     │
       │                                                  │
```

### Responder Quiz

```
┌─────────────┐                                    ┌─────────────┐
│   Mobile    │                                    │   Backend   │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  GET /quiz/dia/7                                │
       ├────────────────────────────────────────────────▶│
       │                                                  │
       │  [ 3 perguntas ]                                │
       │◀────────────────────────────────────────────────┤
       │                                                  │
  Usuário responde                                       │
  todas as perguntas                                     │
       │                                                  │
       │  POST /quiz/responder                           │
       │  { checkpointDiaId: 7,                          │
       │    respostas: {1:1, 2:1, 3:1} }                 │
       ├────────────────────────────────────────────────▶│
       │                                                  │
       │                                    Calcula acertos
       │                                    Calcula XP ganho
       │                                    Salva histórico
       │                                    Atualiza checkpoint
       │                                                  │
       │  { acertos: 3, xpGanho: 45 }                    │
       │◀────────────────────────────────────────────────┤
       │                                                  │
  Mostra resultado                                       │
  Animação de XP                                         │
       │                                                  │
```

---

## 🎯 ESTRATÉGIA DE FALLBACK

Todos os hooks implementam fallback para mock data:

```javascript
async function fetchData() {
  try {
    const response = await api.get('/endpoint');
    if (response.data && response.data.length > 0) {
      setData(response.data);  // ✅ Usa dados reais
    } else {
      setData(MOCK_DATA);      // 🔄 Fallback para mock
    }
  } catch (error) {
    console.log('Usando mock:', error);
    setData(MOCK_DATA);        // 🔄 Fallback em caso de erro
  }
}
```

**Vantagens**:
- App nunca quebra
- Desenvolvimento pode continuar sem backend pronto
- Fácil visualização de UI com dados mockados
- Transição suave para dados reais

---

## 🔒 SEGURANÇA

### JWT Token Flow

```
1. Login → Backend gera JWT (HS256, 24h)
2. Mobile salva no AsyncStorage
3. Interceptor Axios adiciona em TODAS as requests:
   Header: Authorization: Bearer {token}
4. Backend valida JWT em cada request
5. Se inválido/expirado → 401 Unauthorized
6. Mobile detecta 401 → Redireciona para login
```

### Dados Sensíveis

```
❌ NUNCA armazenar:
- Senha em texto plano
- Token em variáveis globais
- Credenciais no código

✅ SEMPRE:
- JWT no AsyncStorage (criptografado pelo OS)
- HTTPS para todas as requests
- Validar JWT no backend
- Expiração de 24h
```

---

## 📊 PERFORMANCE

### Otimizações Implementadas

1. **Atualização Otimista**
   - UI atualiza antes da resposta do servidor
   - Reverte se houver erro

2. **Cache Local**
   - AsyncStorage para dados do usuário
   - Reduz requests desnecessárias

3. **Loading States**
   - Spinners durante fetch
   - Skeleton screens (futuro)

4. **Compressão de Imagens**
   - 70% quality no upload
   - Max 1MB por foto

---

## 🎨 ESTADOS DA UI

```
┌─────────────────────────────────────────────────┐
│                  Hook State                      │
├─────────────────────────────────────────────────┤
│                                                  │
│  loading: true  → Mostra spinner                │
│  loading: false → Mostra dados                  │
│                                                  │
│  error: null    → Tudo OK                       │
│  error: string  → Mostra mensagem de erro       │
│                                                  │
│  data: []       → Mostra "Nenhum dado"          │
│  data: [...]    → Renderiza lista               │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 🔍 DEBUG

### Console Logs Implementados

Todos os hooks têm logs para debug:

```javascript
console.log('[BADGES] Usando dados mockados:', error);
console.log('[FOTOS] Erro no upload:', error);
console.log('[QUIZ] Erro ao enviar respostas');
```

**Como usar**:
1. Abrir DevTools (F12)
2. Ir na aba Console
3. Filtrar por `[BADGES]`, `[FOTOS]`, etc.
4. Ver exatamente onde está falhando

---

## ✅ VALIDAÇÃO DE DADOS

### TypeScript Interfaces

Todas as estruturas de dados têm interfaces TypeScript:

```typescript
interface Badge {
  id: number;
  nome: string;
  descricao: string;
  icone: string;
  categoria: 'STREAK' | 'XP' | 'CONCLUSAO' | 'ESPECIAL';
  desbloqueado: boolean;
  dataDesbloqueio?: string;
  progresso?: number;
}
```

**Benefícios**:
- Autocomplete no VSCode
- Erros de tipo em tempo de desenvolvimento
- Documentação inline
- Refatoração segura

---

## 🚀 PRÓXIMOS PASSOS

1. Implementar endpoints no backend
2. Testar com curl/Postman
3. Verificar logs do console no app
4. Confirmar que dados reais aparecem
5. Remover mock data (opcional)
