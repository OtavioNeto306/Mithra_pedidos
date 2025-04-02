
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrdersTable from '@/components/dashboard/OrdersTable';
import { FileCheck, Clock, PackageX, DollarSign, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/utils/auth';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import OrderStatusCard from '@/components/dashboard/OrderStatusCard';
import OrderStatusPieChart from '@/components/dashboard/OrderStatusPieChart';
import OrderHistoryChart from '@/components/dashboard/OrderHistoryChart';
import RevenueCard from '@/components/dashboard/RevenueCard';
import RevenueComparisonChart from '@/components/dashboard/RevenueComparisonChart';
import { useOrderData } from '@/hooks/useOrderData';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import databaseService from '@/services/DatabaseService';

// Chart colors
const COLORS = ['#4f46e5', '#f97316', '#ef4444'];

const Dashboard = () => {
  const { user } = useAuth();
  const { metrics, dailyData, statusData, loading, error } = useOrderData();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pedidos');
  const location = useLocation();
  const navigate = useNavigate();

  // Check for tab query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'pedidos') {
      setActiveTab('pedidos');
    } else if (tab === 'faturamento') {
      setActiveTab('faturamento');
    }
  }, [location.search]);

  // Fetch orders when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const data = await databaseService.fetchOrders();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <DashboardHeader user={user} />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Carregando dados de pedidos e faturamento...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao carregar dados</AlertTitle>
            <AlertDescription>
              {error}
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/settings#database')}
                >
                  Configurar Banco de Dados
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Order Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <OrderStatusCard
                title="Pedidos Faturados"
                value={metrics.pedidosFaturados}
                trend="+8% este mês"
                icon={FileCheck}
                iconColor="text-indigo-500"
                borderColor="border-l-indigo-500"
              />
              
              <OrderStatusCard
                title="Pedidos Pendentes"
                value={metrics.pedidosPendentes}
                trend="-5% última semana"
                icon={Clock}
                iconColor="text-orange-500"
                borderColor="border-l-orange-500"
              />
              
              <OrderStatusCard
                title="Pedidos Perdidos"
                value={metrics.pedidosPerdidos}
                trend="-2% este mês"
                icon={PackageX}
                iconColor="text-red-500"
                borderColor="border-l-red-500"
              />

              <RevenueCard
                value={metrics.faturamentoTotal}
                trend="+12% este mês"
                icon={DollarSign}
                iconColor="text-emerald-500"
                borderColor="border-l-emerald-500"
              />
            </div>

            <Tabs defaultValue="pedidos" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
                <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
              </TabsList>
              <TabsContent value="pedidos" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <OrderStatusPieChart data={statusData} colors={COLORS} />
                  <OrderHistoryChart data={dailyData} />
                </div>
                
                {/* Orders Table */}
                <OrdersTable orders={orders} isLoading={ordersLoading} />
              </TabsContent>
              <TabsContent value="faturamento" className="space-y-4">
                <RevenueComparisonChart data={dailyData} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
