import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { useAuth } from '@/context/auth';
import api from '@/services/api';

export default function LoginScreen() {
  const router = useRouter();
  const { login, logado, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);


  // Estados de Recuperação de Senha
  const [recuperacaoVisivel, setRecuperacaoVisivel] = useState(false);
  const [recuperacaoStep, setRecuperacaoStep] = useState(1);
  const [recuperacaoEmail, setRecuperacaoEmail] = useState('');
  const [recuperacaoOtp, setRecuperacaoOtp] = useState('');
  const [recuperacaoNovaSenha, setRecuperacaoNovaSenha] = useState('');
  const [recuperacaoLoading, setRecuperacaoLoading] = useState(false);
  const [recuperacaoErro, setRecuperacaoErro] = useState('');

  // Já logado → vai para tabs
  if (logado && !authLoading) {
    return <Redirect href="/(tabs)" />;
  }

  function validar() {
    if (!email.trim()) return 'Informe o email.';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Email inválido.';
    if (!senha.trim()) return 'Informe a senha.';
    return '';
  }

  async function handleLogin() {
    const erroValidacao = validar();
    if (erroValidacao) { setErro(erroValidacao); return; }

    setErro('');
    setLoading(true);

    const result = await login(email, senha);
    setLoading(false);
    
    if (!result.success) {
      setErro(result.message || 'Email ou senha incorretos.');
    }
  }

  function handleCadastroApp() {
    router.push('/cadastro');
  }

  // Integração com a API Real
  async function handleRecuperacaoStep1() {
    if (!/\S+@\S+\.\S+/.test(recuperacaoEmail)) {
      setRecuperacaoErro('Insira um e-mail válido.');
      return;
    }
    setRecuperacaoErro('');
    setRecuperacaoLoading(true);
    
    try {
      await api.post('/auth/recuperar-senha', { email: recuperacaoEmail });
      setRecuperacaoStep(2); // Avança para inserir os 6 dígitos
    } catch (error: any) {
      setRecuperacaoErro(error.response?.data?.message || 'Erro ao solicitar código. Tente novamente.');
    } finally {
      setRecuperacaoLoading(false);
    }
  }

  async function handleRecuperacaoStep2() {
    if (recuperacaoOtp.length < 6) {
      setRecuperacaoErro('O código deve ter 6 dígitos.');
      return;
    }
    setRecuperacaoErro('');
    setRecuperacaoLoading(true);
    
    try {
      await api.post('/auth/validar-codigo-senha', { email: recuperacaoEmail, codigo: recuperacaoOtp });
      setRecuperacaoStep(3); // Avança para nova senha
    } catch (error: any) {
      setRecuperacaoErro(error.response?.data?.message || 'Código inválido ou expirado.');
    } finally {
      setRecuperacaoLoading(false);
    }
  }

  async function handleRecuperacaoStep3() {
    if (recuperacaoNovaSenha.length < 6) {
      setRecuperacaoErro('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setRecuperacaoErro('');
    setRecuperacaoLoading(true);
    
    try {
      await api.post('/auth/redefinir-senha', { email: recuperacaoEmail, codigo: recuperacaoOtp, novaSenha: recuperacaoNovaSenha });
      setRecuperacaoVisivel(false);
      setRecuperacaoStep(1);
      setRecuperacaoEmail('');
      setRecuperacaoOtp('');
      setRecuperacaoNovaSenha('');
      Alert.alert('Sucesso!', 'Sua senha foi redefinida. Você já pode fazer login.');
    } catch (error: any) {
      setRecuperacaoErro(error.response?.data?.message || 'Erro ao redefinir a senha.');
    } finally {
      setRecuperacaoLoading(false);
    }
  }

  function fecharRecuperacao() {
    setRecuperacaoVisivel(false);
    setRecuperacaoErro('');
    setRecuperacaoStep(1);
    setRecuperacaoOtp('');
    setRecuperacaoNovaSenha('');
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image 
                source={require('@/assets/images/FAVORICON-INKFLOW-WHITE.png')} 
                style={styles.logoImage} 
                resizeMode="contain"
              />
              <Text style={styles.appName}>INKFLOWCARE</Text>
              <Text style={styles.appSubtitle}>CUIDADOS PÓS-TATUAGEM</Text>
            </View>

            {/* Boas-vindas */}
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>Bem-vindo de volta</Text>
              <Text style={styles.welcomeSubtitle}>Continue sua jornada de cicatrização</Text>
            </View>

            {/* Campos */}
            <View style={styles.formContainer}>
              <View style={[styles.inputWrapper, erro && !email && styles.inputErro]}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
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
                  placeholder="Senha"
                  placeholderTextColor="#555"
                  secureTextEntry={!showSenha}
                  value={senha}
                  onChangeText={(v) => { setSenha(v); setErro(''); }}
                />
                <Pressable onPress={() => setShowSenha(!showSenha)} style={styles.eyeIcon} hitSlop={10}>
                  <Ionicons name={showSenha ? 'eye-outline' : 'eye-off-outline'} size={20} color="#666" />
                </Pressable>
              </View>

              {/* Mensagem de erro */}
              {!!erro && (
                <View style={styles.erroContainer}>
                  <Ionicons name="alert-circle-outline" size={16} color="#ff8d8c" />
                  <Text style={styles.erroTexto}>{erro}</Text>
                </View>
              )}

              <Pressable style={styles.forgotPassword} onPress={() => setRecuperacaoVisivel(true)}>
                <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
              </Pressable>

              {/* Botão Entrar */}
              <Pressable
                style={({ pressed }) => [styles.loginButton, (pressed || loading) && styles.pressed]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#0e0e0e" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>ENTRAR</Text>
                    <Ionicons name="arrow-forward" size={20} color="#0e0e0e" />
                  </>
                )}
              </Pressable>

              {/* Divisor */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Primeira vez?</Text>
                <View style={styles.dividerLine} />
              </View>
            </View>

            {/* Rodapé */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Não tem conta? </Text>
              <Pressable onPress={handleCadastroApp}>
                <Text style={styles.footerLink}>Cadastre-se</Text>
              </Pressable>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>



      {/* Modal de Recuperação de Senha */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={recuperacaoVisivel}
        onRequestClose={fecharRecuperacao}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={[styles.modalOverlay, { justifyContent: 'flex-end', padding: 0 }]}>
            <View style={styles.bottomSheet}>
              <View style={styles.bottomSheetHeader}>
                <Text style={styles.bottomSheetTitle}>
                  {recuperacaoStep === 1 && 'Recuperar Senha'}
                  {recuperacaoStep === 2 && 'Código de Segurança'}
                  {recuperacaoStep === 3 && 'Nova Senha'}
                </Text>
                <Pressable onPress={fecharRecuperacao} hitSlop={15}>
                  <Ionicons name="close" size={24} color="#666" />
                </Pressable>
              </View>

              <Text style={styles.bottomSheetDesc}>
                {recuperacaoStep === 1 && 'Enviaremos um código de 6 dígitos para o seu e-mail para validar sua identidade.'}
                {recuperacaoStep === 2 && `Enviamos um código para ${recuperacaoEmail}. Digite-o abaixo:`}
                {recuperacaoStep === 3 && 'Crie uma nova senha segura para acessar sua conta.'}
              </Text>

              {recuperacaoStep === 1 && (
                <View style={[styles.inputWrapper, recuperacaoErro ? styles.inputErro : null, { marginBottom: 24 }]}>
                  <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Seu email"
                    placeholderTextColor="#555"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={recuperacaoEmail}
                    onChangeText={(v) => { setRecuperacaoEmail(v); setRecuperacaoErro(''); }}
                  />
                </View>
              )}

              {recuperacaoStep === 2 && (
                <View style={[styles.inputWrapper, recuperacaoErro ? styles.inputErro : null, { marginBottom: 24 }]}>
                  <Ionicons name="keypad-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { letterSpacing: 8, fontSize: 20, textAlign: 'center' }]}
                    placeholder="000000"
                    placeholderTextColor="#555"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={recuperacaoOtp}
                    onChangeText={(v) => { setRecuperacaoOtp(v.replace(/[^0-9]/g, '')); setRecuperacaoErro(''); }}
                  />
                </View>
              )}

              {recuperacaoStep === 3 && (
                <View style={[styles.inputWrapper, recuperacaoErro ? styles.inputErro : null, { marginBottom: 24 }]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nova senha"
                    placeholderTextColor="#555"
                    secureTextEntry={true}
                    value={recuperacaoNovaSenha}
                    onChangeText={(v) => { setRecuperacaoNovaSenha(v); setRecuperacaoErro(''); }}
                  />
                </View>
              )}

              {!!recuperacaoErro && (
                <Text style={{ color: '#ff8d8c', fontSize: 13, marginBottom: 16, marginTop: -8 }}>{recuperacaoErro}</Text>
              )}

              <Pressable
                style={({ pressed }) => [styles.loginButton, { marginTop: 0 }, (pressed || recuperacaoLoading) && styles.pressed]}
                onPress={() => {
                  if (recuperacaoStep === 1) handleRecuperacaoStep1();
                  if (recuperacaoStep === 2) handleRecuperacaoStep2();
                  if (recuperacaoStep === 3) handleRecuperacaoStep3();
                }}
                disabled={recuperacaoLoading}
              >
                {recuperacaoLoading ? (
                  <ActivityIndicator color="#0e0e0e" />
                ) : (
                  <Text style={styles.loginButtonText}>
                    {recuperacaoStep === 3 ? 'REDEFINIR SENHA' : 'CONTINUAR'}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingVertical: 40, justifyContent: 'center' },

  logoContainer: { alignItems: 'center', marginBottom: 48 },
  logoImage: {
    width: 80, height: 80,
    marginBottom: 16,
    tintColor: '#FFFFFF',
  },
  appName: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: 2 },
  appSubtitle: { fontSize: 12, color: '#adaaaa', marginTop: 6, letterSpacing: 1.5, fontWeight: '600' },

  welcomeContainer: { marginBottom: 32 },
  welcomeTitle: { fontSize: 28, fontWeight: '700', color: '#fff', letterSpacing: -0.5 },
  welcomeSubtitle: { fontSize: 15, color: '#adaaaa', marginTop: 8 },

  formContainer: { gap: 16 },

  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#131313',
    borderWidth: 1, borderColor: '#262626',
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

  forgotPassword: { alignSelf: 'flex-end', marginTop: 4 },
  forgotPasswordText: { color: '#adaaaa', fontSize: 13, fontWeight: '500' },

  loginButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#ff8d8c', borderRadius: 12, height: 56, marginTop: 8,
  },
  loginButtonText: { color: '#0e0e0e', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 14, marginVertical: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#262626' },
  dividerText: { color: '#adaaaa', fontSize: 13, fontWeight: '500' },

  pressed: { opacity: 0.8 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#adaaaa', fontSize: 14 },
  footerLink: { color: '#ff8d8c', fontSize: 14, fontWeight: '700' },

  // Modal Customizado
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  modalContent: {
    backgroundColor: '#131313', borderRadius: 20, padding: 28,
    width: '100%', maxWidth: 360, alignItems: 'center',
    borderWidth: 1, borderColor: '#262626',
  },
  modalIconContainer: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255, 141, 140, 0.1)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 12 },
  modalText: {
    fontSize: 15, color: '#adaaaa', textAlign: 'center',
    lineHeight: 22, marginBottom: 28,
  },
  modalButtonsRow: {
    flexDirection: 'row', gap: 12, width: '100%',
  },
  modalButton: {
    flex: 1, height: 50, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1, borderColor: '#333',
  },
  modalButtonConfirm: {
    backgroundColor: '#ff8d8c',
  },
  modalButtonCancelText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  modalButtonConfirmText: { color: '#0e0e0e', fontSize: 15, fontWeight: '700' },

  // Bottom Sheet (Recuperação de Senha)
  bottomSheet: {
    backgroundColor: '#131313', width: '100%',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderWidth: 1, borderColor: '#262626', borderBottomWidth: 0,
  },
  bottomSheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16,
  },
  bottomSheetTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  bottomSheetDesc: { fontSize: 14, color: '#adaaaa', lineHeight: 20, marginBottom: 24 },
});
