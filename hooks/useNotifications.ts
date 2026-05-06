import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import api from '@/services/api';

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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function parseHorario(horario: string): { hour: number; minute: number } {
  const [h, m] = horario.split(':').map(Number);
  return { hour: h, minute: m };
}

async function agendarNotificacoes(prefs: NotifPreferences) {
  if (Platform.OS === 'web') return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!prefs.ativas) return;

  const periodos = [
    { horario: prefs.horarioManha, titulo: 'Cuidados da manhã ☀️', corpo: 'Hora de lavar e hidratar sua tatuagem!' },
    { horario: prefs.horarioTarde, titulo: 'Cuidados da tarde 🌤️', corpo: 'Não esqueça de reaplicar a pomada!' },
    { horario: prefs.horarioNoite, titulo: 'Cuidados da noite 🌙', corpo: 'Último cuidado do dia antes de dormir.' },
  ];

  for (const p of periodos) {
    const { hour, minute } = parseHorario(p.horario);
    await Notifications.scheduleNotificationAsync({
      content: { title: p.titulo, body: p.corpo, sound: true },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute },
    });
  }
}

export function useNotifications(usuarioId?: number) {
  const [permissao, setPermissao] = useState(Platform.OS === 'web');
  const [prefs, setPrefs] = useState<NotifPreferences>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    solicitarPermissao();
    carregarPrefs();
  }, [usuarioId]);

  async function solicitarPermissao() {
    if (Platform.OS === 'web') return;
    const { status } = await Notifications.requestPermissionsAsync();
    setPermissao(status === 'granted');
  }

  async function carregarPrefs() {
    if (usuarioId) {
      try {
        const response = await api.get(`/notificacoes/usuario/${usuarioId}`);
        if (response.data) {
          const backendPrefs: NotifPreferences = {
            ativas: response.data.notificacoesAtivas ?? true,
            horarioManha: response.data.horarioManha ?? '08:00',
            horarioTarde: response.data.horarioTarde ?? '14:00',
            horarioNoite: response.data.horarioNoite ?? '21:00',
          };
          setPrefs(backendPrefs);
          await AsyncStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(backendPrefs));
          await agendarNotificacoes(backendPrefs);
          setLoading(false);
          return;
        }
      } catch {
        console.log('[NOTIF] Backend indisponível, usando cache local');
      }
    }

    try {
      const stored = await AsyncStorage.getItem(NOTIF_PREFS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPrefs(parsed);
        await agendarNotificacoes(parsed);
      }
    } catch (e) {
      console.error('[NOTIF] Erro ao carregar prefs:', e);
    } finally {
      setLoading(false);
    }
  }

  async function salvarPrefs(novasPrefs: NotifPreferences) {
    setPrefs(novasPrefs);
    await AsyncStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(novasPrefs));
    await agendarNotificacoes(novasPrefs);

    if (usuarioId) {
      try {
        await api.put(`/notificacoes/usuario/${usuarioId}`, {
          notificacoesAtivas: novasPrefs.ativas,
          horarioManha: novasPrefs.horarioManha,
          horarioTarde: novasPrefs.horarioTarde,
          horarioNoite: novasPrefs.horarioNoite,
        });
      } catch {
        console.log('[NOTIF] Erro ao sincronizar com backend (salvo localmente)');
      }
    }
  }

  const toggleAtivas = useCallback(async () => {
    await salvarPrefs({ ...prefs, ativas: !prefs.ativas });
  }, [prefs, usuarioId]);

  async function atualizarHorario(
    periodo: 'horarioManha' | 'horarioTarde' | 'horarioNoite',
    horario: string
  ) {
    await salvarPrefs({ ...prefs, [periodo]: horario });
  }

  async function cancelarTodas() {
    if (Platform.OS === 'web') return;
    await Notifications.cancelAllScheduledNotificationsAsync();
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
