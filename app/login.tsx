import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { useAuth } from '@/context/auth';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <LinearGradient colors={['#000000', '#0a0a2e', '#0d1b4b']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="color-palette" size={40} color="#FF0000" />
              </View>
              <Text style={styles.appName}>InkFlow Care</Text>
              <Text style={styles.appSubtitle}>Cuidados Pós-Tatuagem</Text>
            </View>

            {/* Boas-vindas */}
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>Bem-vindo de volta!</Text>
              <Text style={styles.welcomeSubtitle}>Continue sua jornada de cuidados</Text>
            </View>

            {/* Campos */}
            <View style={styles.formContainer}>
              <View style={[styles.inputWrapper, erro && !email && styles.inputErro]}>
                <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
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
                <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  placeholderTextColor="#555"
                  secureTextEntry={!showSenha}
                  value={senha}
                  onChangeText={(v) => { setSenha(v); setErro(''); }}
                />
                <Pressable onPress={() => setShowSenha(!showSenha)} style={styles.eyeIcon}>
                  <Ionicons name={showSenha ? 'eye-outline' : 'eye-off-outline'} size={20} color="#888" />
                </Pressable>
              </View>

              {/* Mensagem de erro */}
              {!!erro && (
                <View style={styles.erroContainer}>
                  <Ionicons name="alert-circle-outline" size={15} color="#FF0000" />
                  <Text style={styles.erroTexto}>{erro}</Text>
                </View>
              )}

              <Pressable style={styles.forgotPassword} onPress={() => Alert.alert('Recuperar senha', 'Insere o teu email e enviaremos um link de recuperação.\n\n(Funcionalidade disponível após integração com o backend)')}
              >
                <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
              </Pressable>

              {/* Botão Entrar */}
              <Pressable
                style={({ pressed }) => [styles.loginButton, (pressed || loading) && styles.pressed]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Entrar</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
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
              <Pressable onPress={() => Alert.alert('Cadastro', 'O cadastro é feito através do site.\nApós criar a conta, usa o mesmo email e senha aqui no app.')}>
                <Text style={styles.footerLink}>Cadastre-se</Text>
              </Pressable>
            </View>

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
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingVertical: 20 },

  logoContainer: { alignItems: 'center', marginTop: 20, marginBottom: 32 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,0,0,0.1)',
    borderWidth: 1.5, borderColor: 'rgba(255,0,0,0.3)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 14,
    shadowColor: '#FF0000', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  appName: { fontSize: 26, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  appSubtitle: { fontSize: 13, color: '#888', marginTop: 4 },

  welcomeContainer: { marginBottom: 28 },
  welcomeTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  welcomeSubtitle: { fontSize: 14, color: '#888', marginTop: 4 },

  formContainer: { gap: 14 },

  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12, paddingHorizontal: 14, height: 52,
  },
  inputErro: { borderColor: 'rgba(255,0,0,0.5)' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  eyeIcon: { padding: 4 },

  erroContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,0,0,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,0,0,0.2)',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8,
    marginTop: -4,
  },
  erroTexto: { color: '#FF6666', fontSize: 13, flex: 1 },

  forgotPassword: { alignSelf: 'flex-end', marginTop: -4 },
  forgotPasswordText: { color: '#FF0000', fontSize: 13 },

  loginButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FF0000', borderRadius: 12, height: 52, gap: 8, marginTop: 4,
    shadowColor: '#FF0000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
  },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerText: { color: '#555', fontSize: 13 },

  demoButton: {
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12, height: 52, justifyContent: 'center', alignItems: 'center',
  },
  demoButtonText: { color: '#ccc', fontSize: 15, fontWeight: '500' },

  pressed: { opacity: 0.65 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: { color: '#888', fontSize: 14 },
  footerLink: { color: '#FF0000', fontSize: 14, fontWeight: '600' },
});
