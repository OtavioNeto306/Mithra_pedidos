import { Link } from 'react-router-dom';
import { Shield, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '@/utils/auth';

const Navigation = () => {
  const { user } = useAuth();

  return (
    <nav className="flex flex-col gap-1">
      <Link
        to="/dashboard"
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
      >
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </Link>

      {user?.GRAU === 'S' && (
        <Link
          to="/permissions"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
        >
          <Shield className="h-4 w-4" />
          Permissões
        </Link>
      )}

      <Link
        to="/settings"
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
      >
        <Settings className="h-4 w-4" />
        Configurações
      </Link>
    </nav>
  );
};

export default Navigation; 