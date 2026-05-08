# InkFlowCare — Documentação Técnica

> Consolidação de `CLAUDE.md` + `ESPECIFICACAO_TELAS.md`

---

## Stack

- **Framework:** React Native + Expo 54
- **Linguagem:** TypeScript
- **Navegação:** Expo Router (file-based routing) + React Navigation (tabs)
- **Backend:** Spring Boot (compartilhado com web) → Render
- **Auth:** JWT armazenado em AsyncStorage
- **Tema:** Dark mode — background `#0e0e0e`, surface `#262626`, primary `#FF4757`

---

## Estrutura de Pastas

```
app/
├── _layout.tsx              # Layout raiz (AuthProvider + Stack)
├── login.tsx                # Tela de login
├── (tabs)/
│   ├── _layout.tsx          # Layout das tabs (auth guard)
│   ├── index.tsx            # Tab: Dashboard
│   ├── caminho.tsx          # Tab: Recovery Progress (Duolingo path)
│   ├── explore.tsx          # Tab: Guia de Cuidados
│   └── perfil.tsx           # Tab: Perfil

components/                   # Componentes reutilizáveis
context/auth.tsx              # Context de autenticação (JWT + AsyncStorage)
hooks/
├── useCicatrizacao.ts        # Busca cicatrização ativa
├── useCaminho.ts             # Busca checkpoints (caminho)
└── useChecklist.ts           # Busca e toggle do checklist diário
services/api.ts               # Axios com interceptor JWT
scripts/
├── diagnose-auth.js          # Diagnóstico de auth
└── test-backend.js           # Testes manuais de endpoints
docs/
├── DOCS.md                   # Este arquivo
├── Plano_Implementação/      # PLANO.MD + fluxograma SVG
├── REFERENCIAS_TELAS/        # HTML de referência visual (Dashboard, Cuidados, Perfil)
└── prompts/                  # Prompts de IA utilizados (arquivo morto)
```

---

## Endpoints da API

### Base URL
```
https://inkflowbackend-4w1g.onrender.com/api
```

### Autenticação
```
POST /auth/login
Body: { email: string, password: string }
Response: { success: boolean, token: string, user: { id, email, nome, role } }
```

### Cicatrização
```
GET  /cicatrizacao/ativa/{clienteId}         → Cicatrizacao | 204
GET  /cicatrizacao/{id}/caminho              → CheckpointDia[]
GET  /cicatrizacao/{id}/checklist/dia/{num}  → ChecklistItem[]
PATCH /cicatrizacao/{id}/checklist/{itemId}/toggle → CheckpointDia (atualizado)
```

Todas as rotas protegidas requerem `Authorization: Bearer <token>`.

---

## Estrutura de Dados

### Cicatrizacao
```typescript
{
  id: number;
  agendamento: {
    id: number;
    dataHora: string;
    regiao: string;
    artista: { nome: string };
  };
  dataInicio: string;
  dataFim: string;
  periodoTotalDias: number;
  status: "ATIVA" | "CONCLUIDA" | "ABANDONADA";
  xpTotal: number;
  diaAtual: number;
  faseAtual: "FASE_1_PRIMEIRAS_24H" | "FASE_2_INICIAL" | "FASE_3_DESCAMACAO" | "FASE_4_PROFUNDA";
}
```

### CheckpointDia
```typescript
{
  id: number;
  numeroDia: number;
  fase: string;
  statusDia: "BLOQUEADO" | "DISPONIVEL" | "COMPLETO" | "PARCIAL" | "PERDIDO";
  xpGanho: number;
  estrelas: 0 | 1 | 2 | 3;
  temQuiz: boolean;
  data: string;
}
```

### ChecklistItem
```typescript
{
  id: number;
  periodo: "MANHA" | "TARDE" | "NOITE";
  ordem: number;
  descricao: string;
  concluido: boolean;
  dataMarcacao?: string;
}
```

---

## Design System (Paleta Atual)

### Cores
| Token | Hex | Uso |
|---|---|---|
| Background | `#0e0e0e` | Fundo principal |
| Surface | `#1E1E1E` | Cards |
| Surface container | `#262626` | Cards alternativos, stats |
| Primary | `#FF4757` | Botões, badges ativos, destaques |
| Primary accent | `#ff8d8c` | Gradientes, progress bars |
| Secondary | `#C2185B` | Badge de fase (Descamação) |
| Text primary | `#FFFFFF` | Títulos |
| Text secondary | `#999` | Labels, subtítulos |
| Text muted | `#adaaaa` | Texto auxiliar |
| Success | `#22c55e` | Nós completos, badge concluído |
| Warning | `#FF8C00` | Nó disponível |
| Error | `#ff7351` | Erros |
| Notification | `#FF9500` | Badge de notificação |

### Tipografia
- Título grande: 20px, bold, `#FFFFFF`
- Título seção: 18px, bold/extrabold, `#FFFFFF`
- Texto normal: 14-15px, `#FFFFFF`
- Texto secundário: 13px, `#999`
- Label: 11px, uppercase, letter-spacing 1-2, `#999`
- Estatísticas: 26px, bold

### Cards
```
backgroundColor: #1E1E1E ou #262626
borderColor: rgba(255,255,255,0.05)
borderWidth: 1
borderRadius: 12
padding: 18
```

### Bottom Navigation
```
backgroundColor: #111
borderTopColor: #222
activeColor: #FF4757
activeBackground: rgba(255,71,87,0.15)
inactiveColor: #adaaaa
4 tabs: grid | bandage | document | person
```

---

## Especificação das Telas

### Tab 1: Dashboard (`index.tsx`)
- **Header:** Avatar imagem 44×44 borderRadius 8 + "Olá, [Nome] 👋" + badge notificação `#FF9500`
- **Card ativo:** Label "TATUAGEM ATIVA" + badge fase + percentual + barra `#FF4757` + grid 2×2
- **Lembretes:** Título + "X/Y feitos" + barra fina 3px + checklist com checkboxes circulares
- **CTA:** "Adicionar nova tatuagem" com borda `rgba(255,71,87,0.3)`

### Tab 2: Recovery Progress (`caminho.tsx`)
- **Header:** Seta voltar + "RECOVERY PROGRESS" em `#ff8d8c`
- **Status card:** Glass panel com glow + "Fase 2: Cura" + progress bar gradient
- **Jornada:** Nós em zigzag (60px, border 3px) com estados: COMPLETO (verde), DISPONÍVEL (laranja pulsante), BLOQUEADO (escuro)
- **Badge HOJE:** `#FF8C00` uppercase tracking-widest

### Tab 3: Perfil (`perfil.tsx`)
- **TopBar:** Seta + "PERFIL" centralizado
- **Avatar:** 80×80 circular, bg `rgba(255,71,87,0.3)`, border `#FF4757`
- **Stats card:** 3 colunas com dividers `#2c2c2c`
- **Tatuagens:** Cards com badge ATIVO (`#FF4757`) / CONCLUÍDO (`#22c55e`)
- **Configurações:** Toggles customizados `#ff8d8c` + chevrons
- **Logout:** Texto `#FF4757`, border `#FF4757`, bg `rgba(255,71,87,0.08)`

---

## Sistema de Gamificação

### XP
| Ação | XP |
|---|---|
| Completar 1 item | +5 |
| Completar período | +30 |
| Completar 100% do dia | +100 |
| Acertar quiz | +15 |
| Streak 7 dias | +100 |
| Streak 14 dias | +200 |
| Completar cicatrização | +500 |

### Estrelas
- ⭐⭐⭐ = 100% | ⭐⭐ = 50-99% | ⭐ = 1-49%

### Fases e Cores
| Fase | Dias | Cor |
|---|---|---|
| Fase 1 | Dia 1 | `#E21B3C` |
| Fase 2 | Dias 2-7 | `#FF8C00` |
| Fase 3 | Dias 8-14 | `#FFD700` |
| Fase 4 | Dias 15-30+ | `#22c55e` |

---

## Padrões de Código

### AsyncStorage
```typescript
await AsyncStorage.setItem('@inkflow:token', token);
await AsyncStorage.setItem('@inkflow:user', JSON.stringify(user));
// Para remover: usar removeItem individual (multiRemove foi removido na v3)
await AsyncStorage.removeItem('@inkflow:token');
await AsyncStorage.removeItem('@inkflow:user');
```

### Navegação (Expo Router)
```typescript
router.push('/caminho');
router.push(`/dia/${numeroDia}`);
router.back();
router.replace('/login');
```

---

## Bugs Conhecidos

1. **AsyncStorage.multiRemove** não existe na v3+ → usar `removeItem` individual
2. **Alert.alert** não funciona na web → usar `Platform.OS === 'web' ? window.confirm() : Alert.alert()`
3. **Guard com Redirect** fora do navigator → mover proteção para dentro do `(tabs)/_layout.tsx`
4. **Redirect não reage a state changes** → usar `useEffect + router.replace()`
5. **Token não persiste** → sempre salvar no AsyncStorage, nunca só em useState

---

## Comandos Úteis

```bash
npx expo start          # Iniciar dev server
npx expo start -c       # Limpar cache e iniciar
npx expo start --web    # Rodar no browser
eas build --platform android  # Build produção
```

---

## Commits
- Branch: `main`
- Formato: prefixo em inglês + mensagem em português
- Exemplo: `feat: adiciona login real com JWT e AsyncStorage`
