
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface OrderStatusData {
  name: string;
  value: number;
}

interface OrderStatusPieChartProps {
  data: OrderStatusData[];
  colors: string[];
}

const OrderStatusPieChart = ({ data, colors }: OrderStatusPieChartProps) => {
  // Check if data is empty or all values are zero
  const hasValidData = data.length > 0 && data.some(item => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status dos Pedidos</CardTitle>
        <CardDescription>Distribuição por situação</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {!hasValidData ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Nenhum dado disponível para exibição</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderStatusPieChart;
