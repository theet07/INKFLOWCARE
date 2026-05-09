import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '@/services/api';
import { useAuth } from '@/context/auth';
import { useCustomAlert } from '@/context/AlertContext';

export default function Privacidade() {
  const router = useRouter();
  const { logout } = useAuth();
  const { showAlert } = useCustomAlert();
  
  const [modalVisivel, setModalVisivel] = useState(false);
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleDeleteAccount() {
    if (!senha) {
      showAlert('Atenção', 'Digite sua senha para confirmar.', [{ text: 'OK' }], 'warning');
      return;
    }
    
    setLoading(true);
    try {
      await api.delete('/clientes/minha-conta', {
        data: { password: senha }
      });
      setModalVisivel(false);
      await logout();
      router.replace('/login');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao deletar conta. Senha incorreta?';
      showAlert('Erro', msg, [{ text: 'OK' }], 'close-circle');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacidade</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 60 }}>
          {/* Seus Dados */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="shield-checkmark" size={22} color="#ff8d8c" />
              <Text style={styles.sectionTitle}>Seus Dados</Text>
            </View>
            <Text style={styles.sectionText}>
              Seus dados são armazenados com segurança, de ponta a ponta. A InkFlowCare respeita a sua privacidade e garante que nenhuma informação sensível seja compartilhada com terceiros sem o seu consentimento.
            </Text>
          </View>

          {/* Política de Privacidade */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text" size={22} color="#ff8d8c" />
              <Text style={styles.sectionTitle}>Política de Privacidade</Text>
            </View>
            <View style={styles.policyContainer}>
              <Text style={styles.policyTitle}>1. Coleta de Dados</Text>
              <Text style={styles.policyText}>
                Coletamos informações necessárias para o funcionamento do app, como nome, e-mail e fotos enviadas para acompanhamento da cicatrização das suas tatuagens.
              </Text>

              <Text style={styles.policyTitle}>2. Uso das Informações</Text>
              <Text style={styles.policyText}>
                As imagens do seu progresso de cicatrização são analisadas apenas para fornecer feedback e recomendações. Elas não são publicadas em nenhuma rede pública do app.
              </Text>

              <Text style={styles.policyTitle}>3. Armazenamento</Text>
              <Text style={styles.policyText}>
                Todo dado trafegado é criptografado. As fotos da sua cicatrização são guardadas em servidores seguros na nuvem (Cloudinary) apenas com a sua identificação interna.
              </Text>

              <Text style={styles.policyTitle}>4. Direitos do Usuário</Text>
              <Text style={styles.policyText}>
                Você tem o direito de baixar, alterar ou solicitar a exclusão total dos seus dados a qualquer momento usando a "Zona de Perigo" abaixo.
              </Text>
              
              <Text style={styles.policyTitle}>5. Contato</Text>
              <Text style={styles.policyText}>
                Dúvidas sobre sua privacidade? Fale conosco em suporte@inkflowcare.com.
              </Text>
            </View>
          </View>

          {/* Zona de Perigo */}
          <View style={[styles.section, styles.dangerSection]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="warning" size={22} color="#FF4757" />
              <Text style={[styles.sectionTitle, { color: '#FF4757' }]}>Zona de Perigo</Text>
            </View>
            <Text style={styles.sectionText}>
              Ao excluir sua conta, você perderá acesso ao seu histórico de cicatrização, tatuagens e dados permanentemente. Essa ação é irreversível.
            </Text>
            
            <TouchableOpacity 
              style={styles.dangerBtn}
              onPress={() => setModalVisivel(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color="#FF4757" />
              <Text style={styles.dangerBtnText}>Deletar minha conta</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>

      {/* Modal Deletar Conta */}
      <Modal visible={modalVisivel} transparent animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="alert-circle" size={40} color="#FF4757" />
              </View>
              <Text style={styles.modalTitle}>Deletar Conta</Text>
              <Text style={styles.modalDesc}>
                Esta ação é irreversível. Todos os seus dados, histórico e fotos serão permanentemente removidos.
              </Text>

              <Text style={styles.modalLabel}>Confirme com sua senha</Text>
              <View style={styles.modalInputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#888" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Sua senha"
                  placeholderTextColor="#555"
                  secureTextEntry
                  value={senha}
                  onChangeText={setSenha}
                  editable={!loading}
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalBtn, styles.modalBtnCancel]} 
                  onPress={() => {
                    setSenha('');
                    setModalVisivel(false);
                  }}
                  disabled={loading}
                >
                  <Text style={styles.modalBtnCancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalBtn, styles.modalBtnDanger]} 
                  onPress={handleDeleteAccount}
                  disabled={loading}
                >
                  <Text style={styles.modalBtnDangerText}>
                    {loading ? 'Deletando...' : 'Confirmar exclusão'}
                  </Text>
                </TouchableOpacity>
              </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerBtn: {
    width: 40, height: 40,
    justifyContent: 'center', alignItems: 'center',
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
  dangerSection: {
    borderColor: 'rgba(255, 71, 87, 0.3)',
    backgroundColor: 'rgba(255, 71, 87, 0.03)',
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
  },
  policyContainer: {
    marginTop: 10,
  },
  policyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ddd',
    marginTop: 16,
    marginBottom: 4,
  },
  policyText: {
    fontSize: 14,
    color: '#888',
    lineHeight: 22,
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF4757',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 20,
    gap: 8,
  },
  dangerBtnText: {
    color: '#FF4757',
    fontSize: 16,
    fontWeight: '600',
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    width: '100%',
    padding: 24,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 64, height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalLabel: {
    alignSelf: 'flex-start',
    fontSize: 13,
    color: '#bbb',
    marginBottom: 8,
  },
  modalInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0e0e0e',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
    width: '100%',
    marginBottom: 24,
  },
  modalInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#555',
  },
  modalBtnDanger: {
    backgroundColor: '#FF4757',
  },
  modalBtnCancelText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  modalBtnDangerText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
