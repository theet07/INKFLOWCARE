import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  logado: boolean;
  login: (email: string, senha: string) => boolean;
  loginDemo: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const USUARIOS = [
  { email: 'joao@email.com', senha: '123456' },
  { email: 'demo@inkflow.com', senha: 'demo123' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [logado, setLogado] = useState(false);

  function login(email: string, senha: string): boolean {
    const encontrado = USUARIOS.find(
      (u) => u.email === email.toLowerCase().trim() && u.senha === senha
    );
    if (encontrado) { setLogado(true); return true; }
    return false;
  }

  function loginDemo() { setLogado(true); }
  function logout() { setLogado(false); }

  return (
    <AuthContext.Provider value={{ logado, login, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
