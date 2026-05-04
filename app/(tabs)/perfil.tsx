import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Alert, Modal, Pressable, ScrollView, StyleSheet,
  Switch, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/auth';

const historicoInicial = [
  { id: 1, nome: 'Dragão nas costas', artista: 'Carlos Ink', data: '10/07/2025', status: 'em_cuidado' },
  { id: 2, nome: 'Rosa no braço', artista: 'Ana Tattoo', data: '15/03/2025', status: 'concluida' },
  { id: 3, nome: 'Mandala na perna', artista: 'Pedro Art', data: '02/11/2024', status: 'concluida' },
];

export default function PerfilScreen() {
  const { logout } = useAuth();
  const [nome, setNome] = useState('João Silva');
  const [email, setEmail] = useState('joao@email.com');
  const [nomeEdit, setNomeEdit] = useState('');
  const [emailEdit, setEmailEdit] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [notificacoes, setNotificacoes] = useState(true);
  const [temaEscuro, setTemaEscuro] = useState(true);
  const [historico] = useState(historicoInicial);

  function abrirEditar() {
    setNomeEdit(nome);
    setEmailEdit(email);
    setModalVisivel(true);
  }

  function salvarPerfil() {
    if (!nomeEdit.trim()) { Alert.alert('Atenção', 'O nome não pode estar vazio.'); return; }
    if (!/\S+@\S+\.\S+/.test(emailEdit)) { Alert.alert('Atenção', 'Email inválido.'); return; }
    setNome(nomeEdit.trim());
    setEmail(emailEdit.trim());
    setModalVisivel(false);
    Alert.alert('Perfil atualizado!', 'As tuas informações foram salvas.');
  }

  function handlePrivacidade() {
    Alert.alert('Privacidade', 'Os teus dados são armazenados localmente no dispositivo e nunca partilhados com terceiros.', [{ text: 'OK' }]);
  }

  function handleAjuda() {
    Alert.alert(
      'Ajuda & Suporte',
      'Para suporte, entra em contacto:\n\n📧 suporte@inkflowcare.com\n\nVersão do app: 1.0.0',
      [{ text: 'OK' }]
    );
  }

  async function handleLogout() {
    Alert.alert('Sair da conta', 'Tens a certeza que queres sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Sair', 
        style: 'destructive', 
        onPress: async () => {
          await logout();
        }
      },
    ]);
  }

  const emCuidado = historico.filter((t) => t.status === 'em_cuidado').length;
  const concluidas = historico.filter((t) => t.status === 'concluida').length;

  return (
    <LinearGradient colors={['#000000', '#0a0a2e', '#0d1b4b']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Avatar e nome */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetra}>{nome[0]}</Text>
            </View>
            <Text style={styles.nome}>{nome}</Text>
            <Text style={styles.email}>{email}</Text>
            <TouchableOpacity style={styles.editBtn} onPress={abrirEditar} activeOpacity={0.7}>
              <Ionicons name="pencil-outline" size={14} color="#FF0000" />
              <Text style={styles.editBtnText}>Editar perfil</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{historico.length}</Text>
              <Text style={styles.statLabel}>Tatuagens</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: '#FF0000' }]}>{emCuidado}</Text>
              <Text style={styles.statLabel}>Em cuidado</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: '#00AA44' }]}>{concluidas}</Text>
              <Text style={styles.statLabel}>Concluídas</Text>
            </View>
          </View>

          {/* Histórico */}
          <Text style={styles.sectionTitle}>Minhas tatuagens</Text>
          {historico.map((t) => (
            <View key={t.id} style={styles.tatuagemCard}>
              <View style={styles.tatuagemIcone}>
                <Ionicons name="color-palette-outline" size={22} color="#FF0000" />
              </View>
              <View style={styles.tatuagemInfo}>
                <Text style={styles.tatuagemNome}>{t.nome}</Text>
                <Text style={styles.tatuagemSub}>{t.artista} · {t.data}</Text>
              </View>
              <View style={[styles.statusBadge, t.status === 'em_cuidado' ? styles.statusAtivo : styles.statusConcluido]}>
                <Text style={[styles.statusText, t.status === 'em_cuidado' ? styles.statusAtivoText : styles.statusConcluidoText]}>
                  {t.status === 'em_cuidado' ? 'Ativo' : 'Concluído'}
                </Text>
              </View>
            </View>
          ))}

          {/* Configurações */}
          <Text style={styles.sectionTitle}>Configurações</Text>
          <View style={styles.opcoesContainer}>

            {/* Notificações com toggle */}
            <View style={[styles.opcaoItem, styles.opcaoBorder]}>
              <View style={styles.opcaoLeft}>
                <View style={styles.opcaoIcone}>
                  <Ionicons name="notifications-outline" size={18} color="#FF0000" />
                </View>
                <View>
                  <Text style={styles.opcaoTitulo}>Notificações</Text>
                  <Text style={styles.opcaoSub}>{notificacoes ? 'Ativadas' : 'Desativadas'}</Text>
                </View>
              </View>
              <Switch
                value={notificacoes}
                onValueChange={setNotificacoes}
                trackColor={{ false: '#333', true: 'rgba(255,0,0,0.4)' }}
                thumbColor={notificacoes ? '#FF0000' : '#666'}
              />
            </View>

            {/* Tema escuro com toggle */}
            <View style={[styles.opcaoItem, styles.opcaoBorder]}>
              <View style={styles.opcaoLeft}>
                <View style={styles.opcaoIcone}>
                  <Ionicons name="moon-outline" size={18} color="#FF0000" />
                </View>
                <View>
                  <Text style={styles.opcaoTitulo}>Tema escuro</Text>
                  <Text style={styles.opcaoSub}>{temaEscuro ? 'Ativado' : 'Desativado'}</Text>
                </View>
              </View>
              <Switch
                value={temaEscuro}
                onValueChange={setTemaEscuro}
                trackColor={{ false: '#333', true: 'rgba(255,0,0,0.4)' }}
                thumbColor={temaEscuro ? '#FF0000' : '#666'}
              />
            </View>

            {/* Privacidade */}
            <TouchableOpacity style={[styles.opcaoItem, styles.opcaoBorder]} onPress={handlePrivacidade} activeOpacity={0.7}>
              <View style={styles.opcaoLeft}>
                <View style={styles.opcaoIcone}>
                  <Ionicons name="shield-outline" size={18} color="#FF0000" />
                </View>
                <View>
                  <Text style={styles.opcaoTitulo}>Privacidade</Text>
                  <Text style={styles.opcaoSub}>Gerenciar dados</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#555" />
            </TouchableOpacity>

            {/* Ajuda */}
            <TouchableOpacity style={styles.opcaoItem} onPress={handleAjuda} activeOpacity={0.7}>
              <View style={styles.opcaoLeft}>
                <View style={styles.opcaoIcone}>
                  <Ionicons name="help-circle-outline" size={18} color="#FF0000" />
                </View>
                <View>
                  <Text style={styles.opcaoTitulo}>Ajuda</Text>
                  <Text style={styles.opcaoSub}>FAQ e suporte</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#555" />
            </TouchableOpacity>

          </View>

          {/* Sair */}
          <TouchableOpacity style={styles.sairBtn} onPress={handleLogout} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={18} color="#FF0000" />
            <Text style={styles.sairText}>Sair da conta</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>

      {/* Modal editar perfil */}
      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Editar perfil</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Ionicons name="close" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Nome</Text>
            <View style={styles.modalInput}>
              <Ionicons name="person-outline" size={18} color="#888" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.modalInputText}
                value={nomeEdit}
                onChangeText={setNomeEdit}
                placeholderTextColor="#555"
                placeholder="Teu nome"
              />
            </View>

            <Text style={styles.modalLabel}>Email</Text>
            <View style={styles.modalInput}>
              <Ionicons name="mail-outline" size={18} color="#888" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.modalInputText}
                value={emailEdit}
                onChangeText={setEmailEdit}
                placeholderTextColor="#555"
                placeholder="Teu email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Pressable style={({ pressed }) => [styles.modalSalvarBtn, pressed && { opacity: 0.8 }]} onPress={salvarPerfil}>
              <Text style={styles.modalSalvarText}>Salvar alterações</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 22, paddingBottom: 30 },

  avatarSection: { alignItems: 'center', marginTop: 24, marginBottom: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,0,0,0.15)',
    borderWidth: 2, borderColor: 'rgba(255,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarLetra: { fontSize: 32, fontWeight: '700', color: '#FF0000' },
  nome: { fontSize: 20, fontWeight: '700', color: '#fff' },
  email: { fontSize: 13, color: '#888', marginTop: 4 },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 12, paddingHorizontal: 16, paddingVertical: 6,
    borderWidth: 1, borderColor: 'rgba(255,0,0,0.3)',
    borderRadius: 20, backgroundColor: 'rgba(255,0,0,0.05)',
  },
  editBtnText: { color: '#FF0000', fontSize: 13, fontWeight: '600' },

  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14, padding: 18, marginBottom: 28,
  },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: '700', color: '#fff' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 12 },

  tatuagemCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12, padding: 14, marginBottom: 8,
  },
  tatuagemIcone: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,0,0,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  tatuagemInfo: { flex: 1 },
  tatuagemNome: { fontSize: 14, fontWeight: '600', color: '#fff' },
  tatuagemSub: { fontSize: 12, color: '#888', marginTop: 2 },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  statusAtivo: { backgroundColor: 'rgba(255,0,0,0.1)', borderColor: 'rgba(255,0,0,0.3)' },
  statusConcluido: { backgroundColor: 'rgba(0,170,68,0.1)', borderColor: 'rgba(0,170,68,0.3)' },
  statusText: { fontSize: 11, fontWeight: '600' },
  statusAtivoText: { color: '#FF0000' },
  statusConcluidoText: { color: '#00AA44' },

  opcoesContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14, marginBottom: 20, overflow: 'hidden',
  },
  opcaoItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  opcaoBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  opcaoLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  opcaoIcone: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,0,0,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  opcaoTitulo: { fontSize: 14, fontWeight: '600', color: '#fff' },
  opcaoSub: { fontSize: 12, color: '#888', marginTop: 2 },

  sairBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: 'rgba(255,0,0,0.3)',
    borderRadius: 12, height: 50,
    backgroundColor: 'rgba(255,0,0,0.05)',
  },
  sairText: { color: '#FF0000', fontSize: 15, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContainer: {
    backgroundColor: '#0d1b4b',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
    borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitulo: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalLabel: { fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  modalInput: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12, paddingHorizontal: 14, height: 50, marginBottom: 16,
  },
  modalInputText: { flex: 1, color: '#fff', fontSize: 15 },
  modalSalvarBtn: {
    backgroundColor: '#FF0000', borderRadius: 12, height: 50,
    justifyContent: 'center', alignItems: 'center', marginTop: 8,
  },
  modalSalvarText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
