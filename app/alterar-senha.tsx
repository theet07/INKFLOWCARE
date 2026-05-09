import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '@/services/api';
import { useCustomAlert } from '@/context/AlertContext';

export default function AlterarSenha() {
  const router = useRouter();
  const { showAlert } = useCustomAlert();
  
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);

  async function handleSalvar() {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      showAlert('Atenção', 'Preencha todos os campos.', [{ text: 'OK' }], 'warning');
      return;
    }
    if (novaSenha.length < 6) {
      showAlert('Atenção', 'A nova senha deve ter no mínimo 6 caracteres.', [{ text: 'OK' }], 'warning');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      showAlert('Atenção', 'A nova senha e a confirmação não batem.', [{ text: 'OK' }], 'warning');
      return;
    }

    setLoading(true);
    try {
      await api.put('/clientes/minha-senha', {
        senhaAtual,
        novaSenha
      });
      showAlert('Sucesso!', 'Sua senha foi alterada com sucesso.', [
        { text: 'OK', onPress: () => router.back() }
      ], 'checkmark-circle');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Não foi possível alterar a senha. Verifique a senha atual.';
      showAlert('Erro', msg, [{ text: 'OK' }], 'close-circle');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Título Interno */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Alterar Senha</Text>
        </View>

        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="lock-closed" size={22} color="#ff8d8c" />
                <Text style={styles.sectionTitle}>Segurança da Conta</Text>
              </View>
              <Text style={styles.sectionText}>
                Para manter sua conta segura, utilize uma senha forte com letras, números e no mínimo 6 caracteres.
              </Text>

              {/* Senha Atual */}
              <Text style={styles.label}>Senha Atual</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Sua senha atual"
                  placeholderTextColor="#555"
                  secureTextEntry={!showSenhaAtual}
                  value={senhaAtual}
                  onChangeText={setSenhaAtual}
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowSenhaAtual(!showSenhaAtual)} style={styles.eyeBtn}>
                  <Ionicons name={showSenhaAtual ? "eye-off" : "eye"} size={20} color="#888" />
                </TouchableOpacity>
              </View>

              {/* Nova Senha */}
              <Text style={styles.label}>Nova Senha</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Digite a nova senha"
                  placeholderTextColor="#555"
                  secureTextEntry={!showNovaSenha}
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowNovaSenha(!showNovaSenha)} style={styles.eyeBtn}>
                  <Ionicons name={showNovaSenha ? "eye-off" : "eye"} size={20} color="#888" />
                </TouchableOpacity>
              </View>

              {/* Confirmar Nova Senha */}
              <Text style={styles.label}>Confirmar Nova Senha</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Repita a nova senha"
                  placeholderTextColor="#555"
                  secureTextEntry={!showNovaSenha}
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  editable={!loading}
                />
              </View>

              {/* Botão Salvar */}
              <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={handleSalvar}
                disabled={loading}
                activeOpacity={0.7}
              >
                <Text style={styles.saveBtnText}>
                  {loading ? 'Salvando...' : 'Atualizar Senha'}
                </Text>
              </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  scroll: {
    padding: 20,
  },
  section: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 10,
  },
  sectionText: {
    fontSize: 14,
    color: '#888',
    lineHeight: 22,
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    color: '#bbb',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0e0e0e',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  eyeBtn: {
    padding: 4,
  },
  saveBtn: {
    backgroundColor: '#ff8d8c',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  }
});
