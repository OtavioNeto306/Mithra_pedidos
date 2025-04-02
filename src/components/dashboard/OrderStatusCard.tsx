
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface OrderStatusCardProps {
  title: string;
  value: number;
  trend: string;
  icon: LucideIcon;
  iconColor: string;
  borderColor: string;
}

const OrderStatusCard = ({
  title,
  value,
  trend,
  icon: Icon,
  iconColor,
  borderColor,
}: OrderStatusCardProps) => {
  return (
    <Card className={`transition-all duration-300 hover:shadow-md border-l-4 ${borderColor}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{trend}</p>
      </CardContent>
    </Card>
  );
};

export default OrderStatusCard;
