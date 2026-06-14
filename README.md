# 🩹 InkFlowCare — App Mobile

![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=flat-square&logo=react)
![Expo](https://img.shields.io/badge/Expo-54-000020?style=flat-square&logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![Android](https://img.shields.io/badge/Android-suportado-3DDC84?style=flat-square&logo=android)
![iOS](https://img.shields.io/badge/iOS-suportado-000000?style=flat-square&logo=apple)

O **InkFlowCare** é o aplicativo mobile da plataforma InkFlow, dedicado ao **acompanhamento pós-tatuagem** do cliente. Focado em engajamento e saúde, o app guia o usuário por todo o processo de cicatrização — dia a dia — através de checklists, quizzes, registro fotográfico e um sistema de conquistas, resolvendo um problema histórico do setor: a falta de orientação e acompanhamento do cliente após a sessão de tatuagem.

---

## 🌟 Funcionalidades e Recursos do Sistema

### 🩹 Plano de Cicatrização Dia a Dia
Cada tatuagem cadastrada gera automaticamente um plano de cuidados de **30 dias**. O cliente acompanha o progresso por um mapa visual da jornada, com cada dia desbloqueado progressivamente. O scheduler do backend atualiza o status dos dias automaticamente conforme o tempo avança.

### ✅ Checklist Diário de Cuidados
Cada dia do plano contém um checklist com os cuidados recomendados para aquela etapa da cicatrização. O cliente marca os itens concluídos e o progresso é sincronizado em tempo real com o backend.

### 🧠 Quiz Diário de Acompanhamento
Ao final de cada dia, o cliente responde um quiz rápido sobre seus sintomas e a condição da tatuagem. As respostas validam o progresso e liberam o próximo dia da jornada, garantindo que o cliente está seguindo o plano corretamente.

### 📸 Registro Fotográfico de Evolução
O cliente registra fotos diretamente da galeria ou câmera para documentar visualmente a evolução da cicatrização. O histórico fotográfico por tatuagem permite acompanhar a transformação ao longo dos dias.

### 🏆 Badges e Gamificação
Conquistas são desbloqueadas conforme o cliente atinge marcos no cuidado com a tatuagem (ex: 7 dias concluídos, plano completo). O sistema de badges incentiva a adesão ao plano e recompensa a disciplina do usuário.

### 🔔 Notificações Push
Lembretes diários automáticos para que o cliente não esqueça de realizar os cuidados do dia. Configuração gerenciada diretamente no perfil do app com sincronização das preferências no backend.

### 🔐 Autenticação com Verificação OTP
Login e cadastro com verificação de e-mail via código OTP de uso único. Token JWT persistido no `AsyncStorage` com auto-login ao reabrir o app. Em token expirado (401), o app limpa automaticamente a sessão e redireciona para o login.

### 👤 Perfil e Gestão de Conta
Visualização e edição dos dados cadastrais, foto de perfil, histórico de tatuagens cadastradas, estatísticas de progresso e alteração de senha diretamente pelo app.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|---|---|
| Framework | React Native 0.81.5 |
| Plataforma | Expo ~54.0.33 |
| Navegação | Expo Router ~6.0.23 + React Navigation Bottom Tabs 7.4 |
| Linguagem | TypeScript ~5.9 |
| HTTP | Axios 1.16 |
| Persistência | AsyncStorage 2.2 |
| Notificações | Expo Notifications ~0.32 |
| Upload de Fotos | Expo Image Picker ~17.0 |
| Animações | React Native Reanimated ~4.1 |
| Gradientes | Expo Linear Gradient ~15.0 |
| Build/Deploy | EAS Build |

---

## 🏗️ Arquitetura do Sistema

```
app/
├── (tabs)/
│   ├── index.tsx           # Home — visão geral das tatuagens
│   ├── caminho.tsx         # Jornada de cicatrização
│   ├── explore.tsx         # Dicas e conteúdo
│   └── perfil.tsx          # Perfil do usuário
├── dia/[numero].tsx        # Detalhe do dia de cicatrização
├── quiz/[diaId].tsx        # Quiz diário
├── login.tsx               # Tela de login
├── cadastro.tsx            # Tela de cadastro
├── verificacao.tsx         # Verificação OTP
├── nova-tatuagem.tsx       # Registrar nova tatuagem
└── alterar-senha.tsx       # Alterar senha

context/
├── auth.tsx                # AuthContext — JWT + AsyncStorage
└── AlertContext.tsx        # Alertas globais

hooks/
├── useCicatrizacao.ts      # Plano de cicatrização
├── useChecklist.ts         # Checklist diário
├── useBadges.ts            # Sistema de conquistas
├── useCaminho.ts           # Progresso da jornada
├── useFotos.ts             # Fotos de evolução
├── useQuiz.ts              # Quiz diário
├── useEstatisticas.ts      # Estatísticas de progresso
└── useNotifications.ts     # Notificações push

services/
└── api.ts                  # Axios com interceptors JWT automáticos
```

---

## 📡 Endpoints Consumidos

| Recurso | Método | Rota |
|---|---|---|
| Login | POST | `/auth/login` |
| Cadastro | POST | `/clientes` |
| Verificação OTP | POST | `/clientes/verificar-codigo` |
| Minha Conta | GET | `/clientes/minha-conta` |
| Cicatrizações | GET/POST | `/cicatrizacao` |
| Checklist | GET/PATCH | `/cicatrizacao/:id/checklist` |
| Quiz | GET/POST | `/quiz/:diaId` |
| Fotos | GET/POST | `/cicatrizacao/:id/fotos` |
| Badges | GET | `/badges/usuario` |
| Estatísticas | GET | `/estatisticas` |
| Dicas | GET | `/dicas` |
| Notificações | GET/PUT | `/notificacoes/preferencias` |

---

## ▶️ Como Executar

### Pré-requisitos

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- App **Expo Go** no celular ou emulador configurado

### Localmente

```bash
git clone <url-do-repo>
cd INKFLOWCARE
npm install
npx expo start
```

Escaneie o QR Code com o Expo Go ou pressione `a` para Android / `i` para iOS.

### Build para Produção (EAS)

```bash
npm install -g eas-cli
eas login
eas build --platform android
eas build --platform ios
```

---

## ⚙️ Configuração do App

| Propriedade | Valor |
|---|---|
| Nome | InkFlowCare |
| Package Android | `com.theets07.INKAPP` |
| Orientação | Portrait |
| Tema | Automático (claro/escuro) |
| Nova Arquitetura | Habilitada |
| EAS Project ID | `b0be5592-b2fb-4d44-900a-4b9fb27b593f` |

---

## 👤 Autores

**Matheus**

---

## 📄 Licença

Copyright © 2025 InkFlow. Todos os direitos reservados.

Este software e seu código-fonte são propriedade exclusiva dos autores. É proibida a reprodução, distribuição, modificação ou uso comercial, total ou parcial, sem autorização expressa por escrito dos autores.
