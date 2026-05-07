import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '@/services/api';
import { useAuth } from '@/context/auth';

const locais = ['Braço', 'Perna', 'Costas', 'Peito', 'Pescoço', 'Mão', 'Pé', 'Outro'];

export default function NovaTatuagemScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [nome, setNome] = useState('');
  const [artista, setArtista] = useState('');
  const [local, setLocal] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [obs, setObs] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSalvar() {
    if (!nome.trim()) { Alert.alert('Atenção', 'Informe o nome da tatuagem.'); return; }
    if (!artista.trim()) { Alert.alert('Atenção', 'Informe o nome do artista.'); return; }
    if (!local) { Alert.alert('Atenção', 'Selecione o local da tatuagem.'); return; }

    // Parsear largura/altura do campo tamanho (ex: "15x10")
    let largura: number | null = null;
    let altura: number | null = null;
    const match = tamanho.match(/(\d+(?:[.,]\d+)?)\s*[xX]\s*(\d+(?:[.,]\d+)?)/);
    if (match) {
      largura = parseFloat(match[1].replace(',', '.'));
      altura = parseFloat(match[2].replace(',', '.'));
    }

    try {
      setLoading(true);
      await api.post('/cicatrizacao/criar', {
        clienteId: user?.id,
        regiao: local,
        largura,
        altura,
      });
      Alert.alert('Tatuagem adicionada!', `"${nome}" foi adicionada ao seu acompanhamento.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.log('Erro detalhado:', err.response?.data || err.message);
      Alert.alert('Erro', `Erro interno: ${JSON.stringify(err.response?.data || err.message)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#adaaaa" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>NOVA TATUAGEM</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            <Text style={styles.sectionLabel}>INFORMAÇÕES BÁSICAS</Text>

            <View style={styles.inputWrapper}>
              <Ionicons name="color-palette-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nome da tatuagem (ex: Dragão nas costas)"
                placeholderTextColor="#555"
                value={nome}
                onChangeText={setNome}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nome do artista"
                placeholderTextColor="#555"
                value={artista}
                onChangeText={setArtista}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="resize-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Tamanho (ex: 15x10 cm)"
                placeholderTextColor="#555"
                value={tamanho}
                onChangeText={setTamanho}
              />
            </View>

            <Text style={styles.sectionLabel}>LOCAL DO CORPO</Text>
            <View style={styles.locaisGrid}>
              {locais.map((l) => (
                <TouchableOpacity
                  key={l}
                  style={[styles.localBtn, local === l && styles.localBtnAtivo]}
                  onPress={() => setLocal(l)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.localBtnText, local === l && styles.localBtnTextAtivo]}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>OBSERVAÇÕES</Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Alergias, estilo da tatuagem, cores usadas..."
                placeholderTextColor="#555"
                value={obs}
                onChangeText={setObs}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={20} color="#ff8d8c" />
              <Text style={styles.infoText}>
                O cronograma de cuidados de 30 dias será iniciado automaticamente a partir de hoje.
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.salvarBtn, (pressed || loading) && { opacity: 0.8 }]}
              onPress={handleSalvar}
              disabled={loading}
            >
              <Ionicons name="checkmark-circle-outline" size={22} color="#0e0e0e" />
              <Text style={styles.salvarBtnText}>{loading ? 'CRIANDO...' : 'INICIAR ACOMPANHAMENTO'}</Text>
            </Pressable>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
    backgroundColor: 'rgba(14,14,14,0.9)',
  },
  backBtn: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff8d8c',
    letterSpacing: -0.5,
  },

  sectionLabel: { 
    fontSize: 12, 
    color: '#adaaaa', 
    fontWeight: '700',
    letterSpacing: 1.5, 
    marginBottom: 16, 
    marginTop: 24 
  },

  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#131313',
    borderWidth: 1, borderColor: '#262626',
    borderRadius: 12, paddingHorizontal: 16, height: 56, marginBottom: 12,
  },
  textAreaWrapper: { height: 120, alignItems: 'flex-start', paddingVertical: 16 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  textArea: { height: 100 },

  locaisGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  localBtn: {
    paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 24, borderWidth: 1,
    borderColor: '#262626',
    backgroundColor: '#131313',
  },
  localBtnAtivo: { 
    backgroundColor: 'rgba(255, 141, 140, 0.15)', 
    borderColor: 'rgba(255, 141, 140, 0.4)' 
  },
  localBtnText: { color: '#adaaaa', fontSize: 14, fontWeight: '500' },
  localBtnTextAtivo: { color: '#ff8d8c', fontWeight: '700' },

  infoBox: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255, 141, 140, 0.08)',
    borderWidth: 1, borderColor: 'rgba(255, 141, 140, 0.2)',
    borderRadius: 12, padding: 16, marginBottom: 32, marginTop: 16,
  },
  infoText: { color: '#adaaaa', fontSize: 13, flex: 1, lineHeight: 20 },

  salvarBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#ff8d8c', borderRadius: 12, height: 56,
  },
  salvarBtnText: { color: '#0e0e0e', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
});
