import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/auth';

const usuario = {
  nome: 'João Silva',
  email: 'joao@email.com',
  tatuagens: 3,
  emCuidado: 1,
  concluidas: 2,
};

const historico = [
  { id: 1, nome: 'Dragão nas costas', artista: 'Carlos Ink', data: '10/07/2025', status: 'em_cuidado' },
  { id: 2, nome: 'Rosa no braço', artista: 'Ana Tattoo', data: '15/03/2025', status: 'concluida' },
  { id: 3, nome: 'Mandala na perna', artista: 'Pedro Art', data: '02/11/2024', status: 'concluida' },
];

const opcoes = [
  { icone: 'notifications-outline', titulo: 'Notificações', sub: 'Lembretes de cuidados' },
  { icone: 'moon-outline', titulo: 'Tema escuro', sub: 'Ativado' },
  { icone: 'shield-outline', titulo: 'Privacidade', sub: 'Gerenciar dados' },
  { icone: 'help-circle-outline', titulo: 'Ajuda', sub: 'FAQ e suporte' },
];

export default function PerfilScreen() {
  const { logout } = useAuth();
  return (
    <LinearGradient colors={['#000000', '#0a0a2e', '#0d1b4b']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Avatar e nome */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetra}>{usuario.nome[0]}</Text>
            </View>
            <Text style={styles.nome}>{usuario.nome}</Text>
            <Text style={styles.email}>{usuario.email}</Text>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="pencil-outline" size={14} color="#FF0000" />
              <Text style={styles.editBtnText}>Editar perfil</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{usuario.tatuagens}</Text>
              <Text style={styles.statLabel}>Tatuagens</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: '#FF0000' }]}>{usuario.emCuidado}</Text>
              <Text style={styles.statLabel}>Em cuidado</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: '#00AA44' }]}>{usuario.concluidas}</Text>
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
              <View style={[
                styles.statusBadge,
                t.status === 'em_cuidado' ? styles.statusAtivo : styles.statusConcluido,
              ]}>
                <Text style={[
                  styles.statusText,
                  t.status === 'em_cuidado' ? styles.statusAtivoText : styles.statusConcluidoText,
                ]}>
                  {t.status === 'em_cuidado' ? 'Ativo' : 'Concluído'}
                </Text>
              </View>
            </View>
          ))}

          {/* Configurações */}
          <Text style={styles.sectionTitle}>Configurações</Text>
          <View style={styles.opcoesContainer}>
            {opcoes.map((o, i) => (
              <TouchableOpacity key={i} style={[styles.opcaoItem, i < opcoes.length - 1 && styles.opcaoBorder]} activeOpacity={0.7}>
                <View style={styles.opcaoLeft}>
                  <View style={styles.opcaoIcone}>
                    <Ionicons name={o.icone as any} size={18} color="#FF0000" />
                  </View>
                  <View>
                    <Text style={styles.opcaoTitulo}>{o.titulo}</Text>
                    <Text style={styles.opcaoSub}>{o.sub}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#555" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Sair */}
          <TouchableOpacity style={styles.sairBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={18} color="#FF0000" />
            <Text style={styles.sairText}>Sair da conta</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
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
});
