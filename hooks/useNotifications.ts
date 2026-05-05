import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIF_PREFS_KEY = '@inkflow:notif_prefs';

export interface NotifPreferences {
  ativas: boolean;
  horarioManha: string;
  horarioTarde: string;
  horarioNoite: string;
}

const DEFAULT_PREFS: NotifPreferences = {
  ativas: true,
  horarioManha: '08:00',
  horarioTarde: '14:00',
  horarioNoite: '21:00',
};

export function useNotifications() {
  const [permissao, setPermissao] = useState(Platform.OS === 'web');
  const [prefs, setPrefs] = useState<NotifPreferences>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPrefs();
  }, []);

  async function carregarPrefs() {
    try {
      const stored = await AsyncStorage.getItem(NOTIF_PREFS_KEY);
      if (stored) {
        setPrefs(JSON.parse(stored));
      }
    } catch (e) {
      console.error('[NOTIF] Erro ao carregar prefs:', e);
    } finally {
      setLoading(false);
    }
  }

  async function salvarPrefs(novasPrefs: NotifPreferences) {
    try {
      setPrefs(novasPrefs);
      await AsyncStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(novasPrefs));
    } catch (e) {
      console.error('[NOTIF] Erro ao salvar prefs:', e);
    }
  }

  const toggleAtivas = useCallback(async () => {
    const novasPrefs = { ...prefs, ativas: !prefs.ativas };
    await salvarPrefs(novasPrefs);
  }, [prefs]);

  async function atualizarHorario(
    periodo: 'horarioManha' | 'horarioTarde' | 'horarioNoite',
    horario: string
  ) {
    const novasPrefs = { ...prefs, [periodo]: horario };
    await salvarPrefs(novasPrefs);
  }

  async function cancelarTodas() {
    console.log('[NOTIF] cancelarTodas (no-op na web)');
  }

  return {
    permissao,
    prefs,
    loading,
    toggleAtivas,
    atualizarHorario,
    cancelarTodas,
  };
}
