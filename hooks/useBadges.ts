import { useState, useEffect } from 'react';
import api from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Badge {
  id: number;
  nome: string;
  descricao: string;
  icone: string;
  categoria: 'STREAK' | 'XP' | 'CONCLUSAO' | 'ESPECIAL';
  desbloqueado: boolean;
  dataDesbloqueio?: string;
  progresso?: number;
}

// Badges mockados para visualização quando o backend não retorna dados
const MOCK_BADGES: Badge[] = [
  { id: 1, nome: 'Primeiro Passo', descricao: 'Complete o primeiro dia de cuidados', icone: 'footsteps', categoria: 'CONCLUSAO', desbloqueado: true, dataDesbloqueio: '2025-07-10', progresso: 100 },
  { id: 2, nome: 'Semana Completa', descricao: 'Mantenha um streak de 7 dias', icone: 'flame', categoria: 'STREAK', desbloqueado: true, dataDesbloqueio: '2025-07-17', progresso: 100 },
  { id: 3, nome: 'Duas Semanas', descricao: 'Mantenha um streak de 14 dias', icone: 'flash', categoria: 'STREAK', desbloqueado: false, progresso: 64 },
  { id: 4, nome: 'Mestre dos Cuidados', descricao: 'Complete uma cicatrização inteira', icone: 'trophy', categoria: 'CONCLUSAO', desbloqueado: false, progresso: 60 },
  { id: 5, nome: 'Perfeição', descricao: '100% em todos os dias completados', icone: 'diamond', categoria: 'ESPECIAL', desbloqueado: false, progresso: 45 },
  { id: 6, nome: 'Sabedoria', descricao: 'Acerte todos os quizzes disponíveis', icone: 'bulb', categoria: 'XP', desbloqueado: false, progresso: 0 },
  { id: 7, nome: 'Inabalável', descricao: 'Streak de 21+ dias consecutivos', icone: 'shield-checkmark', categoria: 'STREAK', desbloqueado: false, progresso: 30 },
  { id: 8, nome: 'Colecionador', descricao: 'Complete 3 ou mais cicatrizações', icone: 'library', categoria: 'CONCLUSAO', desbloqueado: false, progresso: 33 },
  { id: 9, nome: 'Hidratação Pro', descricao: 'Aplique pomada todos os dias por 2 semanas', icone: 'water', categoria: 'ESPECIAL', desbloqueado: true, dataDesbloqueio: '2025-07-20', progresso: 100 },
];

export function useBadges(usuarioId?: number) {
  const [badges, setBadges] = useState<Badge[]>(MOCK_BADGES);
  const [loading, setLoading] = useState(true);
  const [novasBadges, setNovasBadges] = useState<Badge[]>([]);

  useEffect(() => {
    fetchBadges();
  }, [usuarioId]);

  async function fetchBadges() {
    if (!usuarioId) {
      setBadges(MOCK_BADGES);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/badges/usuario/${usuarioId}`);
      if (response.data && response.data.length > 0) {
        // Verificar se há novas badges desbloqueadas
        const storedKey = `@inkflow:badges_seen_${usuarioId}`;
        const seenIds = JSON.parse(await AsyncStorage.getItem(storedKey) || '[]');
        
        const novas = response.data.filter(
          (b: Badge) => b.desbloqueado && !seenIds.includes(b.id)
        );
        
        if (novas.length > 0) {
          setNovasBadges(novas);
          const allSeenIds = [...seenIds, ...novas.map((b: Badge) => b.id)];
          await AsyncStorage.setItem(storedKey, JSON.stringify(allSeenIds));
        }

        setBadges(response.data);
      }
    } catch (error) {
      console.log('[BADGES] Usando dados mockados:', error);
      setBadges(MOCK_BADGES);
    } finally {
      setLoading(false);
    }
  }

  function limparNovasBadges() {
    setNovasBadges([]);
  }

  const desbloqueadas = badges.filter(b => b.desbloqueado).length;
  const totalBadges = badges.length;

  return {
    badges,
    loading,
    novasBadges,
    limparNovasBadges,
    desbloqueadas,
    totalBadges,
    refresh: fetchBadges,
  };
}
