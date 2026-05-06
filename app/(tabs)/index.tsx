import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/auth';
import { useCicatrizacao } from '@/hooks/useCicatrizacao';
import { useChecklist } from '@/hooks/useChecklist';

const periodoHoras: Record<string, string> = {
  MANHA: '08:00',
  TARDE: '14:00',
  NOITE: '20:00',
};

const faseNomes: Record<string, string> = {
  FASE_1_PRIMEIRAS_24H: 'Primeiras 24h',
  FASE_2_INICIAL: 'Inicial',
  FASE_3_DESCAMACAO: 'Descamação',
  FASE_4_PROFUNDA: 'Cicatrização Profunda',
};


export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { cicatrizacao } = useCicatrizacao();
  const { checklist, toggleItem } = useChecklist(
    cicatrizacao?.id || null,
    cicatrizacao?.diaAtual || 1
  );
  const lembretesAtivos = checklist.map(item => ({
    id: item.id,
    hora: periodoHoras[item.periodo] || '00:00',
    titulo: item.descricao,
    feito: item.concluido,
  }));

  const feitos = lembretesAtivos.filter((l) => l.feito).length;
  const semCicatrizacao = !cicatrizacao;

  // Dados reais da cicatrização
  const diaAtual = cicatrizacao?.diaAtual || 0;
  const totalDias = cicatrizacao?.periodoTotalDias || 30;
  const progressoPct = totalDias > 0 ? Math.round((diaAtual / totalDias) * 100) : 0;
  const diasRestantes = totalDias - diaAtual;
  const faseNome = cicatrizacao?.faseAtual ? (faseNomes[cicatrizacao.faseAtual] || 'Em progresso') : '';

  async function toggleLembrete(id: number) {
    await toggleItem(id);
  }

  function handleNotificacoes() {
    Alert.alert(
      '🔔 Notificações',
      `Tens ${lembretesAtivos.filter((l) => !l.feito).length} lembretes pendentes para hoje.`,
      [{ text: 'OK' }]
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {user?.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={styles.headerAvatar}
              />
            ) : (
              <View style={[styles.headerAvatar, styles.headerAvatarFallback]}>
                <Text style={styles.headerAvatarLetter}>
                  {(user?.fullName || user?.nome || 'U')[0].toUpperCase()}
                </Text>
              </View>
            )}
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.greeting}>Olá, {user?.fullName || user?.nome || 'Usuário'}</Text>
                <Ionicons name="sparkles" size={18} color="#FFD700" />
              </View>
              <Text style={styles.headerSub}>Veja o progresso da sua tatuagem</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifBtn} onPress={handleNotificacoes} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={22} color="#adaaaa" />
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Card principal */}
          {semCicatrizacao ? (
            <View style={styles.emptyCard}>
              <Ionicons name="bandage-outline" size={48} color="#555" />
              <Text style={styles.emptyCardTitle}>Nenhuma cicatrização ativa</Text>
              <Text style={styles.emptyCardText}>As tatuagens feitas no estúdio são sincronizadas automaticamente com a sua conta.</Text>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardLabel}>TATUAGEM ATIVA</Text>
                  <Text style={styles.cardTitle}>{cicatrizacao.agendamento?.regiao || 'Tatuagem'}</Text>
                </View>
                <View style={styles.faseBadge}>
                  <Text style={styles.faseText}>{faseNome}</Text>
                </View>
              </View>

              <View style={styles.progressRow}>
                <Text style={styles.progressPercent}>{progressoPct}%</Text>
                <Text style={styles.progressConcluido}>Concluído</Text>
              </View>

              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progressoPct}%` }]} />
              </View>

              <View style={styles.cardInfo}>
                <View style={styles.cardInfoItem}>
                  <Text style={styles.cardInfoLabel}>Progresso</Text>
                  <Text style={styles.cardInfoValue}>{diaAtual}/{totalDias} dias</Text>
                </View>
                <View style={styles.cardInfoItem}>
                  <Text style={styles.cardInfoLabel}>Restante</Text>
                  <Text style={[styles.cardInfoValue, styles.cardInfoValueRed]}>{diasRestantes} dias</Text>
                </View>
                <View style={styles.cardInfoItem}>
                  <Text style={styles.cardInfoLabel}>Artista</Text>
                  <View style={styles.cardInfoRow}>
                    <Ionicons name="brush-outline" size={14} color="#999" />
                    <Text style={styles.cardInfoValue}>{cicatrizacao.agendamento?.artista?.nome || 'N/A'}</Text>
                  </View>
                </View>
                <View style={styles.cardInfoItem}>
                  <Text style={styles.cardInfoLabel}>Início</Text>
                  <View style={styles.cardInfoRow}>
                    <Ionicons name="calendar-outline" size={14} color="#999" />
                    <Text style={styles.cardInfoValue}>{cicatrizacao.dataInicio ? new Date(cicatrizacao.dataInicio).toLocaleDateString('pt-BR') : 'N/A'}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Lembretes de hoje */}
          {lembretesAtivos.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Lembretes de hoje</Text>
                <Text style={styles.sectionCounter}>{feitos}/{lembretesAtivos.length} feitos</Text>
              </View>

              <View style={styles.thinProgressBar}>
                <View style={[styles.thinProgressFill, { width: `${lembretesAtivos.length > 0 ? (feitos / lembretesAtivos.length) * 100 : 0}%` }]} />
              </View>

              <View style={styles.lembretesContainer}>
                {lembretesAtivos.map((l) => (
                  <TouchableOpacity
                    key={l.id}
                    style={styles.lembrete}
                    onPress={() => toggleLembrete(l.id)}
                    activeOpacity={0.7}
                  >
                    {l.feito ? (
                      <View style={styles.checkboxChecked}>
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      </View>
                    ) : (
                      <View style={styles.checkboxUnchecked} />
                    )}
                    <View style={[styles.lembreteTextRow, l.feito && { opacity: 0.5 }]}>
                      <Text style={[styles.lembreteTitulo, l.feito && styles.lembreteTextoFeito]}>
                        {l.titulo}
                      </Text>
                      <Text style={styles.lembreteHora}>{l.hora}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Info sync + botão adicionar */}
          <View style={styles.syncInfo}>
            <Ionicons name="sync-outline" size={14} color="#666" />
            <Text style={styles.syncInfoText}>Tatuagens do estúdio aparecem automaticamente</Text>
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/nova-tatuagem')} activeOpacity={0.7}>
            <Ionicons name="add" size={20} color="#FF4757" />
            <Text style={styles.addBtnText}>Adicionar tatuagem externa</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 120 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#131313',
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#262626',
  },
  headerAvatarFallback: {
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#FF4757',
  },
  headerAvatarLetter: {
    fontSize: 18, fontWeight: '700', color: '#fff',
  },
  greeting: { fontSize: 20, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 14, color: '#adaaaa', marginTop: 2 },
  notifBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.07)',
    justifyContent: 'center', alignItems: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute', top: 4, right: 4,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#FF9500', justifyContent: 'center', alignItems: 'center',
  },
  notifBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  // Empty state card
  emptyCard: {
    backgroundColor: '#1E1E1E', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12, padding: 40, marginBottom: 32, marginTop: 24,
    justifyContent: 'center', alignItems: 'center',
  },
  emptyCardTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginTop: 12 },
  emptyCardText: { color: '#777', fontSize: 13, textAlign: 'center', marginTop: 6, paddingHorizontal: 20 },

  // Card principal
  card: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12, padding: 24, marginBottom: 32, marginTop: 24,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16,
  },
  cardLabel: { fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 2, fontWeight: '700' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginTop: 4 },
  faseBadge: {
    backgroundColor: '#C2185B',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 4,
  },
  faseText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  progressRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 8 },
  progressPercent: { fontSize: 32, fontWeight: '700', color: '#FF4757' },
  progressConcluido: { fontSize: 13, color: '#999' },
  progressBar: { height: 6, backgroundColor: '#2A2A2A', borderRadius: 3, marginBottom: 24, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: '#FF4757', borderRadius: 3 },

  cardInfo: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 16,
    paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)',
  },
  cardInfoItem: { width: '45%' },
  cardInfoLabel: { fontSize: 12, color: '#999', marginBottom: 4 },
  cardInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardInfoValue: { fontSize: 14, fontWeight: '700', color: '#fff' },
  cardInfoValueRed: { color: '#FF4757' },

  // Section header
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  sectionCounter: { fontSize: 13, color: '#FF4757', fontWeight: '600' },

  // Thin progress bar under section title
  thinProgressBar: { height: 3, backgroundColor: '#2A2A2A', borderRadius: 1.5, marginBottom: 16, overflow: 'hidden' },
  thinProgressFill: { height: 3, backgroundColor: '#FF4757', borderRadius: 1.5 },

  // Lembretes container
  lembretesContainer: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 8,
    marginBottom: 32,
  },
  lembrete: {
    flexDirection: 'row', alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 16,
  },
  // Checked: solid red circle with white check
  checkboxChecked: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#FF4757',
    justifyContent: 'center', alignItems: 'center',
  },
  // Unchecked: circle with #555 border
  checkboxUnchecked: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 2, borderColor: '#555',
  },
  lembreteTextRow: {
    flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  lembreteTitulo: { fontSize: 15, color: '#fff', fontWeight: '500' },
  lembreteTextoFeito: { textDecorationLine: 'line-through', color: '#999' },
  lembreteHora: { fontSize: 13, color: '#999' },

  // Sync info
  syncInfo: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginBottom: 12, marginTop: 4,
  },
  syncInfoText: { fontSize: 12, color: '#666' },

  // CTA button
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12, height: 48,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  addBtnText: { color: '#999', fontSize: 13, fontWeight: '600' },
});
