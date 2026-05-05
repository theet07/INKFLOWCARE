import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const fases = [
  {
    id: 1,
    titulo: 'Fase 1 — Primeiras 24h',
    dias: 'Dia 1',
    cor: '#FF4757',
    icone: 'bandage-outline',
    descricao: 'A tatuagem está recém-feita. A pele está inflamada e sensível. Esta é a fase mais crítica.',
    rotina: {
      manha: [
        'Remova o curativo com cuidado após 2-4 horas',
        'Lave suavemente com água morna e sabão neutro',
        'Seque com papel toalha limpo (sem esfregar)',
        'Aplique camada fina de pomada cicatrizante',
      ],
      tarde: [
        'Verifique se há sinais de inflamação excessiva',
        'Mantenha a área limpa e seca',
        'Evite tocar com as mãos sujas',
        'Use roupas folgadas sobre a área',
      ],
      noite: [
        'Lave novamente antes de dormir',
        'Aplique pomada cicatrizante',
        'Não cubra com plástico para dormir',
        'Use lençol limpo e macio',
      ],
    },
    cuidados: [
      'Não cubra novamente com plástico após remover o curativo',
      'Evite piscina, mar e banheira por pelo menos 3 semanas',
      'Não exponha ao sol diretamente',
      'Não use esponja ou bucha na área',
    ],
  },
  {
    id: 2,
    titulo: 'Fase 2 — Cicatrização inicial',
    dias: 'Dias 2 a 7',
    cor: '#FF8C00',
    icone: 'water-outline',
    descricao: 'A pele começa a formar uma crosta fina. É normal sentir coceira e ver algum vermelhidão.',
    rotina: {
      manha: [
        'Lave com sabão neutro sem perfume',
        'Seque com papel toalha limpo',
        'Aplique loção hidratante sem perfume',
        'Observe se há sinais de infecção',
      ],
      tarde: [
        'Hidrate novamente se sentir a pele seca',
        'Evite roupas apertadas sobre a tatuagem',
        'Não coce mesmo que sinta coceira intensa',
        'Beba bastante água para hidratar de dentro',
      ],
      noite: [
        'Lave antes de dormir',
        'Aplique hidratante ou pomada',
        'Evite dormir diretamente sobre a tatuagem',
        'Mantenha o ambiente fresco',
      ],
    },
    cuidados: [
      'Lave 2x ao dia com sabão neutro',
      'Não mergulhe em piscina ou mar',
      'Evite roupas apertadas sobre a tatuagem',
      'Não arranhe nem esfregue a área',
    ],
  },
  {
    id: 3,
    titulo: 'Fase 3 — Descamação',
    dias: 'Dias 7 a 14',
    cor: '#FFD700',
    icone: 'leaf-outline',
    descricao: 'A pele começa a descamar. Isso é completamente normal e saudável. A tatuagem pode parecer opaca.',
    rotina: {
      manha: [
        'Lave suavemente sem esfregar as cascas',
        'Aplique hidratante generosamente',
        'Não arranque as cascas que estão soltando',
        'Aplique protetor solar se for sair',
      ],
      tarde: [
        'Reidrate a pele se estiver seca',
        'Evite exposição solar direta',
        'Não use produtos com álcool na área',
        'Observe a cor da tatuagem — pode parecer opaca',
      ],
      noite: [
        'Lave e hidrate antes de dormir',
        'Use hidratante mais espesso à noite',
        'Deixe a pele respirar sem curativo',
        'A opacidade é temporária — não se preocupe',
      ],
    },
    cuidados: [
      'Deixe a pele descamar naturalmente',
      'Continue hidratando 2-3x ao dia',
      'Não arranque as cascas — pode manchar',
      'Evite exposição solar direta',
    ],
  },
  {
    id: 4,
    titulo: 'Fase 4 — Cicatrização profunda',
    dias: 'Dias 14 a 30',
    cor: '#22c55e',
    icone: 'shield-checkmark-outline',
    descricao: 'A camada superficial está curada. A pele profunda ainda se recupera e a tatuagem ganha brilho.',
    rotina: {
      manha: [
        'Hidrate diariamente',
        'Aplique protetor solar FPS 50+ ao sair',
        'A tatuagem vai ganhar brilho e definição',
        'Continue evitando sol direto',
      ],
      tarde: [
        'Reaplicar protetor solar se ficar ao sol',
        'Hidrate se sentir a pele seca',
        'Pode retomar atividades físicas leves',
        'Evite banhos muito quentes',
      ],
      noite: [
        'Hidrate antes de dormir',
        'Observe se a cicatrização está uniforme',
        'Consulte o artista se notar algo estranho',
        'Comemore — está quase curada! 🎉',
      ],
    },
    cuidados: [
      'Continue hidratando diariamente',
      'Use protetor solar FPS 50+ ao sair',
      'Evite banhos muito quentes',
      'Consulte o artista se notar algo estranho',
    ],
  },
];

const alertas = [
  { icone: 'warning-outline', texto: 'Vermelhidão excessiva após 3 dias', nivel: 'alto' },
  { icone: 'thermometer-outline', texto: 'Febre ou calor intenso na área', nivel: 'alto' },
  { icone: 'alert-circle-outline', texto: 'Pus ou secreção com odor', nivel: 'alto' },
  { icone: 'skull-outline', texto: 'Inchaço que aumenta após 48h', nivel: 'alto' },
  { icone: 'information-circle-outline', texto: 'Coceira intensa (normal, mas monitore)', nivel: 'baixo' },
  { icone: 'color-fill-outline', texto: 'Cores desbotando muito rápido', nivel: 'baixo' },
];

const faq = [
  { pergunta: 'Posso malhar durante a cicatrização?', resposta: 'Evite nas primeiras 2 semanas. Após isso, pode retomar com cuidado, evitando suor excessivo na área e roupas que rocem.' },
  { pergunta: 'Quando posso ir à praia ou piscina?', resposta: 'Aguarde pelo menos 3 semanas. A água com cloro ou sal pode danificar a tatuagem e causar infecção.' },
  { pergunta: 'A tatuagem ficou opaca, é normal?', resposta: 'Sim! Durante a descamação (dias 7-14) a tatuagem pode parecer opaca. Após a cicatrização completa ela volta a ter brilho e definição.' },
  { pergunta: 'Qual pomada usar?', resposta: 'Bepantol Derma, Vaseline Intensive Care ou qualquer hidratante sem perfume e sem álcool. Evite produtos com lanolina.' },
  { pergunta: 'Posso usar protetor solar?', resposta: 'Sim, mas só após a cicatrização superficial (após 2 semanas). Use FPS 50+ sempre que expor ao sol.' },
];

const periodos = ['manha', 'tarde', 'noite'] as const;
const periodoLabel = { manha: '🌅 Manhã', tarde: '☀️ Tarde', noite: '🌙 Noite' };

export default function CuidadosScreen() {
  const [faseAberta, setFaseAberta] = useState<number | null>(1);
  const [periodoAtivo, setPeriodoAtivo] = useState<'manha' | 'tarde' | 'noite'>('manha');
  const [checklistFeito, setChecklistFeito] = useState<Record<string, boolean>>({});
  const [faqAberta, setFaqAberta] = useState<number | null>(null);

  function toggleChecklist(key: string) {
    setChecklistFeito((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleAlerta(texto: string) {
    Alert.alert('⚠️ Sinal de alerta', `${texto}\n\nSe notar este sintoma, procure um médico ou dermatologista imediatamente.`, [{ text: 'Entendido' }]);
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="book-outline" size={22} color="#ff8d8c" />
          <Text style={styles.headerTitle}>GUIA DE CUIDADOS</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

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
                <Ionicons name={faseAberta === fase.id ? 'chevron-up' : 'chevron-down'} size={18} color="#555" />
              </TouchableOpacity>

              {faseAberta === fase.id && (
                <View style={styles.faseBody}>
                  <Text style={styles.faseDescricao}>{fase.descricao}</Text>

                  {/* Seletor de período */}
                  <View style={styles.periodoSelector}>
                    {periodos.map((p) => (
                      <TouchableOpacity
                        key={p}
                        style={[styles.periodoBtn, periodoAtivo === p && styles.periodoBtnAtivo]}
                        onPress={() => setPeriodoAtivo(p)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.periodoBtnText, periodoAtivo === p && styles.periodoBtnTextAtivo]}>
                          {periodoLabel[p]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Checklist do período */}
                  <Text style={styles.checklistTitulo}>Checklist — {periodoLabel[periodoAtivo]}</Text>
                  {fase.rotina[periodoAtivo].map((item, i) => {
                    const key = `${fase.id}-${periodoAtivo}-${i}`;
                    const feito = !!checklistFeito[key];
                    return (
                      <TouchableOpacity
                        key={key}
                        style={[styles.checkItem, feito && styles.checkItemFeito]}
                        onPress={() => toggleChecklist(key)}
                        activeOpacity={0.7}
                      >
                        {feito ? (
                          <View style={styles.checkBoxChecked}>
                            <Ionicons name="checkmark" size={14} color="#fff" />
                          </View>
                        ) : (
                          <View style={styles.checkBox} />
                        )}
                        <Text style={[styles.checkTexto, feito && styles.checkTextoFeito]}>{item}</Text>
                      </TouchableOpacity>
                    );
                  })}

                  {/* Cuidados gerais da fase */}
                  <Text style={[styles.checklistTitulo, { marginTop: 16 }]}>⚠️ Evitar nesta fase</Text>
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
          <Text style={styles.alertaIntro}>Toque para saber mais sobre cada sinal:</Text>
          {alertas.map((a, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.alertaItem, a.nivel === 'alto' && styles.alertaAlto]}
              onPress={() => handleAlerta(a.texto)}
              activeOpacity={0.7}
            >
              <Ionicons name={a.icone as any} size={18} color={a.nivel === 'alto' ? '#FF4757' : '#FFD700'} />
              <Text style={styles.alertaTexto}>{a.texto}</Text>
              <Ionicons name="chevron-forward" size={14} color="#555" />
            </TouchableOpacity>
          ))}

          {/* Produtos recomendados */}
          <Text style={styles.sectionTitle}>🧴 Produtos recomendados</Text>
          <View style={styles.produtosCard}>
            {[
              { nome: 'Bepantol Derma', uso: 'Pomada cicatrizante — fases 1 e 2' },
              { nome: 'Vaseline Intensive Care', uso: 'Hidratante — fases 2, 3 e 4' },
              { nome: 'Protetor Solar FPS 50+', uso: 'Proteção solar — fase 4 em diante' },
              { nome: 'Sabão neutro (sem perfume)', uso: 'Limpeza diária — todas as fases' },
              { nome: 'Bepantol líquido', uso: 'Hidratação extra em pele muito seca' },
            ].map((p, i, arr) => (
              <View key={i} style={[styles.produtoItem, i < arr.length - 1 && styles.produtoBorder]}>
                <Ionicons name="checkmark-circle" size={18} color="#FF4757" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.produtoNome}>{p.nome}</Text>
                  <Text style={styles.produtoUso}>{p.uso}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* FAQ */}
          <Text style={styles.sectionTitle}>❓ Perguntas frequentes</Text>
          {faq.map((f, i) => (
            <View key={i} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => setFaqAberta(faqAberta === i ? null : i)}
                activeOpacity={0.7}
              >
                <Text style={styles.faqPergunta}>{f.pergunta}</Text>
                <Ionicons name={faqAberta === i ? 'chevron-up' : 'chevron-down'} size={16} color="#555" />
              </TouchableOpacity>
              {faqAberta === i && (
                <Text style={styles.faqResposta}>{f.resposta}</Text>
              )}
            </View>
          ))}

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
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#262626',
  },
  headerTitle: {
    fontSize: 18, fontWeight: '700', color: '#ff8d8c', letterSpacing: 2,
  },

  pageSub: { fontSize: 14, color: '#999', marginTop: 20, marginBottom: 24 },

  // Fases
  faseCard: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12, marginBottom: 10, overflow: 'hidden',
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
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)',
  },
  faseDescricao: { fontSize: 13, color: '#999', marginTop: 12, marginBottom: 14, lineHeight: 20 },

  // Período selector
  periodoSelector: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  periodoBtn: {
    flex: 1, paddingVertical: 8, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  periodoBtnAtivo: { backgroundColor: 'rgba(255,71,87,0.15)', borderColor: 'rgba(255,71,87,0.4)' },
  periodoBtnText: { fontSize: 11, color: '#666', fontWeight: '600' },
  periodoBtnTextAtivo: { color: '#FF4757' },

  // Checklist
  checklistTitulo: { fontSize: 12, color: '#999', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  checkItem: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10, padding: 12, marginBottom: 6,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  checkItemFeito: { opacity: 0.45 },
  checkBox: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#555',
    marginTop: 1,
  },
  checkBoxChecked: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#FF4757',
    justifyContent: 'center', alignItems: 'center',
    marginTop: 1,
  },
  checkTexto: { fontSize: 13, color: '#ddd', flex: 1, lineHeight: 19 },
  checkTextoFeito: { textDecorationLine: 'line-through', color: '#555' },

  // Cuidados
  cuidadoItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  cuidadoBullet: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  cuidadoTexto: { fontSize: 13, color: '#ddd', flex: 1, lineHeight: 20 },

  // Sections
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginTop: 28, marginBottom: 12 },

  // Alertas
  alertaIntro: { fontSize: 13, color: '#999', marginBottom: 10 },
  alertaItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 10, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  alertaAlto: { borderColor: 'rgba(255,71,87,0.2)', backgroundColor: 'rgba(255,71,87,0.05)' },
  alertaTexto: { fontSize: 13, color: '#ddd', flex: 1 },

  // Produtos
  produtosCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  produtoItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14,
  },
  produtoBorder: {
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  produtoNome: { fontSize: 14, color: '#fff', fontWeight: '600' },
  produtoUso: { fontSize: 12, color: '#999', marginTop: 2 },

  // FAQ
  faqCard: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12, marginBottom: 8, overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 14,
  },
  faqPergunta: { fontSize: 14, color: '#fff', fontWeight: '500', flex: 1, marginRight: 8 },
  faqResposta: { fontSize: 13, color: '#999', lineHeight: 20, paddingHorizontal: 14, paddingBottom: 14 },
});
