import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import {
  Alert, Appearance, Image, Modal, Platform, Pressable, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth';
import { useNotifications } from '@/hooks/useNotifications';
import { useBadges } from '@/hooks/useBadges';
import { useCicatrizacao } from '@/hooks/useCicatrizacao';
import { useEstatisticas } from '@/hooks/useEstatisticas';
import api from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCustomAlert } from '@/context/AlertContext';

const TEMA_KEY = '@inkflow:tema_escuro';

export default function PerfilScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const { badges, desbloqueadas, totalBadges } = useBadges(user?.id);
  const { cicatrizacao } = useCicatrizacao();
  const { stats, xpTotal } = useEstatisticas(cicatrizacao?.id);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [nomeEdit, setNomeEdit] = useState('');
  const [emailEdit, setEmailEdit] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const { prefs: notifPrefs, toggleAtivas } = useNotifications(user?.id);
  const notificacoes = notifPrefs.ativas;
  const [temaEscuro, setTemaEscuro] = useState(true);
  const [historico, setHistorico] = useState<any[]>([]);
  const { showAlert } = useCustomAlert();

  useEffect(() => {
    AsyncStorage.getItem(TEMA_KEY).then((val) => {
      if (val !== null) setTemaEscuro(val === 'true');
    });
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      Appearance.setColorScheme(temaEscuro ? 'dark' : 'light');
    }
    AsyncStorage.setItem(TEMA_KEY, String(temaEscuro));
  }, [temaEscuro]);

  useEffect(() => {
    if (user) {
      setNome(user.fullName || user.nome || '');
      setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) fetchHistorico();
  }, [user?.id]);

  async function fetchHistorico() {
    try {
      const response = await api.get(`/cicatrizacao/usuario/${user?.id}/historico`);
      setHistorico(response.data || []);
    } catch {
      setHistorico([]);
    }
  }

  function abrirEditar() {
    setNomeEdit(nome);
    setEmailEdit(email);
    setModalVisivel(true);
  }

  async function salvarPerfil() {
    if (!nomeEdit.trim()) { 
      showAlert('Atenção', 'O nome não pode estar vazio.', [{ text: 'OK' }], 'warning'); 
      return; 
    }
    if (!/\S+@\S+\.\S+/.test(emailEdit)) { 
      showAlert('Atenção', 'Email inválido.', [{ text: 'OK' }], 'warning'); 
      return; 
    }
    try {
      await api.put(`/clientes/${user?.id}`, { fullName: nomeEdit.trim(), telefone: user?.telefone });
      setNome(nomeEdit.trim());
      setEmail(emailEdit.trim());
      setModalVisivel(false);
      showAlert('Perfil atualizado!', 'As tuas informações foram salvas.', [{ text: 'OK' }], 'checkmark-circle');
    } catch (err: any) {
      showAlert('Erro', err.response?.data?.message || 'Não foi possível salvar.', [{ text: 'OK' }], 'close-circle');
    }
  }

  function handlePrivacidade() {
    showAlert(
      'Privacidade', 
      'Os teus dados são armazenados localmente no dispositivo e nunca partilhados com terceiros.', 
      [{ text: 'OK' }], 
      'lock-closed'
    );
  }

  function handleAjuda() {
    showAlert(
      'Ajuda & Suporte',
      'Para suporte, entra em contacto:\n\n📧 suporte@inkflowcare.com\n\nVersão do app: 1.0.0',
      [{ text: 'OK' }],
      'help-circle'
    );
  }

  async function handleLogout() {
    showAlert('Sair da conta', 'Tens a certeza que queres sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
        }
      },
    ], 'log-out-outline');
  }

  const emCuidado = historico.filter((t) => t.status === 'ATIVA').length;
  const concluidas = historico.filter((t) => t.status === 'CONCLUIDA').length;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* TopAppBar - matches HTML: h-16 bg-[#0e0e0e]/90 border-b border-white/5 */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topBarBtn} onPress={() => router.push('/')} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color="#e63946" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>PERFIL</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Avatar & Info - matches HTML section */}
          <View style={styles.avatarSection}>
            {user?.fotoUrl || user?.profileImage ? (
              <Image
                source={{ uri: user.fotoUrl || user.profileImage }}
                style={styles.avatarImg}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarLetra}>{(nome || 'U')[0].toUpperCase()}</Text>
              </View>
            )}
            <Text style={styles.nome}>{nome || 'Usuário'}</Text>
            <Text style={styles.email}>{email || 'matheus@email.com'}</Text>
            <TouchableOpacity style={styles.editBtn} onPress={abrirEditar} activeOpacity={0.7}>
              <Text style={styles.editBtnText}>Editar perfil</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Card */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{xpTotal}</Text>
              <Text style={styles.statLabel}>XP TOTAL</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: '#FF4757' }]}>{stats.streakAtual}</Text>
              <Text style={styles.statLabel}>STREAK</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: '#22c55e' }]}>{stats.taxaConclusao}%</Text>
              <Text style={styles.statLabel}>CONCLUSÃO</Text>
            </View>
          </View>

          {/* Minhas tatuagens - matches HTML tattoo cards */}
          <Text style={styles.sectionTitle}>Minhas tatuagens</Text>
          <View style={styles.tatuagensContainer}>
            {historico.length === 0 ? (
              <Text style={{ color: '#666', fontSize: 13, textAlign: 'center', paddingVertical: 16 }}>Nenhuma tatuagem registrada.</Text>
            ) : historico.map((t) => (
              <TouchableOpacity key={t.id} style={styles.tatuagemCard} activeOpacity={0.7}>
                <View style={styles.tatuagemInfo}>
                  <Text style={styles.tatuagemNome}>{t.agendamento?.regiao || 'Tatuagem'}</Text>
                  <Text style={styles.tatuagemSub}>{t.agendamento?.artista?.nome || 'Artista'} · {t.dataInicio ? new Date(t.dataInicio).toLocaleDateString('pt-BR') : ''}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  t.status === 'ATIVA' ? styles.statusAtivo : styles.statusConcluido
                ]}>
                  <Text style={[
                    styles.statusText,
                    t.status === 'ATIVA' ? styles.statusAtivoText : styles.statusConcluidoText
                  ]}>
                    {t.status === 'ATIVA' ? 'ATIVO' : 'CONCLUÍDO'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Conquistas / Badges */}
          <View style={styles.badgesSectionHeader}>
            <Text style={styles.sectionTitle}>Conquistas</Text>
            <Text style={styles.badgesCounter}>{desbloqueadas}/{totalBadges}</Text>
          </View>
          <View style={styles.badgesGrid}>
            {badges.map((badge) => (
              <View key={badge.id} style={[styles.badgeCard, !badge.desbloqueado && styles.badgeCardLocked]}>
                <View style={[styles.badgeIconCircle, {
                  backgroundColor: badge.desbloqueado ? 'rgba(255,71,87,0.15)' : 'rgba(255,255,255,0.05)',
                }]}>
                  <Ionicons
                    name={badge.icone as any}
                    size={24}
                    color={badge.desbloqueado ? '#FF4757' : '#555'}
                  />
                </View>
                <Text style={[styles.badgeName, !badge.desbloqueado && { color: '#555' }]} numberOfLines={1}>
                  {badge.nome}
                </Text>
                {!badge.desbloqueado && badge.progresso !== undefined && (
                  <View style={styles.badgeProgressBar}>
                    <View style={[styles.badgeProgressFill, { width: `${badge.progresso}%` }]} />
                  </View>
                )}
                {badge.desbloqueado && (
                  <Ionicons name="checkmark-circle" size={14} color="#22c55e" />
                )}
              </View>
            ))}
          </View>

          {/* Configurações - matches HTML settings section */}
          <Text style={styles.sectionTitle}>Configurações</Text>
          <View style={styles.settingsContainer}>
            {/* Notificações toggle */}
            <TouchableOpacity
              style={[styles.settingItem, styles.settingBorder]}
              onPress={() => toggleAtivas()}
              activeOpacity={0.7}
            >
              <Text style={styles.settingText}>Notificações</Text>
              <View style={[styles.toggleTrack, notificacoes && styles.toggleTrackOn]}>
                <View style={[styles.toggleThumb, notificacoes && styles.toggleThumbOn]} />
              </View>
            </TouchableOpacity>

            {/* Tema escuro toggle */}
            <TouchableOpacity
              style={[styles.settingItem, styles.settingBorder]}
              onPress={() => setTemaEscuro(!temaEscuro)}
              activeOpacity={0.7}
            >
              <Text style={styles.settingText}>Tema escuro</Text>
              <View style={[styles.toggleTrack, temaEscuro && styles.toggleTrackOn]}>
                <View style={[styles.toggleThumb, temaEscuro && styles.toggleThumbOn]} />
              </View>
            </TouchableOpacity>

            {/* Privacidade */}
            <TouchableOpacity style={[styles.settingItem, styles.settingBorder]} onPress={handlePrivacidade} activeOpacity={0.7}>
              <Text style={styles.settingText}>Privacidade</Text>
              <Ionicons name="chevron-forward" size={20} color="#adaaaa" />
            </TouchableOpacity>

            {/* Ajuda */}
            <TouchableOpacity style={styles.settingItem} onPress={handleAjuda} activeOpacity={0.7}>
              <Text style={styles.settingText}>Ajuda</Text>
              <Ionicons name="chevron-forward" size={20} color="#adaaaa" />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
            <Text style={styles.logoutText}>Sair da conta</Text>
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
              <Ionicons name="person-outline" size={18} color="#adaaaa" style={{ marginRight: 10 }} />
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
              <Ionicons name="mail-outline" size={18} color="#adaaaa" style={{ marginRight: 10 }} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 120 },

  // TopAppBar: h-16 bg-[#0e0e0e]/90 border-b border-white/5
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 64,
    backgroundColor: 'rgba(14,14,14,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  topBarBtn: {
    width: 40, height: 40,
    justifyContent: 'center', alignItems: 'center',
    borderRadius: 20,
  },
  // font-headline font-bold text-lg tracking-tighter uppercase
  topBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  },

  // Avatar section - centered
  avatarSection: { alignItems: 'center', marginTop: 32, marginBottom: 32 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,71,87,0.3)',
    borderWidth: 2, borderColor: '#FF4757',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  avatarImg: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 2, borderColor: '#FF4757',
    marginBottom: 16,
  },
  avatarLetra: { fontSize: 32, fontWeight: '700', color: '#FF4757' },
  nome: { fontSize: 20, fontWeight: '700', color: '#fff', letterSpacing: -0.5 },
  // text-[#999] text-[13px] mb-4
  email: { fontSize: 13, color: '#999', marginTop: 4, marginBottom: 16 },
  // border border-[#FF4757] rounded-full px-6 py-2
  editBtn: {
    paddingHorizontal: 24, paddingVertical: 8,
    borderWidth: 1, borderColor: '#FF4757',
    borderRadius: 20, backgroundColor: 'transparent',
  },
  // text-[#FF4757] text-[13px] font-semibold
  editBtnText: { color: '#FF4757', fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },

  // Stats Card: bg-surface-container-highest rounded-xl p-6 border border-white/5
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 32,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: 4 },
  statLabel: {
    fontSize: 11, color: '#999',
    textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700',
  },
  // w-[1px] h-10 bg-surface-bright
  statDivider: { width: 1, height: 40, backgroundColor: '#2c2c2c' },

  sectionTitle: {
    fontSize: 18, fontWeight: '800', color: '#fff',
    marginBottom: 16, letterSpacing: -0.5,
  },

  // Tattoo cards container
  tatuagensContainer: { gap: 12, marginBottom: 32 },
  tatuagemCard: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#262626',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12, padding: 18,
  },
  tatuagemInfo: { flex: 1 },
  tatuagemNome: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 4 },
  tatuagemSub: { fontSize: 13, color: '#999' },
  statusBadge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  statusAtivo: { backgroundColor: '#FF4757' },
  statusConcluido: { backgroundColor: '#22c55e' },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  statusAtivoText: { color: '#fff' },
  statusConcluidoText: { color: '#fff' },

  // Settings: bg-surface-container-highest rounded-xl border border-white/5
  settingsContainer: {
    backgroundColor: '#262626',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 18,
  },
  settingBorder: { borderBottomWidth: 1, borderBottomColor: '#2c2c2c' },
  settingText: { fontSize: 16, fontWeight: '500', color: '#fff' },

  // Custom toggle styles matching reference
  toggleTrack: {
    width: 48, height: 28, borderRadius: 14,
    backgroundColor: '#333',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleTrackOn: {
    backgroundColor: '#ff8d8c',
  },
  toggleThumb: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#fff',
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },

  logoutBtn: {
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#FF4757',
    borderRadius: 12, paddingVertical: 16,
    backgroundColor: 'rgba(255,71,87,0.08)',
    marginTop: 16,
  },
  logoutText: { color: '#FF4757', fontSize: 16, fontWeight: '700' },

  // Badges
  badgesSectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16,
  },
  badgesCounter: { fontSize: 13, color: '#FF4757', fontWeight: '600' },
  badgesGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
    marginBottom: 32,
  },
  badgeCard: {
    width: '31%', alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12, padding: 14, gap: 8,
  },
  badgeCardLocked: { opacity: 0.6 },
  badgeIconCircle: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeName: {
    fontSize: 11, fontWeight: '600', color: '#fff',
    textAlign: 'center',
  },
  badgeProgressBar: {
    width: '100%', height: 3, backgroundColor: '#333',
    borderRadius: 1.5, overflow: 'hidden',
  },
  badgeProgressFill: {
    height: 3, backgroundColor: '#FF4757', borderRadius: 1.5,
  },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContainer: {
    backgroundColor: '#1a1919',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
    borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitulo: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalLabel: { fontSize: 12, color: '#adaaaa', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  modalInput: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12, paddingHorizontal: 14, height: 50, marginBottom: 16,
  },
  modalInputText: { flex: 1, color: '#fff', fontSize: 15 },
  modalSalvarBtn: {
    backgroundColor: '#ff8d8c', borderRadius: 12, height: 50,
    justifyContent: 'center', alignItems: 'center', marginTop: 8,
  },
  modalSalvarText: { color: '#000', fontSize: 16, fontWeight: '700' },
});
