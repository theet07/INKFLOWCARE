import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '@/services/api';

export default function CadastroScreen() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  function validar() {
    if (!nome.trim()) return 'Informe seu nome completo.';
    if (!email.trim()) return 'Informe o e-mail.';
    
    // Validação rígida de email @gmail.com
    const gmailRegex = /^[^@]+@gmail\.com$/;
    if (!gmailRegex.test(email.toLowerCase().trim())) {
      return 'Obrigatório o uso de e-mail @gmail.com para cadastro.';
    }

    if (!senha.trim()) return 'Informe a senha.';
    
    // Validação força de senha
    const senhaRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    if (!senhaRegex.test(senha)) {
      return 'A senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial (!@#$%^&*).';
    }

    if (senha !== confirmarSenha) return 'As senhas não coincidem.';

    return '';
  }

  async function handleCadastro() {
    const erroValidacao = validar();
    if (erroValidacao) { setErro(erroValidacao); return; }

    setErro('');
    setLoading(true);

    // Gera um username a partir do email para satisfazer o backend
    const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const randomSuffix = Math.floor(Math.random() * 10000);
    const username = `${baseUsername}_${randomSuffix}`;

    try {
      await api.post('/clientes/solicitar-codigo', {
        username,
        email: email.toLowerCase().trim(),
        password: senha,
        fullName: nome.trim(),
        telefone: '', // Vazio por enquanto conforme solicitado
      });

      // Sucesso! Vai para tela de verificação
      router.push(`/verificacao?email=${encodeURIComponent(email.toLowerCase().trim())}`);
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      setErro(error.response?.data?.message || 'Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Criar Conta</Text>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            <Image 
              source={require('@/assets/images/FAVORICON-INKFLOW.png')} 
              style={{ width: 100, height: 100, resizeMode: 'contain', alignSelf: 'center', tintColor: '#fff', marginTop: -60, marginBottom: 24 }} 
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>Junte-se ao InkFlow</Text>
              <Text style={styles.welcomeSubtitle}>Preencha seus dados para continuar</Text>
            </View>

            <View style={styles.formContainer}>
              
              <View style={[styles.inputWrapper, erro && !nome && styles.inputErro]}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nome Completo"
                  placeholderTextColor="#555"
                  value={nome}
                  onChangeText={(v) => { setNome(v); setErro(''); }}
                />
              </View>

              <View style={[styles.inputWrapper, erro && !email && styles.inputErro]}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email (@gmail.com)"
                  placeholderTextColor="#555"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(v) => { setEmail(v); setErro(''); }}
                />
              </View>

              <View style={[styles.inputWrapper, erro && !senha && styles.inputErro]}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Senha forte"
                  placeholderTextColor="#555"
                  secureTextEntry={!showSenha}
                  value={senha}
                  onChangeText={(v) => { setSenha(v); setErro(''); }}
                />
                <Pressable onPress={() => setShowSenha(!showSenha)} style={styles.eyeIcon} hitSlop={10}>
                  <Ionicons name={showSenha ? 'eye-outline' : 'eye-off-outline'} size={20} color="#666" />
                </Pressable>
              </View>

              <View style={[styles.inputWrapper, erro && !confirmarSenha && styles.inputErro]}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar Senha"
                  placeholderTextColor="#555"
                  secureTextEntry={!showConfirmarSenha}
                  value={confirmarSenha}
                  onChangeText={(v) => { setConfirmarSenha(v); setErro(''); }}
                />
                <Pressable onPress={() => setShowConfirmarSenha(!showConfirmarSenha)} style={styles.eyeIcon} hitSlop={10}>
                  <Ionicons name={showConfirmarSenha ? 'eye-outline' : 'eye-off-outline'} size={20} color="#666" />
                </Pressable>
              </View>

              {!!erro && (
                <View style={styles.erroContainer}>
                  <Ionicons name="alert-circle-outline" size={16} color="#ff8d8c" />
                  <Text style={styles.erroTexto}>{erro}</Text>
                </View>
              )}

              <Pressable
                style={({ pressed }) => [styles.cadastrarButton, (pressed || loading) && styles.pressed]}
                onPress={handleCadastro}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.cadastrarButtonText}>CADASTRAR</Text>
                    <Ionicons name="arrow-forward" size={20} color="#0e0e0e" />
                  </>
                )}
              </Pressable>

            </View>
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
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backButton: { padding: 8, marginRight: 8 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingVertical: 24, justifyContent: 'center' },

  welcomeContainer: { marginBottom: 32, alignItems: 'center' },
  welcomeTitle: { fontSize: 28, fontWeight: '700', color: '#fff', letterSpacing: -0.5, textAlign: 'center' },
  welcomeSubtitle: { fontSize: 15, color: '#adaaaa', marginTop: 8, textAlign: 'center' },

  formContainer: { gap: 16 },

  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 1, borderColor: '#333',
    borderRadius: 12, paddingHorizontal: 16, height: 56,
  },
  inputErro: { borderColor: 'rgba(255, 141, 140, 0.5)' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  eyeIcon: { padding: 4 },

  erroContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255, 141, 140, 0.08)',
    borderWidth: 1, borderColor: 'rgba(255, 141, 140, 0.2)',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
  },
  erroTexto: { color: '#ff8d8c', fontSize: 13, flex: 1, fontWeight: '500' },

  cadastrarButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#ff8d8c', borderRadius: 12, height: 56, marginTop: 16,
  },
  cadastrarButtonText: { color: '#0e0e0e', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },

  pressed: { opacity: 0.8 },
});
