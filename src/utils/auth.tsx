import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  USUARIO: string;
  SENHA: string;
  GRAU: string;
  LOJAS: string;
  MODULO: string;
  NOME: string;
  BANCOS: string;
  LIMICP: string;
  CCUSTO: string;
  ARMAZEN: string;
  ARMDES: string;
  GRUPOS: string;
  COMPRADOR: string;
  EMAIL: string;
  NVL_CAIXA: string;
  GESTOR: string;
  COMISSAO: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => Promise<void>;
  register: (usuario: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      // Clear potentially corrupted data
      localStorage.removeItem('user');
    } finally {
      // Always set loading to false to prevent UI from being stuck
      setLoading(false);
    }
  }, []);

  const login = async (userData: User) => {
    setLoading(true);
    try {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (usuario: string, senha: string) => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, senha }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao registrar usuário');
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Alterando a exportação do hook useAuth de uma função nomeada para uma constante
// para resolver o problema de compatibilidade com o Fast Refresh
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
