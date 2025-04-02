import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario || !senha) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Iniciando requisição de login...');
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ usuario, senha }),
      });

      console.log('Status da resposta:', response.status);
      console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Texto da resposta:', responseText);

      let data;
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch (e) {
        console.error('Erro ao fazer parse do JSON:', e);
        throw new Error('Resposta inválida do servidor');
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Erro ao fazer login');
      }

      if (!data) {
        throw new Error('Resposta vazia do servidor');
      }

      await login(data);
      toast.success("Login realizado com sucesso");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Bem-vindo(a)</h2>
          <p className="text-muted-foreground mt-2">
            Faça login para acessar o sistema
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="usuario">Usuário</Label>
              <Input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Nome de usuário"
                className="input-focus-ring h-11"
                autoFocus
                maxLength={16}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="senha">Senha</Label>
              </div>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="input-focus-ring h-11"
                maxLength={60}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 text-base transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          

        </div>
      </div>
    </div>
  );
};

export default Login;
