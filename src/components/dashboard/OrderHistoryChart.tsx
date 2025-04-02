
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface OrderHistoryData {
  date: string;
  pedidosFaturados: number;
  pedidosPendentes: number;
  pedidosPerdidos: number;
}

interface OrderHistoryChartProps {
  data: OrderHistoryData[];
}

const OrderHistoryChart = ({ data }: OrderHistoryChartProps) => {
  // Check if data is empty or all values are zero
  const hasValidData = data.length > 0 && data.some(item => 
    item.pedidosFaturados > 0 || item.pedidosPendentes > 0 || item.pedidosPerdidos > 0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Pedidos</CardTitle>
        <CardDescription>Últimos 7 dias</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {!hasValidData ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Nenhum dado disponível para exibição</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="pedidosFaturados" 
                stroke="#4f46e5" 
                strokeWidth={2}
                name="Faturados"
              />
              <Line 
                type="monotone" 
                dataKey="pedidosPendentes" 
                stroke="#f97316" 
                strokeWidth={2}
                name="Pendentes"
              />
              <Line 
                type="monotone" 
                dataKey="pedidosPerdidos" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Perdidos"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderHistoryChart;
