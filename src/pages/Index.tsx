
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Mithra</h1>
        <p className="text-xl text-gray-600">Sistema de gestão de pedidos</p>
        <div className="space-x-4">
          <Button onClick={() => navigate('/login')}>Login</Button>
          <Button onClick={() => navigate('/register')} variant="outline">Registrar</Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
