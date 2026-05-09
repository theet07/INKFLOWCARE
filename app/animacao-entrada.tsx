import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth';

const PARTICLES_COUNT = 12;
const COLORS = ['#FF4757', '#ff8d8c', '#ffffff'];

export default function AnimacaoEntrada() {
  const router = useRouter();
  const { logado, loading } = useAuth();
  
  const logadoRef = useRef(logado);
  const loadingRef = useRef(loading);

  useEffect(() => {
    logadoRef.current = logado;
    loadingRef.current = loading;
  }, [logado, loading]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const particlesAnim = useRef(new Animated.Value(0)).current;
  const screenFadeAnim = useRef(new Animated.Value(1)).current;

  // Gerar trajetórias aleatórias para as partículas
  const particles = useRef(
    Array.from({ length: PARTICLES_COUNT }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 80;
      return {
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 8 + Math.random() * 10,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
      };
    })
  ).current;

  useEffect(() => {
    // Fase 1 & 2: Fade e Bounce
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 400,
        easing: Easing.elastic(1.5),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Fase 3: Partículas (600ms → 1200ms)
    setTimeout(() => {
      Animated.timing(particlesAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, 600);

    // Fase 4: Saída (1200ms → 1600ms)
    setTimeout(() => {
      Animated.timing(screenFadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        // Redireciona com base na autenticação
        if (!loadingRef.current) {
          if (logadoRef.current) {
            router.replace('/(tabs)');
          } else {
            router.replace('/login');
          }
        } else {
          // Se ainda estiver carregando, espera um pouco mais
          setTimeout(() => {
            if (logadoRef.current) {
              router.replace('/(tabs)');
            } else {
              router.replace('/login');
            }
          }, 500);
        }
      });
    }, 1200);
  }, []); // Remove as dependências para rodar a animação apenas UMA vez

  return (
    <Animated.View style={[styles.container, { opacity: screenFadeAnim }]}>
      {particles.map((p, i) => {
        const translateX = particlesAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, p.tx],
        });
        const translateY = particlesAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, p.ty],
        });
        const opacity = particlesAnim.interpolate({
          inputRange: [0, 0.7, 1],
          outputRange: [1, 1, 0],
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                opacity,
                transform: [{ translateX }, { translateY }],
              },
            ]}
          />
        );
      })}

      <Animated.Image
        source={require('../assets/images/FAVORICON-INKFLOW-WHITE.png')}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    zIndex: 10,
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
  },
});
