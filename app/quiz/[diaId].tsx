import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuiz } from '@/hooks/useQuiz';

export default function QuizScreen() {
  const router = useRouter();
  const { diaId } = useLocalSearchParams();
  const numeroDia = parseInt(diaId as string) || 7;

  const {
    perguntas, loading, respostas, respondido,
    responder, verificarResposta, enviarRespostas,
    acertos, xpGanho, todasRespondidas, totalPerguntas,
  } = useQuiz(numeroDia);

  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const pergunta = perguntas[perguntaAtual];

  if (loading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF4757" />
            <Text style={styles.loadingText}>Carregando quiz...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (respondido) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.resultContainer}>
            <View style={styles.resultIconCircle}>
              <Ionicons
                name={acertos === totalPerguntas ? 'trophy' : 'ribbon'}
                size={48}
                color={acertos === totalPerguntas ? '#FFD700' : '#FF4757'}
              />
            </View>
            <Text style={styles.resultTitle}>
              {acertos === totalPerguntas ? 'Perfeito!' : 'Quiz Concluído!'}
            </Text>
            <Text style={styles.resultScore}>{acertos}/{totalPerguntas}</Text>
            <Text style={styles.resultLabel}>RESPOSTAS CORRETAS</Text>

            <View style={styles.xpCard}>
              <Ionicons name="flash" size={24} color="#FFD700" />
              <Text style={styles.xpValue}>+{xpGanho} XP</Text>
            </View>

            <TouchableOpacity style={styles.resultBtn} onPress={() => router.back()}>
              <Text style={styles.resultBtnText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (!pergunta) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.loadingContainer}>
            <Ionicons name="help-circle-outline" size={64} color="#555" />
            <Text style={styles.emptyTitle}>Nenhum quiz disponível</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const respostaAtual = respostas[pergunta.id];
  const resultado = verificarResposta(pergunta.id);
  const jaRespondeu = respostaAtual !== undefined;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="close" size={24} color="#adaaaa" />
          </TouchableOpacity>
          {/* Progress dots */}
          <View style={styles.dotsRow}>
            {perguntas.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === perguntaAtual && styles.dotActive,
                  respostas[perguntas[i]?.id] !== undefined && styles.dotDone,
                ]}
              />
            ))}
          </View>
          <Text style={styles.headerCounter}>{perguntaAtual + 1}/{totalPerguntas}</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Pergunta */}
          <View style={styles.questionCard}>
            <View style={styles.questionIconRow}>
              <Ionicons name="bulb" size={22} color="#FFD700" />
              <Text style={styles.questionLabel}>PERGUNTA {perguntaAtual + 1}</Text>
            </View>
            <Text style={styles.questionText}>{pergunta.pergunta}</Text>
          </View>

          {/* Opções */}
          {pergunta.opcoes.map((opcao, i) => {
            const selecionada = respostaAtual === i;
            const correta = jaRespondeu && i === pergunta.respostaCorreta;
            const incorreta = jaRespondeu && selecionada && i !== pergunta.respostaCorreta;

            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.optionBtn,
                  selecionada && !jaRespondeu && styles.optionSelected,
                  correta && styles.optionCorrect,
                  incorreta && styles.optionIncorrect,
                ]}
                onPress={() => !jaRespondeu && responder(pergunta.id, i)}
                activeOpacity={jaRespondeu ? 1 : 0.7}
                disabled={jaRespondeu}
              >
                <View style={[
                  styles.optionLetter,
                  correta && styles.optionLetterCorrect,
                  incorreta && styles.optionLetterIncorrect,
                ]}>
                  <Text style={styles.optionLetterText}>
                    {String.fromCharCode(65 + i)}
                  </Text>
                </View>
                <Text style={[
                  styles.optionText,
                  correta && { color: '#22c55e' },
                  incorreta && { color: '#FF4757' },
                ]}>{opcao}</Text>
                {correta && <Ionicons name="checkmark-circle" size={22} color="#22c55e" />}
                {incorreta && <Ionicons name="close-circle" size={22} color="#FF4757" />}
              </TouchableOpacity>
            );
          })}

          {/* Explicação (após responder) */}
          {jaRespondeu && (
            <View style={styles.explanationCard}>
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <Text style={styles.explanationText}>{pergunta.explicacao}</Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom button */}
        {jaRespondeu && (
          <View style={styles.bottomBar}>
            {perguntaAtual < perguntas.length - 1 ? (
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={() => setPerguntaAtual(prev => prev + 1)}
              >
                <Text style={styles.nextBtnText}>Próxima</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.finishBtn} onPress={enviarRespostas}>
                <Text style={styles.finishBtnText}>Ver Resultado</Text>
                <Ionicons name="trophy" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  safe: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#262626',
    gap: 16,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  dotsRow: { flex: 1, flexDirection: 'row', gap: 6, justifyContent: 'center' },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#333',
  },
  dotActive: { backgroundColor: '#FF4757', width: 24 },
  dotDone: { backgroundColor: '#22c55e' },
  headerCounter: { fontSize: 13, color: '#999', fontWeight: '600' },

  // Question
  questionCard: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12, padding: 24,
    marginTop: 24, marginBottom: 24,
  },
  questionIconRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  questionLabel: { fontSize: 11, color: '#999', fontWeight: '700', letterSpacing: 1.5 },
  questionText: { fontSize: 18, fontWeight: '700', color: '#fff', lineHeight: 26 },

  // Options
  optionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#1E1E1E',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12, padding: 16, marginBottom: 10,
  },
  optionSelected: { borderColor: '#FF4757', backgroundColor: 'rgba(255,71,87,0.08)' },
  optionCorrect: { borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.08)' },
  optionIncorrect: { borderColor: '#FF4757', backgroundColor: 'rgba(255,71,87,0.08)' },
  optionLetter: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#333',
    justifyContent: 'center', alignItems: 'center',
  },
  optionLetterCorrect: { backgroundColor: '#22c55e' },
  optionLetterIncorrect: { backgroundColor: '#FF4757' },
  optionLetterText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  optionText: { flex: 1, fontSize: 15, color: '#ddd', lineHeight: 22 },

  // Explanation
  explanationCard: {
    flexDirection: 'row', gap: 12,
    backgroundColor: 'rgba(59,130,246,0.08)',
    borderWidth: 1, borderColor: 'rgba(59,130,246,0.2)',
    borderRadius: 12, padding: 16, marginTop: 8,
  },
  explanationText: { flex: 1, fontSize: 14, color: '#93c5fd', lineHeight: 22 },

  // Bottom
  bottomBar: {
    paddingHorizontal: 24, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: '#262626',
  },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#FF4757', borderRadius: 12, padding: 16,
  },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  finishBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#22c55e', borderRadius: 12, padding: 16,
  },
  finishBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },

  // Loading / Empty
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16,
  },
  loadingText: { fontSize: 14, color: '#999' },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginTop: 16 },

  // Result screen
  resultContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 32,
  },
  resultIconCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: 'rgba(255,215,0,0.15)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 24,
  },
  resultTitle: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 8 },
  resultScore: { fontSize: 48, fontWeight: '700', color: '#FF4757' },
  resultLabel: {
    fontSize: 12, color: '#999', fontWeight: '700',
    letterSpacing: 2, marginTop: 4, marginBottom: 32,
  },
  xpCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,215,0,0.2)',
    borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12,
    marginBottom: 40,
  },
  xpValue: { fontSize: 20, fontWeight: '700', color: '#FFD700' },
  resultBtn: {
    backgroundColor: '#FF4757', borderRadius: 12,
    paddingHorizontal: 48, paddingVertical: 16,
  },
  resultBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
