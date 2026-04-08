import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const fases = [
  {
    id: 1,
    titulo: 'Fase 1 — Primeiras 24h',
    dias: 'Dia 1',
    cor: '#FF0000',
    icone: 'bandage-outline',
    descricao: 'A tatuagem está recém-feita. A pele está inflamada e sensível.',
    cuidados: [
      'Mantenha o curativo por 2 a 4 horas',
      'Lave suavemente com água morna e sabão neutro',
      'Seque com papel toalha limpo (sem esfregar)',
      'Aplique uma camada fina de pomada cicatrizante',
      'Não cubra novamente com plástico',
    ],
  },
  {
    id: 2,
    titulo: 'Fase 2 — Cicatrização inicial',
    dias: 'Dias 2 a 7',
    cor: '#FF6600',
    icone: 'water-outline',
    descricao: 'A pele começa a formar uma crosta fina. É normal sentir coceira.',
    cuidados: [
      'Lave 2x ao dia com sabão neutro',
      'Aplique pomada ou loção hidratante sem perfume',
      'Não coce nem arranhe a área',
      'Evite roupas apertadas sobre a tatuagem',
      'Não mergulhe em piscina ou mar',
    ],
  },
  {
    id: 3,
    titulo: 'Fase 3 — Descamação',
    dias: 'Dias 7 a 14',
    cor: '#FFAA00',
    icone: 'leaf-outline',
    descricao: 'A pele começa a descamar. Isso é completamente normal e saudável.',
    cuidados: [
      'Deixe a pele descamar naturalmente',
      'Continue hidratando 2x ao dia',
      'Não arranque as cascas',
      'A tatuagem pode parecer opaca — é temporário',
      'Evite exposição solar direta',
    ],
  },
  {
    id: 4,
    titulo: 'Fase 4 — Cicatrização profunda',
    dias: 'Dias 14 a 30',
    cor: '#00AA44',
    icone: 'shield-checkmark-outline',
    descricao: 'A camada superficial está curada. A pele profunda ainda se recupera.',
    cuidados: [
      'Continue hidratando diariamente',
      'Use protetor solar FPS 50+ ao sair',
      'Evite banhos muito quentes',
      'A tatuagem vai ganhar brilho e definição',
      'Consulte o artista se notar algo estranho',
    ],
  },
];

const alertas = [
  { icone: 'warning-outline', texto: 'Vermelhidão excessiva após 3 dias', nivel: 'alto' },
  { icone: 'thermometer-outline', texto: 'Febre ou calor intenso na área', nivel: 'alto' },
  { icone: 'alert-circle-outline', texto: 'Pus ou secreção com odor', nivel: 'alto' },
  { icone: 'information-circle-outline', texto: 'Coceira intensa (normal, mas monitore)', nivel: 'baixo' },
];

export default function CuidadosScreen() {
  const [faseAberta, setFaseAberta] = useState<number | null>(1);

  return (
    <LinearGradient colors={['#000000', '#0a0a2e', '#0d1b4b']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          <Text style={styles.pageTitle}>Guia de Cuidados</Text>
          <Text style={styles.pageSub}>Siga cada fase para uma cicatrização perfeita</Text>

          {/* Fases */}
          {fases.map((fase) => (
            <View key={fase.id} style={styles.faseCard}>
              <TouchableOpacity
                style={styles.faseHeader}
                onPress={() => setFaseAberta(faseAberta === fase.id ? null : fase.id)}
                activeOpacity={0.7}
              >
                <View style={styles.faseHeaderLeft}>
                  <View style={[styles.faseIcone, { backgroundColor: `${fase.cor}20` }]}>
                    <Ionicons name={fase.icone as any} size={20} color={fase.cor} />
                  </View>
                  <View>
                    <Text style={styles.faseTitulo}>{fase.titulo}</Text>
                    <Text style={[styles.faseDias, { color: fase.cor }]}>{fase.dias}</Text>
                  </View>
                </View>
                <Ionicons
                  name={faseAberta === fase.id ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#555"
                />
              </TouchableOpacity>

              {faseAberta === fase.id && (
                <View style={styles.faseBody}>
                  <Text style={styles.faseDescricao}>{fase.descricao}</Text>
                  {fase.cuidados.map((c, i) => (
                    <View key={i} style={styles.cuidadoItem}>
                      <View style={[styles.cuidadoBullet, { backgroundColor: fase.cor }]} />
                      <Text style={styles.cuidadoTexto}>{c}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}

          {/* Sinais de alerta */}
          <Text style={styles.sectionTitle}>⚠️ Sinais de alerta</Text>
          <Text style={styles.alertaIntro}>Procure um médico se notar:</Text>
          {alertas.map((a, i) => (
            <View key={i} style={[styles.alertaItem, a.nivel === 'alto' && styles.alertaAlto]}>
              <Ionicons
                name={a.icone as any}
                size={18}
                color={a.nivel === 'alto' ? '#FF0000' : '#FFAA00'}
              />
              <Text style={styles.alertaTexto}>{a.texto}</Text>
            </View>
          ))}

          {/* Produtos recomendados */}
          <Text style={styles.sectionTitle}>🧴 Produtos recomendados</Text>
          {['Bepantol Derma', 'Vaseline Intensive Care', 'Protetor Solar FPS 50+', 'Sabão neutro (sem perfume)'].map((p, i) => (
            <View key={i} style={styles.produtoItem}>
              <Ionicons name="checkmark-circle" size={18} color="#FF0000" />
              <Text style={styles.produtoTexto}>{p}</Text>
            </View>
          ))}

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 22, paddingBottom: 30 },

  pageTitle: { fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 20 },
  pageSub: { fontSize: 13, color: '#888', marginTop: 4, marginBottom: 24 },

  faseCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14, marginBottom: 10, overflow: 'hidden',
  },
  faseHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 16,
  },
  faseHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  faseIcone: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  faseTitulo: { fontSize: 14, fontWeight: '600', color: '#fff' },
  faseDias: { fontSize: 12, marginTop: 2 },
  faseBody: {
    paddingHorizontal: 16, paddingBottom: 16,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
  },
  faseDescricao: { fontSize: 13, color: '#aaa', marginTop: 12, marginBottom: 12, lineHeight: 20 },
  cuidadoItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  cuidadoBullet: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  cuidadoTexto: { fontSize: 13, color: '#ccc', flex: 1, lineHeight: 20 },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginTop: 28, marginBottom: 12 },
  alertaIntro: { fontSize: 13, color: '#888', marginBottom: 10 },
  alertaItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  alertaAlto: { borderColor: 'rgba(255,0,0,0.2)', backgroundColor: 'rgba(255,0,0,0.05)' },
  alertaTexto: { fontSize: 13, color: '#ccc', flex: 1 },

  produtoItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  produtoTexto: { fontSize: 14, color: '#ccc' },
});
