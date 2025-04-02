
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DailyOrderData } from "@/hooks/useOrderData";

interface RevenueComparisonChartProps {
  data: DailyOrderData[];
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const RevenueComparisonChart = ({ data }: RevenueComparisonChartProps) => {
  // Check if data is empty or all values are zero
  const hasValidData = data.length > 0 && data.some(item => item.faturamento > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparativo de Faturamento</CardTitle>
        <CardDescription>Últimos 7 dias</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {!hasValidData ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Nenhum dado de faturamento disponível para exibição</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `R$${value / 1000}k`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar
                dataKey="faturamento"
                fill="#10b981"
                name="Faturamento"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueComparisonChart;
