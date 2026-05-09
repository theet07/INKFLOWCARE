import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '@/services/api';
import { useAuth } from '@/context/auth';

export default function VerificacaoScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { authenticate } = useAuth();

  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [reenvioLoading, setReenvioLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Timer do cooldown
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [cooldown]);

  async function handleVerificar() {
    if (!codigo || codigo.length < 6) {
      setErro('O código deve ter 6 dígitos.');
      return;
    }

    setErro('');
    setLoading(true);

    try {
      const response = await api.post('/clientes/verificar-codigo', {
        email: email,
        codigo: codigo
      });

      if (response.data.success && response.data.token) {
        // Salva JWT e dados do user diretamente no Contexto e vai pra Home
        await authenticate(response.data.token, response.data.user);
        router.replace('/(tabs)');
      } else {
        setErro('Erro na verificação do token. Tente fazer login.');
      }
    } catch (error: any) {
      console.error('Erro na verificação:', error);
      if (error.response?.status === 429) {
        setErro('Muitas tentativas incorretas. Tente novamente mais tarde.');
      } else {
        setErro(error.response?.data?.message || 'Código inválido ou expirado.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleReenviar() {
    if (cooldown > 0) return;

    setErro('');
    setReenvioLoading(true);

    try {
      // O mesmo endpoint de cadastro gerencia o reenvio (pois a conta já existe e não está verificada)
      await api.post('/clientes/solicitar-codigo', {
        username: 'reenvio', // Dados falsos pois a conta já existe
        email: email,
        password: 'Reenvio_password_1!', // Dados falsos
        fullName: 'Reenvio',
        telefone: '',
      });
      
      setCooldown(60); // 60 segundos de cooldown
      Alert.alert('Sucesso', 'Um novo código foi enviado para seu e-mail.');
    } catch (error: any) {
      // Mesmo se der 409 (se já verificou antes por exemplo), tratamos aqui
      console.error('Erro ao reenviar:', error);
      setErro(error.response?.data?.message || 'Erro ao reenviar o código. Tente novamente.');
    } finally {
      setReenvioLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Verificar E-mail</Text>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            <View style={styles.iconContainer}>
              <Ionicons name="mail-open-outline" size={64} color="#FF4757" />
            </View>

            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>Verifique sua conta</Text>
              <Text style={styles.welcomeSubtitle}>
                Enviamos um código de 6 dígitos para o e-mail:
                {'\n'}<Text style={{ fontWeight: 'bold', color: '#fff' }}>{email}</Text>
              </Text>
            </View>

            <View style={styles.formContainer}>
              
              <View style={[styles.inputWrapper, erro && styles.inputErro]}>
                <Ionicons name="keypad-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { letterSpacing: 8, fontSize: 20, textAlign: 'center' }]}
                  placeholder="000000"
                  placeholderTextColor="#555"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={codigo}
                  onChangeText={(v) => { setCodigo(v.replace(/[^0-9]/g, '')); setErro(''); }}
                />
              </View>

              {!!erro && (
                <View style={styles.erroContainer}>
                  <Ionicons name="alert-circle-outline" size={16} color="#FF4757" />
                  <Text style={styles.erroTexto}>{erro}</Text>
                </View>
              )}

              <Pressable
                style={({ pressed }) => [styles.verificarButton, (pressed || loading) && styles.pressed]}
                onPress={handleVerificar}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.verificarButtonText}>VERIFICAR CÓDIGO</Text>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  </>
                )}
              </Pressable>

              <Pressable 
                style={styles.reenviarContainer} 
                onPress={handleReenviar}
                disabled={cooldown > 0 || reenvioLoading}
              >
                {reenvioLoading ? (
                  <ActivityIndicator color="#FF4757" size="small" />
                ) : (
                  <Text style={[styles.reenviarTexto, cooldown > 0 && { color: '#666' }]}>
                    {cooldown > 0 ? `Reenviar código em ${cooldown}s` : 'Não recebeu? Reenviar código'}
                  </Text>
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

  iconContainer: { alignItems: 'center', marginBottom: 24 },

  welcomeContainer: { marginBottom: 32, alignItems: 'center' },
  welcomeTitle: { fontSize: 24, fontWeight: '700', color: '#fff', letterSpacing: -0.5, marginBottom: 8 },
  welcomeSubtitle: { fontSize: 15, color: '#adaaaa', textAlign: 'center', lineHeight: 22 },

  formContainer: { gap: 16 },

  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 1, borderColor: '#333',
    borderRadius: 12, paddingHorizontal: 16, height: 64,
  },
  inputErro: { borderColor: 'rgba(255, 71, 87, 0.5)' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#fff', fontSize: 15 },

  erroContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255, 71, 87, 0.08)',
    borderWidth: 1, borderColor: 'rgba(255, 71, 87, 0.2)',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
  },
  erroTexto: { color: '#FF4757', fontSize: 13, flex: 1, fontWeight: '500' },

  verificarButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#FF4757', borderRadius: 12, height: 56, marginTop: 8,
  },
  verificarButtonText: { color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },

  pressed: { opacity: 0.8 },

  reenviarContainer: { alignItems: 'center', marginTop: 24, padding: 12 },
  reenviarTexto: { color: '#FF4757', fontSize: 14, fontWeight: '600' },
});
