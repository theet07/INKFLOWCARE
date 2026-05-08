# Prompt para Stitch.ia - Tela do Caminho Duolingo

## Contexto
App React Native + Expo de acompanhamento de cicatrização de tatuagem. Preciso de uma tela que mostre o caminho de progresso estilo Duolingo.

## Dados Disponíveis

### Hook useCaminho
```typescript
import { useCaminho } from '@/hooks/useCaminho';
import { useCicatrizacao } from '@/hooks/useCicatrizacao';

const { cicatrizacao } = useCicatrizacao();
const { caminho, loading } = useCaminho(cicatrizacao?.id || null);

// caminho é um array de CheckpointDia[]
```

### Tipo CheckpointDia
```typescript
{
  id: number;
  numeroDia: number;
  fase: 'FASE_1_PRIMEIRAS_24H' | 'FASE_2_INICIAL' | 'FASE_3_DESCAMACAO' | 'FASE_4_PROFUNDA';
  statusDia: 'BLOQUEADO' | 'DISPONIVEL' | 'COMPLETO' | 'PARCIAL' | 'PERDIDO';
  xpGanho: number;
  estrelas: 0 | 1 | 2 | 3;
  temQuiz: boolean;
  data: string; // ISO date
}
```

## Layout Desejado

### Estrutura
- **ScrollView vertical** com padding horizontal 22px
- **Nós dispostos em zigzag**: alternando esquerda (30%) → centro → direita (70%)
- **Linha conectando os nós**: linha tracejada cinza entre cada nó
- **Header fixo**: Mostra progresso geral (dias completos / total dias)

### Nó Visual (Checkpoint)

#### Tamanho e Forma
- Círculo de **60px** de diâmetro
- Border de **3px**
- Shadow com glow colorido (baseado na fase)

#### Estados Visuais

**BLOQUEADO** 🔒
- Background: `rgba(255,255,255,0.05)`
- Border: `rgba(255,255,255,0.1)`
- Ícone: `lock-closed` (Ionicons) cinza
- Opacidade: 0.4

**DISPONIVEL** ✨ (dia atual)
- Background: cor da fase com opacidade 0.2
- Border: cor da fase
- Ícone: `play-circle` (Ionicons) cor da fase
- Animação: **pulsando** (scale 1.0 → 1.1 → 1.0, 2s loop)
- Glow: shadow com cor da fase

**COMPLETO** ⭐⭐⭐
- Background: `#22c55e` (verde)
- Border: `#22c55e`
- Ícone: `checkmark-circle` (Ionicons) branco
- Estrelas: mostrar abaixo do nó (⭐ x quantidade)

**PARCIAL** ⭐
- Background: `#FFD700` (amarelo)
- Border: `#FFD700`
- Ícone: `checkmark-circle` (Ionicons) branco
- Estrelas: mostrar abaixo do nó (⭐ x quantidade)

**PERDIDO** ⚠️
- Background: `rgba(255,255,255,0.05)`
- Border: `#EF9A9A` (vermelho claro)
- Ícone: `close-circle` (Ionicons) vermelho
- Opacidade: 0.6

### Cores por Fase

```typescript
const coresFase = {
  FASE_1_PRIMEIRAS_24H: '#E21B3C', // Vermelho
  FASE_2_INICIAL: '#FF8C00',       // Laranja
  FASE_3_DESCAMACAO: '#FFD700',    // Amarelo
  FASE_4_PROFUNDA: '#22c55e',      // Verde
};
```

### Informações do Nó

**Acima do círculo:**
- Número do dia: `Dia ${numeroDia}` (fonte 12px, cor #888)

**Dentro do círculo:**
- Ícone baseado no status (24px)

**Abaixo do círculo:**
- Estrelas (se COMPLETO ou PARCIAL): ⭐ repetido
- XP ganho (se > 0): `+${xpGanho} XP` (fonte 11px, cor da fase)

### Linha Conectora
- Linha vertical tracejada entre nós
- Cor: `rgba(255,255,255,0.1)`
- Altura: 40px entre nós
- Largura: 2px

### Header da Tela

```
┌─────────────────────────────────┐
│  ← Voltar    Meu Progresso      │
│                                  │
│  ████████░░░░░░░░░░  18/30 dias │
│  60% completo                    │
└─────────────────────────────────┘
```

- Botão voltar (Ionicons `arrow-back`)
- Barra de progresso horizontal
- Texto: `${diasCompletos}/${totalDias} dias`
- Percentual: `${Math.round(progresso * 100)}% completo`

## Tema e Estilo

### Referência de Estilo (baseado no Dashboard)

**Gradiente de fundo:**
```typescript
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient colors={['#000000', '#0a0a2e', '#0d1b4b']} style={{ flex: 1 }}>
```

**Cores do tema:**
```typescript
const theme = {
  background: ['#000000', '#0a0a2e', '#0d1b4b'], // gradiente
  text: '#FFFFFF',
  textSecondary: '#888888',
  primary: '#FF0000',
  cardBg: 'rgba(255,255,255,0.05)',
  cardBorder: 'rgba(255,255,255,0.1)',
  success: '#22c55e',
  warning: '#FFD700',
  error: '#EF9A9A',
};
```

**Padrão de Cards:**
```typescript
card: {
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.1)',
  borderRadius: 16,
  padding: 18,
}
```

**Tipografia:**
```typescript
title: { fontSize: 18, fontWeight: '700', color: '#fff' }
subtitle: { fontSize: 13, color: '#888' }
label: { fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }
```

**Espaçamento:**
```typescript
paddingHorizontal: 22
marginBottom: 28 (entre seções)
gap: 8-12 (entre itens)
```

### Componentes Expo
```typescript
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
```

### Navegação
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Ao clicar no nó DISPONIVEL ou COMPLETO/PARCIAL
router.push(`/dia/${checkpoint.numeroDia}`);
```

## Comportamento

### Interação com Nós

**BLOQUEADO**: Não clicável (opacity 0.4)

**DISPONIVEL**: 
- Clicável
- Ao clicar: navega para `/dia/${numeroDia}`
- Feedback visual: scale down 0.95 ao pressionar

**COMPLETO/PARCIAL**: 
- Clicável (para revisar)
- Ao clicar: navega para `/dia/${numeroDia}`

**PERDIDO**: 
- Clicável
- Ao clicar: Alert explicando que o dia foi perdido

### Loading State
```typescript
{loading ? (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#FF0000" />
    <Text style={{ color: '#888', marginTop: 12 }}>Carregando caminho...</Text>
  </View>
) : (
  // Renderizar caminho
)}
```

### Empty State
```typescript
{caminho.length === 0 && !loading && (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
    <Ionicons name="map-outline" size={64} color="#555" />
    <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600', marginTop: 16 }}>
      Nenhum caminho disponível
    </Text>
    <Text style={{ color: '#888', fontSize: 14, marginTop: 8, textAlign: 'center' }}>
      Inicie uma cicatrização para ver seu progresso
    </Text>
  </View>
)}
```

## Animação do Nó Disponível

```typescript
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

// Dentro do componente do nó DISPONIVEL
const scaleAnim = useRef(new Animated.Value(1)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);

// No style do nó
<Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
  {/* conteúdo do nó */}
</Animated.View>
```

## Exemplo de Estrutura do Arquivo

```typescript
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCicatrizacao } from '@/hooks/useCicatrizacao';
import { useCaminho } from '@/hooks/useCaminho';

export default function CaminhoScreen() {
  const router = useRouter();
  const { cicatrizacao } = useCicatrizacao();
  const { caminho, loading } = useCaminho(cicatrizacao?.id || null);

  // Lógica aqui

  return (
    <LinearGradient colors={['#000000', '#0a0a2e', '#0d1b4b']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        {/* ScrollView com nós */}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // Estilos aqui
});
```

## Referência Visual

Arquivo de referência para estilo: `app/(tabs)/index.tsx`

## Localização do Arquivo

Criar em: `app/(tabs)/caminho.tsx`

---

## Prompt Resumido para Stitch.ia

```
Crie uma tela React Native + Expo de caminho Duolingo para app de cicatrização de tatuagem.

DADOS:
- Hook useCaminho(cicatrizacaoId) retorna { caminho: CheckpointDia[], loading }
- Hook useCicatrizacao() retorna { cicatrizacao, loading }
- CheckpointDia: { numeroDia, fase, statusDia, xpGanho, estrelas, temQuiz }
- statusDia: BLOQUEADO | DISPONIVEL | COMPLETO | PARCIAL | PERDIDO

LAYOUT:
- ScrollView vertical com nós em zigzag (esquerda 30% → direita 70% alternando)
- Nós circulares 60px com ícones Ionicons
- Linha tracejada vertical (2px, rgba(255,255,255,0.1)) conectando nós (40px entre eles)
- Header fixo com botão voltar e barra de progresso

ESTADOS VISUAIS DOS NÓS:
- BLOQUEADO: background rgba(255,255,255,0.05), border rgba(255,255,255,0.1), ícone lock-closed cinza, opacity 0.4, NÃO clicável
- DISPONIVEL: background cor da fase com opacity 0.2, border cor da fase, ícone play-circle, ANIMAÇÃO pulsando (scale 1.0→1.1→1.0, 2s loop), shadow com glow da cor da fase
- COMPLETO: background #22c55e, border #22c55e, ícone checkmark-circle branco, estrelas abaixo (⭐ x quantidade)
- PARCIAL: background #FFD700, border #FFD700, ícone checkmark-circle branco, estrelas abaixo (⭐ x quantidade)
- PERDIDO: background rgba(255,255,255,0.05), border #EF9A9A, ícone close-circle vermelho, opacity 0.6

CORES POR FASE:
- FASE_1_PRIMEIRAS_24H: #E21B3C (vermelho)
- FASE_2_INICIAL: #FF8C00 (laranja)
- FASE_3_DESCAMACAO: #FFD700 (amarelo)
- FASE_4_PROFUNDA: #22c55e (verde)

INFORMAÇÕES DO NÓ:
- Acima: "Dia ${numeroDia}" (12px, #888)
- Dentro: Ícone 24px
- Abaixo: Estrelas (se tiver) + "+${xpGanho} XP" (11px, cor da fase)

TEMA (seguir padrão do Dashboard):
- Background: LinearGradient(['#000000', '#0a0a2e', '#0d1b4b'])
- Cards: backgroundColor rgba(255,255,255,0.05), borderColor rgba(255,255,255,0.1), borderRadius 16
- Texto: #FFFFFF / #888888
- Padding horizontal: 22px
- Border radius: 12-16px

HEADER:
- Botão voltar (arrow-back) à esquerda
- Título "Meu Progresso" centralizado
- Barra de progresso horizontal (altura 6px, background rgba(255,255,255,0.1), fill #FF0000)
- Texto: "${diasCompletos}/${totalDias} dias" e "${percentual}% completo"

NAVEGAÇÃO:
- Clicar em nó DISPONIVEL/COMPLETO/PARCIAL: router.push(`/dia/${numeroDia}`)
- Clicar em nó PERDIDO: Alert explicando que o dia foi perdido
- Botão voltar: router.back()
- Feedback ao pressionar: scale 0.95

LOADING STATE:
- ActivityIndicator size="large" color="#FF0000"
- Texto "Carregando caminho..." (#888, 12px)

EMPTY STATE:
- Ícone map-outline 64px (#555)
- Título "Nenhum caminho disponível" (18px, #fff, bold)
- Subtítulo "Inicie uma cicatrização para ver seu progresso" (14px, #888)

COMPONENTES:
- LinearGradient (expo-linear-gradient)
- Ionicons (@expo/vector-icons)
- SafeAreaView (react-native-safe-area-context)
- useRouter (expo-router)
- Animated (react-native) para animação do nó DISPONIVEL

ARQUIVO: app/(tabs)/caminho.tsx

IMPORTANTE: 
- Nó DISPONIVEL deve ter animação pulsando usando Animated.loop
- Zigzag: índice par = esquerda (marginLeft: '10%'), índice ímpar = direita (marginLeft: '60%')
- Linha conectora entre cada nó (exceto o último)
```
