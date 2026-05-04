# InkFlowCare Mobile — Onboarding para Nova Sessão

## Regras de Comportamento (OBRIGATÓRIAS)
1. Antes de qualquer alteração: descreva o arquivo, linha exata e o 
   que será substituído. Aguarde confirmação antes de aplicar.
2. NUNCA use PowerShell, scripts .ps1 ou manipulação por índice de 
   caractere. Use apenas fsReplace com trechos exatos.
   Se fsReplace falhar, oriente edição manual no VS Code.

## Commits e Push
- Branch: main (mobile)
- Formato: prefixo em inglês (feat:, fix:, style:, chore:) + mensagem em português
- Exemplo: `feat: adiciona login real com JWT e AsyncStorage`

## Comandos de Push
Mobile:
```bash
git push origin main
```

## Repositórios
- Mobile: [definir repositório quando criado]

## Stack
- Framework: React Native + Expo 54
- Linguagem: TypeScript
- Navegação: Expo Router (file-based routing) + React Navigation (tabs)
- Backend: Spring Boot (compartilhado com web) → Render
- Auth: JWT armazenado em AsyncStorage
- Tema: Escuro (#000000 → #0a0a2e → #0d1b4b), cor primária #FF0000

## O que está implementado e funcionando
- UI completa (80%) com dados mockados:
  - Tela de login com validação
  - Dashboard com progresso de cicatrização (mockado)
  - Guia de cuidados com 4 fases
  - Perfil com histórico de tatuagens
  - Formulário de nova tatuagem
- Context API de autenticação (mockado)
- Tema escuro completo
- Componentes reutilizáveis (ThemedText, ThemedView)
- Navegação por tabs (Início, Cuidados, Perfil)

## O que precisa ser implementado
- ✅ Backend: Sistema de cicatrização (CONCLUÍDO)
- ⏳ Login real com JWT
- ⏳ Integração com API do backend
- ⏳ Tela do caminho Duolingo
- ⏳ Checklist persistido
- ⏳ Notificações locais (Expo Notifications)
- ⏳ Sistema de streak e badges
- ⏳ Upload de fotos da evolução

## Estrutura do Projeto
- Diretório: `c:\Users\DMJ\OneDrive\Documentos\INKFLOWCARE`
- Plano completo: `Plano_Implementação/PLANO.MD`

---

## Autenticação e Contextos

### AuthContext (context/auth.tsx)
**Estado atual:** Mockado com 2 usuários hardcoded
```typescript
{ email: 'joao@email.com', senha: '123456' }
{ email: 'demo@inkflow.com', senha: 'demo123' }
```

**Estado futuro:** JWT real
- Token armazenado em `AsyncStorage` como `'@inkflow:token'`
- User armazenado em `AsyncStorage` como `'@inkflow:user'` (JSON)
- Roles: `ROLE_CLIENTE` (mobile só usa cliente)

### User Object (AsyncStorage)
```typescript
{
  id: number,
  email: string,
  nome: string,
  fullName: string,
  telefone?: string,
  profileImage?: string
}
```

---

## Estrutura de Dados Importantes

### Cicatrizacao Object
```typescript
{
  id: number,
  agendamento: {
    id: number,
    dataHora: string,
    regiao: string,
    artista: { nome: string }
  },
  dataInicio: string,      // ISO date
  dataFim: string,         // ISO date
  periodoTotalDias: number,
  status: "ATIVA" | "CONCLUIDA" | "ABANDONADA",
  xpTotal: number,
  diaAtual: number,
  faseAtual: "FASE_1_PRIMEIRAS_24H" | "FASE_2_INICIAL" | "FASE_3_DESCAMACAO" | "FASE_4_PROFUNDA"
}
```

### CheckpointDia Object
```typescript
{
  id: number,
  numeroDia: number,
  fase: string,
  statusDia: "BLOQUEADO" | "DISPONIVEL" | "COMPLETO" | "PARCIAL" | "PERDIDO",
  xpGanho: number,
  estrelas: 0 | 1 | 2 | 3,
  temQuiz: boolean,
  data: string  // ISO date
}
```

### ChecklistItem Object
```typescript
{
  id: number,
  periodo: "MANHA" | "TARDE" | "NOITE",
  ordem: number,
  descricao: string,
  concluido: boolean,
  dataMarcacao?: string  // ISO datetime
}
```

---

## Endpoints da API (Backend)

### Base URL
```
https://inkflowbackend-4w1g.onrender.com/api
```

### Autenticação
```
POST /auth/login
Body: { email: string, password: string }
Response: { 
  success: boolean, 
  token: string, 
  user: { id, email, nome, role: "ROLE_CLIENTE" } 
}
```

### Cicatrização
```
GET /cicatrizacao/ativa/{clienteId}
Headers: { Authorization: "Bearer <token>" }
Response: Cicatrizacao | 204 No Content

GET /cicatrizacao/{id}/caminho
Headers: { Authorization: "Bearer <token>" }
Response: CheckpointDia[]

GET /cicatrizacao/{id}/checklist/dia/{numeroDia}
Headers: { Authorization: "Bearer <token>" }
Response: ChecklistItem[]

PATCH /cicatrizacao/{id}/checklist/{itemId}/toggle
Headers: { Authorization: "Bearer <token>" }
Response: CheckpointDia (atualizado com XP e estrelas)
```

---

## Estrutura de Pastas

```
app/
├── _layout.tsx              # Layout raiz
├── login.tsx                # Tela de login
├── (tabs)/
│   ├── _layout.tsx         # Layout das tabs
│   ├── index.tsx           # Tab: Início (Dashboard)
│   ├── explore.tsx         # Tab: Guia de Cuidados
│   └── perfil.tsx          # Tab: Perfil
├── nova-tatuagem.tsx       # Formulário (pode ser removido)
└── [CRIAR] caminho.tsx     # Tab: Caminho Duolingo
└── [CRIAR] dia/[numero].tsx # Tela de detalhes do dia

components/
├── ThemedText.tsx          # Texto com tema
├── ThemedView.tsx          # View com tema
├── Collapsible.tsx         # Componente expansível
└── [CRIAR] CaminhoNode.tsx # Nó do caminho Duolingo

context/
└── auth.tsx                # Context de autenticação

constants/
└── theme.ts                # Cores e fontes

services/
└── [CRIAR] api.ts          # Axios + interceptor JWT
```

---

## Sistema de Caminho Duolingo

### Fases e Cores
| Fase | Dias | Cor | Hex |
|------|------|-----|-----|
| Fase 1 | Dia 1 | 🔴 Vermelho | #E21B3C |
| Fase 2 | Dias 2-7 | 🟠 Laranja | #FF8C00 |
| Fase 3 | Dias 8-14 | 🟡 Amarelo | #FFD700 |
| Fase 4 | Dias 15-30+ | 🟢 Verde | #22c55e |

### Estados Visuais dos Nós
```typescript
type NodeStatus = 
  | "COMPLETO"    // ⭐⭐⭐ verde
  | "PARCIAL"     // ⭐ ou ⭐⭐ amarelo
  | "DISPONIVEL"  // Pulsando com glow (cor da fase)
  | "PERDIDO"     // ⚠️ cinza escuro
  | "BLOQUEADO"   // 🔒 cinza claro
```

### Layout do Caminho
- ScrollView vertical
- Nós dispostos em zigzag (alternando esquerda/direita)
- Linha conectando os nós
- Checkpoint de fase com ícone especial 📝

---

## Sistema de Gamificação

### XP
| Ação | XP |
|------|-----|
| Completar 1 item | +5 |
| Completar período (manhã/tarde/noite) | +30 |
| Completar 100% do dia | +100 |
| Acertar pergunta do quiz | +15 |
| Streak de 7 dias | +100 |
| Streak de 14 dias | +200 |
| Completar cicatrização | +500 |

### Estrelas
- ⭐⭐⭐ = 100% concluído
- ⭐⭐ = 50-99% concluído
- ⭐ = 1-49% concluído
- (vazio) = 0% concluído

### Streak
- Dias consecutivos com ≥80% do checklist
- Streak Freeze: 1 a cada 7 dias (máx 2)
- Quebra se <80% sem freeze

### Badges
| Badge | Condição | Ícone |
|-------|----------|-------|
| Primeiro Passo | Completar Dia 1 | 🦶 |
| Semana Completa | Streak 7 dias | 🔥 |
| Duas Semanas | Streak 14 dias | ⚡ |
| Mestre dos Cuidados | Completar cicatrização | 🏆 |
| Perfeição | 100% todos os dias | 💎 |
| Sabedoria | Acertar todos os quizzes | 🧠 |
| Inabalável | Streak 21+ dias | 🛡️ |
| Colecionador | 3+ cicatrizações | 📚 |

---

## Padrões de Código

### Fetch com Token (services/api.ts)
```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://inkflowbackend-4w1g.onrender.com/api',
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@inkflow:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### AsyncStorage Pattern
```typescript
// Salvar
await AsyncStorage.setItem('@inkflow:token', token);
await AsyncStorage.setItem('@inkflow:user', JSON.stringify(user));

// Ler
const token = await AsyncStorage.getItem('@inkflow:token');
const userJson = await AsyncStorage.getItem('@inkflow:user');
const user = userJson ? JSON.parse(userJson) : null;

// Remover
await AsyncStorage.removeItem('@inkflow:token');
await AsyncStorage.removeItem('@inkflow:user');
```

### useEffect com Async
```typescript
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await api.get('/cicatrizacao/ativa/123');
      setCicatrizacao(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  fetchData();
}, []);
```

### Navigation Pattern (Expo Router)
```typescript
import { router } from 'expo-router';

// Navegar
router.push('/caminho');
router.push(`/dia/${numeroDia}`);

// Voltar
router.back();

// Substituir
router.replace('/login');
```

---

## Notificações Locais (Expo Notifications)

### Setup
```typescript
import * as Notifications from 'expo-notifications';

// Configurar handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Pedir permissão
const { status } = await Notifications.requestPermissionsAsync();
```

### Agendar Notificação Diária
```typescript
await Notifications.scheduleNotificationAsync({
  content: {
    title: "Hora de cuidar da sua tatuagem! 💉",
    body: "Não esqueça de lavar e aplicar pomada.",
  },
  trigger: {
    hour: 9,
    minute: 0,
    repeats: true,
  },
});
```

---

## Tema e Cores

### Cores Principais
```typescript
export const theme = {
  colors: {
    background: '#000000',
    backgroundSecondary: '#0a0a2e',
    backgroundTertiary: '#0d1b4b',
    primary: '#FF0000',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(255, 255, 255, 0.1)',
    success: '#22c55e',
    warning: '#FFD700',
    error: '#E21B3C',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
};
```

### Gradiente de Fundo
```typescript
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={['#000000', '#0a0a2e', '#0d1b4b']}
  style={{ flex: 1 }}
>
  {/* conteúdo */}
</LinearGradient>
```

---

## Bugs Conhecidos (Evitar)

### 1. Token não persiste após fechar app
- **Problema**: Usar `useState` sem AsyncStorage
- **Solução**: Sempre salvar token no AsyncStorage

### 2. Navegação quebra após logout
- **Problema**: Não limpar stack de navegação
- **Solução**: Usar `router.replace('/login')` no logout

### 3. Checklist não atualiza após toggle
- **Problema**: Não atualizar estado local após PATCH
- **Solução**: Atualizar estado imediatamente + refetch

### 4. Notificações não aparecem no iOS
- **Problema**: Permissões não solicitadas corretamente
- **Solução**: Pedir permissões no primeiro acesso + verificar settings

---

## Comandos Úteis

### Desenvolvimento
```bash
# Iniciar Expo
npx expo start

# Limpar cache
npx expo start -c

# Rodar no Android
npx expo start --android

# Rodar no iOS
npx expo start --ios

# Build de produção
eas build --platform android
eas build --platform ios
```

### Dependências Principais
```json
{
  "expo": "~54.0.0",
  "react-native": "0.76.5",
  "expo-router": "~4.0.0",
  "@react-navigation/native": "^6.0.0",
  "axios": "^1.6.0",
  "@react-native-async-storage/async-storage": "^2.1.0",
  "expo-notifications": "~0.29.0",
  "expo-linear-gradient": "~14.0.0"
}
```

---

## Próximos Passos

### Fase 2 — Mobile Integration (EM ANDAMENTO)
- [ ] Criar `services/api.ts` com Axios + interceptor JWT
- [ ] Modificar `context/auth.tsx` para usar API real
- [ ] Atualizar `(tabs)/index.tsx` para buscar cicatrização ativa
- [ ] Criar `(tabs)/caminho.tsx` — tela do caminho Duolingo
- [ ] Criar `dia/[numero].tsx` — tela de detalhes do dia
- [ ] Conectar checklist com PATCH /toggle

### Fase 3 — Gamificação (FUTURO)
- [ ] Implementar sistema de streak
- [ ] Implementar badges
- [ ] Criar tela de quiz
- [ ] Notificações locais diárias

### Fase 4 — Polimento (FUTURO)
- [ ] Animações do caminho (react-native-reanimated)
- [ ] Upload de fotos da evolução
- [ ] Gráfico de progresso visual
- [ ] Sons de feedback

---

## Referências
- **Plano completo:** `Plano_Implementação/PLANO.MD`
- **Backend:** `INKFLOWBACKEND/CLAUDE.md`
- **Fluxograma:** `Plano_Implementação/inkflow_integration_flow.svg`
- **Expo Docs:** https://docs.expo.dev
- **React Navigation:** https://reactnavigation.org
