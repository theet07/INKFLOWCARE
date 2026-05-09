import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCicatrizacao } from '@/hooks/useCicatrizacao';
import { useChecklist } from '@/hooks/useChecklist';
import { useFotos } from '@/hooks/useFotos';
import api from '@/services/api';

const periodoNomes: Record<string, string> = {
  MANHA: 'Manhã',
  TARDE: 'Tarde',
  NOITE: 'Noite',
};

const periodoIcones: Record<string, any> = {
  MANHA: 'sunny',
  TARDE: 'partly-sunny',
  NOITE: 'moon',
};

// Dicas por fase
const dicasPorFase: Record<string, { icone: string; cor: string; texto: string }[]> = {
  FASE_1_PRIMEIRAS_24H: [
    { icone: 'bandage-outline', cor: '#FF4757', texto: 'Mantenha o curativo por 2-4 horas após a sessão' },
    { icone: 'water-outline', cor: '#3B82F6', texto: 'Lave com água morna e sabão neutro' },
    { icone: 'hand-left-outline', cor: '#FF8C00', texto: 'Não toque na tatuagem com as mãos sujas' },
    { icone: 'bed-outline', cor: '#8B5CF6', texto: 'Durma com roupa leve e folgada' },
  ],
  FASE_2_INICIAL: [
    { icone: 'water-outline', cor: '#3B82F6', texto: 'Lave a tatuagem 2-3x ao dia com sabão neutro' },
    { icone: 'color-fill-outline', cor: '#22c55e', texto: 'Aplique pomada cicatrizante em camada fina' },
    { icone: 'sunny-outline', cor: '#FFD700', texto: 'Evite exposição direta ao sol' },
    { icone: 'shirt-outline', cor: '#FF8C00', texto: 'Use roupas de algodão sobre a região' },
  ],
  FASE_3_DESCAMACAO: [
    { icone: 'alert-circle-outline', cor: '#FF4757', texto: 'NÃO arranque as casquinhas! Deixe cair naturalmente' },
    { icone: 'color-fill-outline', cor: '#22c55e', texto: 'Hidrate bastante — a pele está se renovando' },
    { icone: 'fitness-outline', cor: '#FF8C00', texto: 'Evite exercícios intensos que causem atrito' },
    { icone: 'water-outline', cor: '#3B82F6', texto: 'Não mergulhe em piscinas ou mar' },
  ],
  FASE_4_PROFUNDA: [
    { icone: 'sunny-outline', cor: '#FFD700', texto: 'Use protetor solar FPS 50+ sempre que expor' },
    { icone: 'color-fill-outline', cor: '#22c55e', texto: 'Continue hidratando diariamente' },
    { icone: 'checkmark-circle-outline', cor: '#3B82F6', texto: 'A cicatrização profunda continua por semanas' },
    { icone: 'star-outline', cor: '#8B5CF6', texto: 'Sua tatuagem está quase 100% curada!' },
  ],
};


export default function DiaScreen() {
  const router = useRouter();
  const { numero } = useLocalSearchParams();
  const numeroDia = parseInt(numero as string) || 18;

  const { cicatrizacao, loading: cicLoading } = useCicatrizacao();
  const { checklist, loading: checklistLoading, toggleItem } = useChecklist(
    cicatrizacao?.id || null,
    numeroDia
  );
  const { pickAndUpload, uploading } = useFotos(cicatrizacao?.id);

  // Dicas do backend
  const [dicasBackend, setDicasBackend] = useState<{titulo: string; descricao: string; icone: string}[]>([]);
  useEffect(() => {
    api.get(`/dicas/dia/${numeroDia}`)
      .then(res => { if (res.data?.length > 0) setDicasBackend(res.data); })
      .catch(() => {});
  }, [numeroDia]);

  const loading = cicLoading || checklistLoading;
  const semCicatrizacao = !cicatrizacao && !cicLoading;

  // Agrupar checklist por período
  const checklistPorPeriodo = {
    MANHA: checklist.filter(item => item.periodo === 'MANHA').sort((a, b) => a.ordem - b.ordem),
    TARDE: checklist.filter(item => item.periodo === 'TARDE').sort((a, b) => a.ordem - b.ordem),
    NOITE: checklist.filter(item => item.periodo === 'NOITE').sort((a, b) => a.ordem - b.ordem),
  };

  const totalItens = checklist.length;
  const itensConcluidos = checklist.filter((item: any) => item.concluido).length;
  const progresso = totalItens > 0 ? (itensConcluidos / totalItens) * 100 : 0;

  // Dicas do backend apenas
  const dicas = dicasBackend.map(d => ({
    icone: d.icone || 'information-circle-outline',
    cor: '#3B82F6',
    texto: d.descricao,
  }));

  const temQuiz = [7, 14, 21, 28].includes(numeroDia);

  // XP e estrelas baseado no progresso
  const estrelas = progresso >= 100 ? 3 : progresso >= 50 ? 2 : progresso > 0 ? 1 : 0;
  const xpGanho = Math.round(progresso * 2);

  async function handleToggle(itemId: number) {
    await toggleItem(itemId);
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#adaaaa" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>DIA {numeroDia}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* Card de Resumo */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              {/* XP */}
              <View style={styles.summaryItem}>
                <View style={[styles.summaryIconCircle, { backgroundColor: 'rgba(255,71,87,0.15)' }]}>
                  <Ionicons name="flash" size={20} color="#FF4757" />
                </View>
                <Text style={styles.summaryValue}>{xpGanho}</Text>
                <Text style={styles.summaryLabel}>XP GANHO</Text>
              </View>

              {/* Estrelas */}
              <View style={styles.summaryItem}>
                <View style={[styles.summaryIconCircle, { backgroundColor: 'rgba(255,215,0,0.15)' }]}>
                  <Ionicons name="star" size={20} color="#FFD700" />
                </View>
                <View style={styles.starsRow}>
                  {[1, 2, 3].map(i => (
                    <Ionicons
                      key={i}
                      name="star"
                      size={16}
                      color={i <= estrelas ? '#FFD700' : '#333'}
                    />
                  ))}
                </View>
                <Text style={styles.summaryLabel}>ESTRELAS</Text>
              </View>

              {/* Status */}
              <View style={styles.summaryItem}>
                <View style={[styles.summaryIconCircle, {
                  backgroundColor: progresso >= 100
                    ? 'rgba(34,197,94,0.15)'
                    : progresso > 0
                      ? 'rgba(255,140,0,0.15)'
                      : 'rgba(255,255,255,0.05)'
                }]}>
                  <Ionicons
                    name={progresso >= 100 ? 'checkmark-circle' : progresso > 0 ? 'time' : 'hourglass'}
                    size={20}
                    color={progresso >= 100 ? '#22c55e' : progresso > 0 ? '#FF8C00' : '#555'}
                  />
                </View>
                <Text style={[styles.summaryValue, {
                  color: progresso >= 100 ? '#22c55e' : progresso > 0 ? '#FF8C00' : '#555',
                  fontSize: 12,
                }]}>
                  {progresso >= 100 ? 'COMPLETO' : progresso > 0 ? 'EM ANDAMENTO' : 'PENDENTE'}
                </Text>
                <Text style={styles.summaryLabel}>STATUS</Text>
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>PROGRESSO DO DIA</Text>
              <Text style={styles.progressPercent}>{Math.round(progresso)}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${progresso}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {itensConcluidos}/{totalItens} tarefas concluídas
            </Text>
          </View>

          {/* Checklist */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF4757" />
              <Text style={styles.loadingText}>Carregando checklist...</Text>
            </View>
          ) : semCicatrizacao ? (
            <View style={styles.emptyState}>
              <Ionicons name="bandage-outline" size={48} color="#555" />
              <Text style={styles.emptyTitle}>Sem cicatrização ativa</Text>
              <Text style={styles.emptyText}>Agende uma sessão para iniciar o acompanhamento dos seus cuidados.</Text>
            </View>
          ) : checklist.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-done-outline" size={48} color="#555" />
              <Text style={styles.emptyTitle}>Sem tarefas para este dia</Text>
              <Text style={styles.emptyText}>Confira as dicas abaixo para manter sua tatuagem saudável.</Text>
            </View>
          ) : (
            <>
              {/* Manhã */}
              {checklistPorPeriodo.MANHA.length > 0 && (
                <PeriodoSection
                  periodo="MANHA"
                  itens={checklistPorPeriodo.MANHA}
                  onToggle={handleToggle}
                />
              )}

              {/* Tarde */}
              {checklistPorPeriodo.TARDE.length > 0 && (
                <PeriodoSection
                  periodo="TARDE"
                  itens={checklistPorPeriodo.TARDE}
                  onToggle={handleToggle}
                />
              )}

              {/* Noite */}
              {checklistPorPeriodo.NOITE.length > 0 && (
                <PeriodoSection
                  periodo="NOITE"
                  itens={checklistPorPeriodo.NOITE}
                  onToggle={handleToggle}
                />
              )}
            </>
          )}

          {/* Dicas do Dia */}
          <View style={styles.dicasSection}>
            <View style={styles.dicasHeader}>
              <Ionicons name="bulb-outline" size={20} color="#FFD700" />
              <Text style={styles.dicasTitle}>Dicas do Dia</Text>
            </View>
            <View style={styles.dicasContainer}>
              {dicas.map((dica, index) => (
                <View key={index} style={styles.dicaItem}>
                  <View style={[styles.dicaIconCircle, { backgroundColor: `${dica.cor}20` }]}>
                    <Ionicons name={dica.icone as any} size={18} color={dica.cor} />
                  </View>
                  <Text style={styles.dicaText}>{dica.texto}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Ações */}
          <View style={styles.actionsRow}>
            {temQuiz && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => router.push(`/quiz/${numeroDia}` as any)}
              >
                <Ionicons name="school-outline" size={20} color="#FFD700" />
                <Text style={styles.actionBtnText}>Quiz do Dia</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionBtn, uploading && { opacity: 0.5 }]}
              disabled={uploading}
              onPress={async () => {
                const ok = await pickAndUpload(numeroDia, `Dia ${numeroDia}`);
                if (ok) Alert.alert('Foto salva!', 'Sua foto de evolução foi registrada.');
              }}
            >
              <Ionicons name="camera-outline" size={20} color="#3B82F6" />
              <Text style={styles.actionBtnText}>{uploading ? 'Enviando...' : 'Adicionar Foto'}</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// Componente de Seção por Período
function PeriodoSection({ periodo, itens, onToggle }: any) {
  const concluidos = itens.filter((i: any) => i.concluido).length;
  const total = itens.length;

  return (
    <View style={styles.periodoSection}>
      <View style={styles.periodoHeader}>
        <View style={styles.periodoTitleRow}>
          <Ionicons name={periodoIcones[periodo]} size={20} color="#ff8d8c" />
          <Text style={styles.periodoTitle}>{periodoNomes[periodo]}</Text>
        </View>
        <Text style={styles.periodoCounter}>{concluidos}/{total}</Text>
      </View>

      <View style={styles.periodoCard}>
        {itens.map((item: any, index: number) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.checklistItem,
              index < itens.length - 1 && styles.checklistItemBorder,
            ]}
            onPress={() => onToggle(item.id)}
            activeOpacity={0.7}
          >
            {item.concluido ? (
              <View style={styles.checkboxChecked}>
                <Ionicons name="checkmark" size={16} color="#fff" />
              </View>
            ) : (
              <View style={styles.checkboxUnchecked} />
            )}
            <Text style={[styles.checklistText, item.concluido && styles.checklistTextDone]}>
              {item.descricao}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  safe: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: {
    fontSize: 18, fontWeight: '700',
    color: '#ff8d8c', letterSpacing: 2,
  },

  // Summary Card (XP, Stars, Status)
  summaryCard: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12, padding: 20,
    marginTop: 24, marginBottom: 20,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center', gap: 6 },
  summaryIconCircle: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
  },
  summaryValue: { fontSize: 18, fontWeight: '700', color: '#fff' },
  summaryLabel: {
    fontSize: 10, color: '#999', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 1,
  },
  starsRow: { flexDirection: 'row', gap: 2 },

  // Progress section
  progressSection: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12, padding: 20, marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 11, color: '#999',
    textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: '700',
  },
  progressPercent: { fontSize: 24, fontWeight: '700', color: '#FF4757' },
  progressBarContainer: {
    height: 6, backgroundColor: '#2A2A2A',
    borderRadius: 3, overflow: 'hidden', marginBottom: 8,
  },
  progressBarFill: { height: 6, backgroundColor: '#FF4757', borderRadius: 3 },
  progressText: { fontSize: 12, color: '#999' },

  // Loading / Empty
  loadingContainer: {
    justifyContent: 'center', alignItems: 'center', paddingVertical: 60,
  },
  loadingText: { color: '#999', marginTop: 12, fontSize: 13 },

  // Empty state
  emptyState: {
    justifyContent: 'center', alignItems: 'center', paddingVertical: 40,
    backgroundColor: '#1E1E1E', borderRadius: 12, marginBottom: 24,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  emptyTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginTop: 12 },
  emptyText: { color: '#777', fontSize: 13, textAlign: 'center', marginTop: 6, paddingHorizontal: 32 },

  // Período sections
  periodoSection: { marginBottom: 24 },
  periodoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  periodoTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  periodoTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  periodoCounter: { fontSize: 13, fontWeight: '600', color: '#FF4757' },

  periodoCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },

  checklistItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 14,
  },
  checklistItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },

  checkboxChecked: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#FF4757',
    justifyContent: 'center', alignItems: 'center',
  },
  checkboxUnchecked: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 2, borderColor: '#555',
  },

  checklistText: { flex: 1, fontSize: 15, color: '#fff', fontWeight: '500' },
  checklistTextDone: { color: '#555', textDecorationLine: 'line-through' },

  // Dicas
  dicasSection: { marginBottom: 32, marginTop: 8 },
  dicasHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16,
  },
  dicasTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  dicasContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  dicaItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  dicaIconCircle: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  dicaText: { flex: 1, fontSize: 14, color: '#ddd', lineHeight: 20 },

  // Actions
  actionsRow: {
    flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 32,
  },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#1E1E1E', borderRadius: 12, paddingVertical: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  actionBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});
