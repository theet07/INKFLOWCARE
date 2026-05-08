# Prompt Limpo para Stitch.ia - Tela do Caminho

## ⚠️ IMPORTANTE: Anexar screenshots das telas existentes do app antes de enviar este prompt!

---

## Prompt para Stitch.ia:

Crie uma tela mobile de "caminho de progresso" no estilo do app nas imagens em anexo.

**Fundo:** gradiente escuro preto → azul marinho (`#000000 → #0a0a2e → #0d1b4b`)

**Header:**
- Botão voltar (seta) à esquerda
- Título "Meu Progresso" centralizado em branco
- Barra de progresso vermelha (`#FF0000`) abaixo, altura 6px
- Texto abaixo da barra: "18/30 dias" e "60% completo" em cinza (`#888`)

**Caminho em zigzag:**
- Nós circulares de 60px alternando posição horizontal: esquerda (30%) → direita (70%) → esquerda → direita
- Linha tracejada vertical fina (`rgba(255,255,255,0.1)`, 2px) conectando cada nó, altura 40px entre nós
- Espaçamento vertical de 60px entre cada nó

**Estados dos nós:**

1. **Concluído (verde):**
   - Círculo preenchido verde (`#22c55e`)
   - Ícone de check branco no centro (24px)
   - 3 estrelinhas douradas abaixo do círculo
   - Texto "+50 XP" abaixo em verde

2. **Atual/Disponível (pulsando):**
   - Círculo com borda vermelha grossa (`#FF0000`, 3px)
   - Fundo semi-transparente vermelho (`rgba(255,0,0,0.2)`)
   - Ícone play branco no centro
   - Efeito de brilho/glow vermelho ao redor
   - Animação pulsando suavemente

3. **Bloqueado (cinza):**
   - Círculo escuro (`rgba(255,255,255,0.05)`)
   - Borda fina cinza (`rgba(255,255,255,0.1)`)
   - Ícone de cadeado cinza no centro
   - Opacidade 40%
   - Sem texto de XP

4. **Parcial (amarelo):**
   - Círculo preenchido amarelo (`#FFD700`)
   - Ícone de check branco no centro
   - 1 ou 2 estrelinhas (não 3)
   - Texto "+30 XP" abaixo em amarelo

5. **Perdido (vermelho claro):**
   - Círculo escuro com borda vermelha clara (`#EF9A9A`)
   - Ícone X vermelho no centro
   - Opacidade 60%

**Informações do nó:**
- **Acima:** label pequeno "Dia 1", "Dia 2", etc. em cinza (`#888`, 12px)
- **Dentro:** ícone 24px
- **Abaixo:** estrelas (se tiver) + texto XP (11px)

**Cores por fase do tratamento:**
- Dias 1: vermelho (`#E21B3C`)
- Dias 2-7: laranja (`#FF8C00`)
- Dias 8-14: amarelo (`#FFD700`)
- Dias 15+: verde (`#22c55e`)

Use essas cores para a borda/glow do nó disponível de acordo com a fase.

**Estilo geral:**
- Dark theme consistente com as telas anexadas
- Cards com fundo `rgba(255,255,255,0.05)` e borda `rgba(255,255,255,0.1)`
- Border radius 12-16px
- Padding horizontal 22px
- Texto branco (`#FFFFFF`) e cinza (`#888888`)
- Ícones do Ionicons
- SafeAreaView para respeitar notch

**Comportamento:**
- Nós concluídos e disponível são clicáveis (feedback visual ao pressionar)
- Nós bloqueados não são clicáveis (visual desabilitado)
- ScrollView vertical para rolar o caminho

**Exemplo de sequência visual:**
```
Dia 1  ✓ (verde, 3 estrelas)
  |
Dia 2  ✓ (verde, 3 estrelas)
  |
Dia 3  ▶ (vermelho pulsando, HOJE)
  |
Dia 4  🔒 (bloqueado)
  |
Dia 5  🔒 (bloqueado)
```

Seguir EXATAMENTE o visual das telas em anexo: gradiente, espaçamentos, tipografia, cores, bordas.

---

## 📸 Screenshots para anexar:

Tire prints das seguintes telas do app:

1. **Dashboard (tela inicial)** - para ver o estilo geral, cards, cores
2. **Perfil** - para ver layout de listas e cards
3. **Login** - para ver gradiente de fundo e tipografia

---

## Após gerar no Stitch.ia:

1. Salvar código em: `app/(tabs)/caminho.tsx`
2. Adicionar imports dos hooks:
   ```typescript
   import { useCicatrizacao } from '@/hooks/useCicatrizacao';
   import { useCaminho } from '@/hooks/useCaminho';
   ```
3. Conectar dados reais substituindo mock
4. Adicionar navegação: `router.push(\`/dia/\${numeroDia}\`)`
