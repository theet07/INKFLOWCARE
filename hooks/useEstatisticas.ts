import { useState, useEffect } from 'react';
import api from '@/services/api';

export interface Estatisticas {
  xpPorDia: { dia: number; xp: number }[];
  streakAtual: number;
  melhorStreak: number;
  diasCompletos: number;
  totalDias: number;
  taxaConclusao: number;
}

const MOCK_STATS: Estatisticas = {
  xpPorDia: [
    { dia: 1, xp: 100 }, { dia: 2, xp: 85 }, { dia: 3, xp: 95 },
    { dia: 4, xp: 70 }, { dia: 5, xp: 110 }, { dia: 6, xp: 90 },
    { dia: 7, xp: 130 }, { dia: 8, xp: 75 }, { dia: 9, xp: 100 },
    { dia: 10, xp: 120 }, { dia: 11, xp: 60 }, { dia: 12, xp: 95 },
    { dia: 13, xp: 105 }, { dia: 14, xp: 140 }, { dia: 15, xp: 80 },
    { dia: 16, xp: 110 }, { dia: 17, xp: 90 }, { dia: 18, xp: 50 },
  ],
  streakAtual: 5,
  melhorStreak: 12,
  diasCompletos: 15,
  totalDias: 30,
  taxaConclusao: 72,
};

export function useEstatisticas(cicatrizacaoId?: number) {
  const [stats, setStats] = useState<Estatisticas>(MOCK_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [cicatrizacaoId]);

  async function fetchStats() {
    if (!cicatrizacaoId) {
      setStats(MOCK_STATS);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/estatisticas/cicatrizacao/${cicatrizacaoId}`);
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.log('[STATS] Usando dados mockados:', error);
      setStats(MOCK_STATS);
    } finally {
      setLoading(false);
    }
  }

  const xpTotal = stats.xpPorDia.reduce((sum, d) => sum + d.xp, 0);
  const xpMedio = stats.xpPorDia.length > 0
    ? Math.round(xpTotal / stats.xpPorDia.length)
    : 0;

  return {
    stats,
    loading,
    xpTotal,
    xpMedio,
    refresh: fetchStats,
  };
}
