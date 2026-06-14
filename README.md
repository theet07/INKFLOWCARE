# InkFlowCare — Mobile

Aplicativo móvel da plataforma **InkFlow**, focado em **cuidados pós-tatuagem**. Permite que clientes acompanhem o processo de cicatrização dia a dia, façam quizzes de progresso, registrem fotos de evolução e ganhem badges por cuidar bem da tatuagem.

---

## Tecnologias

| Tecnologia | Versão |
|---|---|
| React Native | 0.81.5 |
| Expo | ~54.0.33 |
| Expo Router | ~6.0.23 |
| TypeScript | ~5.9.2 |
| React | 19.1.0 |
| Axios | 1.16.0 |
| AsyncStorage | 2.2.0 |
| Expo Notifications | ~0.32.17 |
| Expo Image Picker | ~17.0.11 |
| Expo Linear Gradient | ~15.0.8 |
| React Native Reanimated | ~4.1.1 |
| React Navigation (Bottom Tabs) | 7.4.0 |

---

## Estrutura do Projeto

```
app/
├── (tabs)/
│   ├── _layout.tsx         # Configuração das tabs
│   ├── index.tsx           # Home — visão geral das tatuagens
│   ├── caminho.tsx         # Caminho de cicatrização (jornada)
│   ├── explore.tsx         # Explorar dicas e conteúdo
│   └── perfil.tsx          # Perfil do usuário
├── dia/
│   └── [numero].tsx        # Detalhe do dia de cicatrização
├── quiz/
│   └── [diaId].tsx         # Quiz diário do dia
├── index.tsx               # Splash / animação de entrada
├── login.tsx               # Tela de login
├── cadastro.tsx            # Tela de cadastro
├── verificacao.tsx         # Verificação de e-mail (OTP)
├── nova-tatuagem.tsx       # Registrar nova tatuagem
├── alterar-senha.tsx       # Alterar senha
├── ajuda.tsx               # Central de ajuda
├── privacidade.tsx         # Política de privacidade
└── _layout.tsx             # Layout raiz (providers globais)

context/
├── auth.tsx                # AuthContext — autenticação JWT
└── AlertContext.tsx        # Alertas globais na aplicação

hooks/
├── useCicatrizacao.ts      # Lógica do plano de cicatrização
├── useChecklist.ts         # Checklist diário de cuidados
├── useBadges.ts            # Sistema de badges/conquistas
├── useCaminho.ts           # Progresso na jornada
├── useFotos.ts             # Upload e listagem de fotos de evolução
├── useQuiz.ts              # Lógica do quiz diário
├── useEstatisticas.ts      # Estatísticas de progresso
├── useNotifications.ts     # Configuração de notificações push
├── use-color-scheme.ts     # Detecção de tema (claro/escuro)
└── use-theme-color.ts      # Cores baseadas no tema ativo

services/
└── api.ts                  # Instância Axios configurada com JWT

constants/
└── theme.ts                # Paleta de cores e tokens de design

assets/
└── images/                 # Ícones e imagens do app
```

---

## Funcionalidades

### Autenticação
- Login e cadastro com verificação de e-mail via **OTP**
- Token JWT persistido no **AsyncStorage** (`@inkflow:token`)
- Auto-login ao abrir o app se token válido existir
- Logout limpa token e dados do usuário do storage

### Cicatrização
- Plano de cuidados **dia a dia** (30 dias) gerado a partir da data da tatuagem
- Checklist diário de cuidados a serem marcados
- Quiz diário para verificar o progresso e liberar o próximo dia
- Visualização do status de cada dia (pendente, em andamento, concluído)

### Fotos de Evolução
- Upload de fotos diretamente da galeria ou câmera via `expo-image-picker`
- Histórico fotográfico por tatuagem
- Comparação visual do progresso

### Badges e Gamificação
- Conquistas desbloqueadas ao completar marcos (ex: 7 dias, 30 dias)
- Listagem de badges obtidos no perfil

### Notificações Push
- Lembretes diários para realizar os cuidados
- Configuração gerenciada pelo `useNotifications` com `expo-notifications`

### Perfil
- Visualização e edição dos dados da conta
- Histórico de tatuagens cadastradas
- Estatísticas de progresso (`useEstatisticas`)

---

## Autenticação — Fluxo Técnico

`context/auth.tsx` expõe o `AuthProvider` e o hook `useAuth`:

```ts
const { logado, user, loading, login, logout, authenticate } = useAuth();
```

- `login(email, senha)` — faz POST em `/auth/login`, salva token e user no AsyncStorage
- `logout()` — remove token e user, reseta estado
- `authenticate(token, userData)` — usado no cadastro para logar direto após verificação OTP
- Interceptor no Axios injeta `Authorization: Bearer <token>` automaticamente
- Em erro 401, o interceptor limpa o storage (token expirado)

---

## API

Toda comunicação com o backend é feita via `services/api.ts`:

```ts
baseURL: 'https://inkflowbackend-4w1g.onrender.com/api'
timeout: 15000ms
```

Endpoints utilizados:

| Recurso | Método | Rota |
|---|---|---|
| Login | POST | `/auth/login` |
| Cadastro | POST | `/clientes` |
| Solicitar OTP | POST | `/clientes/solicitar-codigo` |
| Verificar OTP | POST | `/clientes/verificar-codigo` |
| Minha conta | GET | `/clientes/minha-conta` |
| Cicatrizações | GET/POST | `/cicatrizacao` |
| Checklist | GET/PATCH | `/cicatrizacao/:id/checklist` |
| Quiz | GET/POST | `/quiz/:diaId` |
| Fotos | GET/POST | `/cicatrizacao/:id/fotos` |
| Badges | GET | `/badges/usuario` |
| Estatísticas | GET | `/estatisticas` |
| Dicas | GET | `/dicas` |
| Notificações | GET/PUT | `/notificacoes/preferencias` |

---

## Configuração do App

Definida em `app.json`:

| Propriedade | Valor |
|---|---|
| Nome | InkFlowCare |
| Slug | INKAPP |
| Package Android | `com.theets07.INKAPP` |
| Orientação | Portrait |
| Tema | Automático (claro/escuro) |
| Nova Arquitetura | Habilitada |
| EAS Project ID | `b0be5592-b2fb-4d44-900a-4b9fb27b593f` |

---

## Como Executar

### Pré-requisitos

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- App **Expo Go** no celular ou emulador Android/iOS configurado

### Passos

```bash
# Clonar o repositório
git clone <url-do-repo>
cd INKFLOWCARE

# Instalar dependências
npm install

# Iniciar o projeto
npx expo start
```

Escaneie o QR Code com o Expo Go ou pressione `a` para Android / `i` para iOS.

### Plataformas

```bash
npx expo start --android
npx expo start --ios
npx expo start --web
```

---

## Build para Produção (EAS Build)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login na conta Expo
eas login

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios
```

Configuração em `eas.json`.

---

## Tema e Design

O `constants/theme.ts` centraliza a paleta de cores do app:

- Background principal: `#0e0e0e` (dark)
- Splash screen com fundo `#0e0e0e` e logo branca

O app suporta tema claro e escuro automaticamente via `use-color-scheme.ts`.

---

## Licença

Distribuído sob a licença presente no arquivo [LICENSE](./LICENSE).
