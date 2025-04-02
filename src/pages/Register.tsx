import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";

const Register = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario || !senha || !confirmSenha) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    if (senha !== confirmSenha) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    if (senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (senha.length > 20) {
      toast.error("A senha deve ter no máximo 20 caracteres");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Registrar no backend
      await axios.post('http://localhost:3000/api/auth/register', {
        usuario,
        senha
      });
      
      // Registrar no contexto de autenticação
      await register(usuario, senha);
      
      toast.success("Registro realizado com sucesso");
      navigate("/dashboard");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Erro ao registrar. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Criar conta</h2>
          <p className="text-muted-foreground mt-2">
            Preencha os campos abaixo para se registrar
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usuario">Usuário</Label>
              <Input
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Nome de usuário"
                className="input-focus-ring h-11"
                autoFocus
                maxLength={16}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                className="input-focus-ring h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmSenha">Confirmar senha</Label>
              <Input
                id="confirmSenha"
                type="password"
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
                placeholder="Confirme sua senha"
                className="input-focus-ring h-11"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 text-base mt-2 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Registrar"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
