
import { useState, useEffect } from 'react';
import databaseService, { 
  OrderMetrics, 
  DailyOrderData, 
  OrderStatusData 
} from '@/services/DatabaseService';

// Re-export types for components that import from this hook
export type { OrderMetrics, DailyOrderData, OrderStatusData };



export const useOrderData = () => {
  const [metrics, setMetrics] = useState<OrderMetrics>({
    pedidosFaturados: 0,
    pedidosPendentes: 0,
    pedidosPerdidos: 0,
    faturamentoTotal: 0
  });
  
  const [dailyData, setDailyData] = useState<DailyOrderData[]>([]);
  const [statusData, setStatusData] = useState<OrderStatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch metrics data
        const metricsData = await databaseService.getOrderMetrics();
        setMetrics(metricsData);
        
        // Fetch daily data for charts
        const dailyOrderData = await databaseService.getDailyOrderData(7);
        setDailyData(dailyOrderData);
        
        // Fetch status data for pie chart
        const orderStatusData = await databaseService.getOrderStatusData();
        setStatusData(orderStatusData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching order data:', err);
        setError('Erro ao carregar dados de pedidos e faturamento');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return {
    metrics,
    dailyData,
    statusData,
    loading,
    error
  };
};
