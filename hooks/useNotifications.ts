import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIF_PREFS_KEY = '@inkflow:notif_prefs';

// Configurar como as notificações aparecem quando o app está em foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotifPreferences {
  ativas: boolean;
  horarioManha: string;  // "08:00"
  horarioTarde: string;  // "14:00"
  horarioNoite: string;  // "21:00"
}

const DEFAULT_PREFS: NotifPreferences = {
  ativas: true,
  horarioManha: '08:00',
  horarioTarde: '14:00',
  horarioNoite: '21:00',
};

export function useNotifications() {
  const [permissao, setPermissao] = useState(false);
  const [prefs, setPrefs] = useState<NotifPreferences>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);
  const notifListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    carregarPrefs();
    registrarPermissoes();

    // Listeners
    notifListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('[NOTIF] Recebida:', notification.request.content.title);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('[NOTIF] Interação:', response.notification.request.content.title);
    });

    return () => {
      if (notifListener.current) Notifications.removeNotificationSubscription(notifListener.current);
      if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registrarPermissoes() {
    if (Platform.OS === 'web') {
      setPermissao(true);
      return;
    }

    if (!Device.isDevice) {
      console.log('[NOTIF] Notificações requerem dispositivo físico');
      setPermissao(false);
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    setPermissao(finalStatus === 'granted');

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('cuidados', {
        name: 'Cuidados com Tatuagem',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF4757',
      });
    }
  }

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

      if (novasPrefs.ativas) {
        await agendarNotificacoes(novasPrefs);
      } else {
        await cancelarTodas();
      }
    } catch (e) {
      console.error('[NOTIF] Erro ao salvar prefs:', e);
    }
  }

  async function toggleAtivas() {
    const novasPrefs = { ...prefs, ativas: !prefs.ativas };
    await salvarPrefs(novasPrefs);
  }

  async function atualizarHorario(periodo: 'horarioManha' | 'horarioTarde' | 'horarioNoite', horario: string) {
    const novasPrefs = { ...prefs, [periodo]: horario };
    await salvarPrefs(novasPrefs);
  }

  async function agendarNotificacoes(p: NotifPreferences) {
    // Cancela todas antes de reagendar
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (Platform.OS === 'web') return;

    const horarios = [
      { hora: p.horarioManha, titulo: '☀️ Bom dia! Hora dos cuidados matinais', corpo: 'Lave e hidrate sua tatuagem para começar o dia bem.' },
      { hora: p.horarioTarde, titulo: '🌤️ Lembrete da tarde', corpo: 'Não esqueça de aplicar a pomada cicatrizante.' },
      { hora: p.horarioNoite, titulo: '🌙 Cuidados noturnos', corpo: 'Lave a tatuagem e aplique pomada antes de dormir.' },
    ];

    for (const h of horarios) {
      const [hour, minute] = h.hora.split(':').map(Number);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: h.titulo,
          body: h.corpo,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
          channelId: 'cuidados',
        },
      });
    }

    console.log('[NOTIF] 3 notificações diárias agendadas');
  }

  async function cancelarTodas() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('[NOTIF] Todas as notificações canceladas');
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
