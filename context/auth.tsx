import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

type User = {
  id: number;
  email: string;
  nome: string;
  fullName?: string;
  telefone?: string;
  profileImage?: string;
};

type AuthContextType = {
  logado: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [logado, setLogado] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifica se já tem token salvo ao iniciar o app
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = await AsyncStorage.getItem('@inkflow:token');
      const userJson = await AsyncStorage.getItem('@inkflow:user');
      
      if (token && userJson) {
        setUser(JSON.parse(userJson));
        setLogado(true);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, senha: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.post('/auth/login', {
        email: email.toLowerCase().trim(),
        password: senha,
      });

      if (response.data.success && response.data.token) {
        const { token, user: userData } = response.data;
        
        // Salva token e user no AsyncStorage
        await AsyncStorage.setItem('@inkflow:token', token);
        await AsyncStorage.setItem('@inkflow:user', JSON.stringify(userData));
        
        setUser(userData);
        setLogado(true);
        
        return { success: true };
      }
      
      return { success: false, message: 'Credenciais inválidas' };
    } catch (error: any) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao fazer login. Tente novamente.' 
      };
    }
  }

  async function logout() {
    try {
      // Limpa AsyncStorage
      await AsyncStorage.multiRemove(['@inkflow:token', '@inkflow:user']);
      
      setUser(null);
      setLogado(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ logado, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
