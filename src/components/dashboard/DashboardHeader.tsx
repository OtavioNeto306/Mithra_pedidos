
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/utils/auth";

interface DashboardHeaderProps {
  user: { name?: string } | null;
}

const DashboardHeader = ({ user }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bem-vindo, {user?.name}</h1>
        <p className="text-muted-foreground">Gestão de Pedidos</p>
      </div>
      <div className="mt-4 md:mt-0">
        <Badge variant="outline" className="bg-primary/10 text-primary font-medium py-1.5">
          Mithra Ativo
        </Badge>
      </div>
    </div>
  );
};

export default DashboardHeader;
