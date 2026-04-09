import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const tatuagem = {
  nome: 'Dragão nas costas',
  diasRestantes: 12,
  totalDias: 30,
  fase: 'Descamação',
  artista: 'Carlos Ink',
  data: '10/07/2025',
};

const lembretesIniciais = [
  { id: 1, hora: '08:00', titulo: 'Lavar a tatuagem', feito: true, icone: 'water-outline' },
  { id: 2, hora: '12:00', titulo: 'Aplicar pomada hidratante', feito: true, icone: 'medical-outline' },
  { id: 3, hora: '15:00', titulo: 'Verificar sinais de inflamação', feito: false, icone: 'eye-outline' },
  { id: 4, hora: '18:00', titulo: 'Lavar a tatuagem', feito: false, icone: 'water-outline' },
  { id: 5, hora: '20:00', titulo: 'Aplicar protetor solar', feito: false, icone: 'sunny-outline' },
  { id: 6, hora: '22:00', titulo: 'Aplicar pomada hidratante', feito: false, icone: 'medical-outline' },
];

const dicas = [
  { icon: 'water-outline', texto: 'Hidrate bem a pele hoje — fase de descamação exige mais cuidado', cor: '#4FC3F7' },
  { icon: 'sunny-outline', texto: 'Evite exposição ao sol diretamente na tatuagem', cor: '#FFD54F' },
  { icon: 'shirt-outline', texto: 'Use roupas folgadas e de tecido macio sobre a área', cor: '#A5D6A7' },
  { icon: 'hand-left-outline', texto: 'Não coce nem arranhe mesmo que sinta coceira', cor: '#EF9A9A' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [lembretes, setLembretes] = useState(lembretesIniciais);
  const progresso = (tatuagem.totalDias - tatuagem.diasRestantes) / tatuagem.totalDias;
  const feitos = lembretes.filter((l) => l.feito).length;

  function toggleLembrete(id: number) {
    setLembretes((prev) =>
      prev.map((l) => (l.id === id ? { ...l, feito: !l.feito } : l))
    );
  }

  function handleNotificacoes() {
    Alert.alert(
      '🔔 Notificações',
      `Tens ${lembretes.filter((l) => !l.feito).length} lembretes pendentes para hoje.\n\nNotificações push serão ativadas em breve.`,
      [{ text: 'OK' }]
    );
  }

  return (
    <LinearGradient colors={['#000000', '#0a0a2e', '#0d1b4b']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Olá, João 👋</Text>
              <Text style={styles.headerSub}>Veja o progresso da sua tatuagem</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn} onPress={handleNotificacoes} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={22} color="#fff" />
              {lembretes.filter((l) => !l.feito).length > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{lembretes.filter((l) => !l.feito).length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Card principal */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardLabel}>Tatuagem ativa</Text>
                <Text style={styles.cardTitle}>{tatuagem.nome}</Text>
              </View>
              <View style={styles.faseBadge}>
                <Text style={styles.faseText}>{tatuagem.fase}</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progresso * 100}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {tatuagem.totalDias - tatuagem.diasRestantes}/{tatuagem.totalDias} dias
              </Text>
            </View>

            <View style={styles.cardInfo}>
              <View style={styles.cardInfoItem}>
                <Ionicons name="person-outline" size={14} color="#888" />
                <Text style={styles.cardInfoText}>{tatuagem.artista}</Text>
              </View>
              <View style={styles.cardInfoItem}>
                <Ionicons name="calendar-outline" size={14} color="#888" />
                <Text style={styles.cardInfoText}>{tatuagem.data}</Text>
              </View>
              <View style={styles.cardInfoItem}>
                <Ionicons name="time-outline" size={14} color="#FF0000" />
                <Text style={[styles.cardInfoText, { color: '#FF0000' }]}>
                  {tatuagem.diasRestantes} dias restantes
                </Text>
              </View>
            </View>
          </View>

          {/* Lembretes de hoje */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lembretes de hoje</Text>
            <Text style={styles.sectionCounter}>{feitos}/{lembretes.length} feitos</Text>
          </View>

          {/* Barra de progresso dos lembretes */}
          <View style={styles.lembretesProgressBar}>
            <View style={[styles.lembretesProgressFill, { width: `${(feitos / lembretes.length) * 100}%` }]} />
          </View>

          <View style={styles.lembretesContainer}>
            {lembretes.map((l) => (
              <TouchableOpacity
                key={l.id}
                style={[styles.lembrete, l.feito && styles.lembreteFeito]}
                onPress={() => toggleLembrete(l.id)}
                activeOpacity={0.7}
              >
                <View style={styles.lembreteLeft}>
                  <View style={[styles.lembreteCheck, l.feito && styles.lembreteCheckFeito]}>
                    {l.feito && <Ionicons name="checkmark" size={12} color="#fff" />}
                  </View>
                  <View>
                    <Text style={[styles.lembreteTitulo, l.feito && styles.lembreteTextoFeito]}>
                      {l.titulo}
                    </Text>
                    <View style={styles.lembreteIconeRow}>
                      <Ionicons name={l.icone as any} size={11} color="#555" />
                      <Text style={styles.lembreteSubtitulo}>{l.feito ? 'Concluído' : 'Pendente'}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.lembreteHora}>{l.hora}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Dicas do dia */}
          <Text style={styles.sectionTitle}>Dicas do dia</Text>
          <View style={styles.dicasContainer}>
            {dicas.map((d, i) => (
              <View key={i} style={styles.dica}>
                <View style={[styles.dicaIcon, { backgroundColor: `${d.cor}18` }]}>
                  <Ionicons name={d.icon as any} size={18} color={d.cor} />
                </View>
                <Text style={styles.dicaTexto}>{d.texto}</Text>
              </View>
            ))}
          </View>

          {/* Botão adicionar tatuagem */}
          <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/nova-tatuagem')} activeOpacity={0.7}>
            <Ionicons name="add-circle-outline" size={20} color="#FF0000" />
            <Text style={styles.addBtnText}>Adicionar nova tatuagem</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 22, paddingBottom: 30 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 24 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 13, color: '#888', marginTop: 2 },
  notifBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.07)',
    justifyContent: 'center', alignItems: 'center',
  },
  notifBadge: {
    position: 'absolute', top: 6, right: 6,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#FF0000', justifyContent: 'center', alignItems: 'center',
  },
  notifBadgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },

  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16, padding: 18, marginBottom: 28,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  cardLabel: { fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginTop: 4 },
  faseBadge: {
    backgroundColor: 'rgba(255,0,0,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,0,0,0.3)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  faseText: { color: '#FF0000', fontSize: 12, fontWeight: '600' },

  progressContainer: { marginBottom: 16 },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, marginBottom: 6 },
  progressFill: { height: 6, backgroundColor: '#FF0000', borderRadius: 3 },
  progressText: { fontSize: 12, color: '#888', textAlign: 'right' },

  cardInfo: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cardInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardInfoText: { fontSize: 12, color: '#888' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 12 },
  sectionCounter: { fontSize: 13, color: '#FF0000', fontWeight: '600' },

  lembretesProgressBar: { height: 3, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 14 },
  lembretesProgressFill: { height: 3, backgroundColor: '#FF0000', borderRadius: 2 },

  lembretesContainer: { gap: 8, marginBottom: 28 },
  lembrete: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12, padding: 14,
  },
  lembreteFeito: { opacity: 0.45 },
  lembreteLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  lembreteCheck: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1.5, borderColor: '#555',
    justifyContent: 'center', alignItems: 'center',
  },
  lembreteCheckFeito: { backgroundColor: '#FF0000', borderColor: '#FF0000' },
  lembreteTitulo: { fontSize: 14, color: '#fff', fontWeight: '500' },
  lembreteTextoFeito: { textDecorationLine: 'line-through', color: '#555' },
  lembreteIconeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  lembreteSubtitulo: { fontSize: 11, color: '#555' },
  lembreteHora: { fontSize: 12, color: '#888' },

  dicasContainer: { gap: 8, marginBottom: 28 },
  dica: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  dicaIcon: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  dicaTexto: { fontSize: 13, color: '#ccc', flex: 1, lineHeight: 19 },

  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: 'rgba(255,0,0,0.3)',
    borderRadius: 12, height: 50,
    backgroundColor: 'rgba(255,0,0,0.05)',
  },
  addBtnText: { color: '#FF0000', fontSize: 15, fontWeight: '600' },
});
