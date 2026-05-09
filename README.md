# 📚 InkFlowCare - Documentação Consolidada

Bem-vindo à documentação do projeto InkFlowCare Mobile & Backend!
Este documento serve como o único ponto de entrada para todas as informações técnicas e de arquitetura do projeto.

---

## ⚠️ LEITURA OBRIGATÓRIA DAS 3 PASTAS PRINCIPAIS

**ANTES DE INICIAR QUALQUER DESENVOLVIMENTO, VOCÊ DEVE LER AS 3 PASTAS PRINCIPAIS DO PROJETO:**

1. 📱 **`INKFLOWCARE`** (c:\Users\DMJ\OneDrive\Documentos\INKFLOWCARE)
   - Mobile App (React Native + Expo 54)
   - Leia: `docs/*.md`, `context/auth.tsx`, `services/api.ts`, `hooks/*.ts`

2. ⚙️ **`INKFLOWBACKEND`** (c:\Users\DMJ\OneDrive\Documentos\INKFLOWBACKEND)
   - Backend API (Spring Boot + SQL Server)
   - Leia: `CLAUDE.md`, `pom.xml`, `src/main/resources/application.properties`

3. 🌐 **`INKFLOWFRONTEND-LIMPO`** (c:\Users\DMJ\OneDrive\Documentos\INKFLOWFRONTEND-LIMPO)
   - Frontend Web (React + Vite)
   - Leia: `CLAUDE.md`, `package.json`, `src/pages/*.jsx`

**Esta leitura é OBRIGATÓRIA para entender:**
- Arquitetura completa do sistema (Mobile + Web + Backend)
- Endpoints da API e contratos de dados
- Fluxos de autenticação e autorização
- Estrutura de dados e modelos
- Padrões de código e convenções

---

## 🧭 NAVEGAÇÃO RÁPIDA

Aqui estão os 6 arquivos principais que você precisa conhecer:

1. **[STATUS_CONSOLIDADO.md](docs/STATUS_CONSOLIDADO.md)**
   Status real atualizado do que está funcionando e o que falta no backend e mobile.
   *Sempre consulte este arquivo antes de iniciar qualquer desenvolvimento.*

2. **[PLANO_OTIMIZACAO.md](docs/PLANO_OTIMIZACAO.md)**
   Plano de execução passo a passo focado em melhorar o desempenho do sistema, sem estimativas de tempo, com foco nas integrações críticas.

3. **[API_ENDPOINTS.md](docs/API_ENDPOINTS.md)**
   Documentação técnica completa de todos os endpoints REST (Request/Response, estruturas DTO, métodos).

4. **[SPRING_BOOT_IMPLEMENTATION.md](docs/SPRING_BOOT_IMPLEMENTATION.md)**
   Código Java de referência para implementação no backend (Entities, Repositories, Services, Controllers).

5. **[FLUXO_DE_DADOS.md](docs/FLUXO_DE_DADOS.md)**
   Diagramas visuais de como os dados fluem entre o App Mobile e o Backend.

6. **[DOCS.md](docs/DOCS.md)**
   Documentação técnica completa do projeto mobile (arquitetura, pastas, hooks, navegação).

---

## 🎯 RESUMO DO PROJETO

- **Backend URL**: `https://inkflowbackend-4w1g.onrender.com/api`
- **Autenticação**: JWT (Válido por 24h)
- **Credenciais de Teste**: `cat@gmail.com` / `cat`


---

## 📊 ESTRUTURA DA DOCUMENTAÇÃO

```
docs/
├── STATUS_CONSOLIDADO.md ............... Status atual real
├── PLANO_OTIMIZACAO.md ................. Análise de performance e plano de ação
├── API_ENDPOINTS.md .................... Documentação de endpoints
├── SPRING_BOOT_IMPLEMENTATION.md ....... Código Java de referência
├── FLUXO_DE_DADOS.md ................... Diagramas visuais de fluxo
├── DOCS.md ............................. Documentação técnica mobile
├── GUIA_RAPIDO.md ...................... Referência rápida e checklist unificado
└── SEED_DATA_POSTGRESQL.sql ............ Dados iniciais para popular o banco
```

> **Nota:** Arquivos antigos ou redundantes foram movidos para a pasta `archive/` para manter a documentação limpa.
