import React, { createContext, useContext, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  buttons: AlertButton[];
  icon?: keyof typeof Ionicons.glyphMap;
}

interface AlertContextData {
  showAlert: (title: string, message: string, buttons?: AlertButton[], icon?: keyof typeof Ionicons.glyphMap) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextData>({} as AlertContextData);

export function CustomAlertProvider({ children }: { children: React.ReactNode }) {
  const [alertState, setAlertState] = useState<AlertState>({
    visible: false,
    title: '',
    message: '',
    buttons: [],
    icon: 'information-circle-outline'
  });

  const showAlert = (
    title: string,
    message: string,
    buttons: AlertButton[] = [{ text: 'OK' }],
    icon: keyof typeof Ionicons.glyphMap = 'information-circle-outline'
  ) => {
    setAlertState({
      visible: true,
      title,
      message,
      buttons,
      icon
    });
  };

  const hideAlert = () => {
    setAlertState(prev => ({ ...prev, visible: false }));
  };

  const handleButtonPress = (button: AlertButton) => {
    hideAlert();
    // Aguarda o modal começar a fechar para chamar o callback,
    // evitando conflitos se o callback abrir outro alert.
    setTimeout(() => {
      if (button.onPress) {
        button.onPress();
      }
    }, 100);
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}

      <Modal
        animationType="fade"
        transparent={true}
        visible={alertState.visible}
        onRequestClose={hideAlert}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={[
              styles.iconContainer,
              alertState.buttons.some(b => b.style === 'destructive') ? styles.iconContainerDestructive : styles.iconContainerDefault
            ]}>
              <Ionicons 
                name={alertState.icon || 'information-circle-outline'} 
                size={32} 
                color={alertState.buttons.some(b => b.style === 'destructive') ? '#ff4444' : '#ff8d8c'} 
              />
            </View>

            <Text style={styles.title}>{alertState.title}</Text>
            <Text style={styles.message}>{alertState.message}</Text>

            <View style={styles.buttonsContainer}>
              {alertState.buttons.map((btn, index) => {
                const isCancel = btn.style === 'cancel';
                const isDestructive = btn.style === 'destructive';
                
                return (
                  <Pressable
                    key={index}
                    style={[
                      styles.button,
                      alertState.buttons.length === 2 && styles.buttonHalf,
                      isCancel && styles.buttonCancel,
                      isDestructive && styles.buttonDestructive,
                      !isCancel && !isDestructive && styles.buttonDefault
                    ]}
                    onPress={() => handleButtonPress(btn)}
                  >
                    <Text style={[
                      styles.buttonText,
                      isCancel && styles.buttonTextCancel,
                      isDestructive && styles.buttonTextDestructive,
                      !isCancel && !isDestructive && styles.buttonTextDefault
                    ]}>
                      {btn.text}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
}

export const useCustomAlert = () => useContext(AlertContext);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#131313',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#262626',
  },
  iconContainer: {
    width: 64, height: 64, borderRadius: 32,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  iconContainerDefault: {
    backgroundColor: 'rgba(255, 141, 140, 0.1)',
  },
  iconContainerDestructive: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
  },
  title: {
    fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 12, textAlign: 'center'
  },
  message: {
    fontSize: 15, color: '#adaaaa', textAlign: 'center', lineHeight: 22, marginBottom: 28,
  },
  buttonsContainer: {
    flexDirection: 'row', gap: 12, width: '100%', justifyContent: 'center'
  },
  button: {
    height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flex: 1,
  },
  buttonHalf: {
    flex: 1,
  },
  buttonCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1, borderColor: '#333',
  },
  buttonDestructive: {
    backgroundColor: 'transparent',
    borderWidth: 1, borderColor: '#ff4444',
  },
  buttonDefault: {
    backgroundColor: '#ff8d8c',
  },
  buttonText: {
    fontSize: 15, fontWeight: '600',
  },
  buttonTextCancel: {
    color: '#fff',
  },
  buttonTextDestructive: {
    color: '#ff4444', fontWeight: '700',
  },
  buttonTextDefault: {
    color: '#0e0e0e', fontWeight: '700',
  },
});
