
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface RevenueCardProps {
  value: number;
  trend: string;
  icon: LucideIcon;
  iconColor: string;
  borderColor: string;
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const RevenueCard = ({
  value,
  trend,
  icon: Icon,
  iconColor,
  borderColor,
}: RevenueCardProps) => {
  return (
    <Card className={`transition-all duration-300 hover:shadow-md border-l-4 ${borderColor}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Faturamento</CardTitle>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{formatCurrency(value)}</div>
        <p className="text-xs text-muted-foreground">{trend}</p>
      </CardContent>
    </Card>
  );
};

export default RevenueCard;
