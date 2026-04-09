import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const locais = ['Braço', 'Perna', 'Costas', 'Peito', 'Pescoço', 'Mão', 'Pé', 'Outro'];

export default function NovaTatuagemScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [artista, setArtista] = useState('');
  const [local, setLocal] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [obs, setObs] = useState('');

  function handleSalvar() {
    if (!nome.trim()) { Alert.alert('Atenção', 'Informe o nome da tatuagem.'); return; }
    if (!artista.trim()) { Alert.alert('Atenção', 'Informe o nome do artista.'); return; }
    if (!local) { Alert.alert('Atenção', 'Selecione o local da tatuagem.'); return; }
    Alert.alert('Tatuagem adicionada!', `"${nome}" foi adicionada ao teu acompanhamento.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  return (
    <LinearGradient colors={['#000000', '#0a0a2e', '#0d1b4b']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Nova Tatuagem</Text>
              <View style={{ width: 40 }} />
            </View>

            <Text style={styles.sectionLabel}>Informações básicas</Text>

            <View style={styles.inputWrapper}>
              <Ionicons name="color-palette-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nome da tatuagem (ex: Dragão nas costas)"
                placeholderTextColor="#555"
                value={nome}
                onChangeText={setNome}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nome do artista"
                placeholderTextColor="#555"
                value={artista}
                onChangeText={setArtista}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="resize-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Tamanho (ex: 15x10 cm)"
                placeholderTextColor="#555"
                value={tamanho}
                onChangeText={setTamanho}
              />
            </View>

            <Text style={styles.sectionLabel}>Local do corpo</Text>
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

            <Text style={styles.sectionLabel}>Observações</Text>
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
              <Ionicons name="information-circle-outline" size={18} color="#FF0000" />
              <Text style={styles.infoText}>
                O cronograma de cuidados de 30 dias será iniciado automaticamente a partir de hoje.
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.salvarBtn, pressed && { opacity: 0.8 }]}
              onPress={handleSalvar}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.salvarBtnText}>Iniciar Acompanhamento</Text>
            </Pressable>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 22, paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, marginBottom: 28 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.07)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },

  sectionLabel: { fontSize: 13, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 },

  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12, paddingHorizontal: 14, height: 52, marginBottom: 12,
  },
  textAreaWrapper: { height: 100, alignItems: 'flex-start', paddingVertical: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  textArea: { height: 80 },

  locaisGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  localBtn: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  localBtnAtivo: { backgroundColor: 'rgba(255,0,0,0.15)', borderColor: 'rgba(255,0,0,0.5)' },
  localBtnText: { color: '#888', fontSize: 13, fontWeight: '500' },
  localBtnTextAtivo: { color: '#FF0000', fontWeight: '700' },

  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: 'rgba(255,0,0,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,0,0,0.2)',
    borderRadius: 12, padding: 14, marginBottom: 24,
  },
  infoText: { color: '#ccc', fontSize: 13, flex: 1, lineHeight: 20 },

  salvarBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#FF0000', borderRadius: 12, height: 52,
    shadowColor: '#FF0000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
  },
  salvarBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
