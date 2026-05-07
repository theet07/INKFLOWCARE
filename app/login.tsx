import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { useAuth } from '@/context/auth';

export default function LoginScreen() {
  const { login, logado, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

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

  function handleCadastroWeb() {
    // URL base do frontend Web (Altere caso o domínio final seja outro)
    const WEB_URL = 'http://localhost:5173/cadastro'; // ou 'https://seusite.com/cadastro'
    
    // Cria uma URL de retorno dinâmica (funciona no Expo Go e em Produção)
    const deepLinkUrl = Linking.createURL('/login');
    
    // Adiciona o parâmetro redirect para que a Web saiba para onde voltar
    const fullUrl = `${WEB_URL}?redirect=${encodeURIComponent(deepLinkUrl)}`;

    if (Platform.OS === 'web') {
      const confirm = window.confirm('O cadastro é feito com segurança pelo nosso site. Vamos redirecioná-lo(a) para o portal.\n\nApós finalizar, você voltará automaticamente ao app.\n\nDeseja ir para o site agora?');
      if (confirm) {
        window.open(fullUrl, '_blank'); // ou window.location.href = fullUrl
      }
    } else {
      Alert.alert(
        'Criar Conta',
        'O cadastro é feito com segurança pelo nosso site. Vamos redirecioná-lo(a) para o portal.\n\nApós finalizar, você voltará automaticamente ao app.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ir para o site', onPress: () => Linking.openURL(fullUrl) }
        ]
      );
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image 
                source={require('@/assets/images/FAVORICON-INKFLOW.png')} 
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

              <Pressable style={styles.forgotPassword} onPress={() => Alert.alert('Recuperar senha', 'Insira o seu email e enviaremos um link de recuperação.\n\n(Funcionalidade disponível em breve)')}>
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
              <Pressable onPress={handleCadastroWeb}>
                <Text style={styles.footerLink}>Cadastre-se</Text>
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
});
