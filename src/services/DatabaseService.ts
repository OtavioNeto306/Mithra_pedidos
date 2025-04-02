import { toast } from 'sonner';
import { API_ENDPOINTS } from '@/config/api';

// Types for database configuration
export interface DatabaseConfig {
  type: 'mysql' | 'oracle';
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
}

// Types for order and billing data
export interface OrderData {
  id: string;
  customer: string;
  date: string;
  status: 'faturado' | 'pendente' | 'perdido';
  total: number;
  items: number;
}

export interface BillingData {
  id: string;
  orderId: string;
  date: string;
  amount: number;
  paymentMethod: string;
  status: 'pago' | 'pendente' | 'cancelado';
}

export interface OrderMetrics {
  pedidosFaturados: number;
  pedidosPendentes: number;
  pedidosPerdidos: number;
  faturamentoTotal: number;
}

export interface DailyOrderData {
  date: string;
  pedidosFaturados: number;
  pedidosPendentes: number;
  pedidosPerdidos: number;
  faturamento: number;
}

export interface OrderStatusData {
  name: string;
  value: number;
}

class DatabaseService {
  private static instance: DatabaseService;
  private mysqlConfig: DatabaseConfig | null = null;
  private oracleConfig: DatabaseConfig | null = null;
  private connected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Configure database connections
   */
  public setDatabaseConfig(config: DatabaseConfig): void {
    if (config.type === 'mysql') {
      this.mysqlConfig = config;
    } else if (config.type === 'oracle') {
      this.oracleConfig = config;
    }
    
    // In a real implementation, you would establish and test the connection here
    console.log(`Database config set for ${config.type}:`, config);
  }

  /**
   * Test database connection
   */
  public async testConnection(config: DatabaseConfig): Promise<boolean> {
    // In a real implementation, you would test the connection to the database
    // For now, we'll simulate a connection test
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.3; // 70% chance of success
        if (success) {
          toast.success(`Conexão com ${config.type} estabelecida com sucesso`);
        } else {
          toast.error(`Falha na conexão com ${config.type}. Verifique as credenciais.`);
        }
        resolve(success);
      }, 1500);
    });
  }

  /**
   * Fetch orders from the database
   */
  public async fetchOrders(): Promise<OrderData[]> {
    try {
      const response = await fetch(API_ENDPOINTS.auth.pedidos);
      if (!response.ok) {
        throw new Error('Erro ao buscar pedidos');
      }
      const data = await response.json();
      return data.map((row: any) => {
        // Mapeia os status da tabela cabpdv para os status do sistema
        let status: 'faturado' | 'pendente' | 'perdido';
        switch (row.status) {
          case 'L':
            status = 'faturado';
            break;
          case 'B':
            status = 'pendente';
            break;
          case 'R':
            status = 'perdido';
            break;
          default:
            status = 'pendente';
        }

        return {
          id: row.numero.toString(),
          customer: row.cliente,
          date: row.emissao,
          status,
          total: parseFloat(row.valor) || 0,
          items: 1 // Valor padrão já que não temos essa informação na tabela cabpdv
        };
      });
    } catch (error) {
      console.error('Error fetching orders from API:', error);
      toast.error('Erro ao buscar pedidos do servidor');
      return [];
    }
  }

  /**
   * Fetch billing data from the database
   */
  public async fetchBillingData(): Promise<BillingData[]> {
    // In a real implementation, you would query the database
    // For now, we'll return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.generateMockBillingData());
      }, 800);
    });
  }

  /**
   * Get order metrics
   */
  public async getOrderMetrics(): Promise<OrderMetrics> {
    const orders = await this.fetchOrders();
    
    const faturados = orders.filter(order => order.status === 'faturado');
    const pendentes = orders.filter(order => order.status === 'pendente');
    const perdidos = orders.filter(order => order.status === 'perdido');
    
    return {
      pedidosFaturados: faturados.length,
      pedidosPendentes: pendentes.length,
      pedidosPerdidos: perdidos.length,
      faturamentoTotal: faturados.reduce((sum, order) => sum + order.total, 0)
    };
  }

  /**
   * Get daily order data for charts
   */
  public async getDailyOrderData(days: number = 7): Promise<DailyOrderData[]> {
    // In a real implementation, you would query the database for data grouped by day
    // For now, we'll generate mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.generateDailyData(days));
      }, 800);
    });
  }

  /**
   * Get order status data for pie chart
   */
  public async getOrderStatusData(): Promise<OrderStatusData[]> {
    const metrics = await this.getOrderMetrics();
    const total = metrics.pedidosFaturados + metrics.pedidosPendentes + metrics.pedidosPerdidos;
    
    // Prevent division by zero if there are no orders
    if (total === 0) {
      return [
        { name: 'Faturados', value: 0 },
        { name: 'Pendentes', value: 0 },
        { name: 'Perdidos', value: 0 }
      ];
    }
    
    return [
      { name: 'Faturados', value: Math.round((metrics.pedidosFaturados / total) * 100) },
      { name: 'Pendentes', value: Math.round((metrics.pedidosPendentes / total) * 100) },
      { name: 'Perdidos', value: Math.round((metrics.pedidosPerdidos / total) * 100) }
    ];
  }

  // Helper methods to generate mock data
  private generateMockOrders(): OrderData[] {
    return Array.from({ length: 50 }).map((_, i) => {
      const statuses: Array<'faturado' | 'pendente' | 'perdido'> = ['faturado', 'pendente', 'perdido'];
      const status = statuses[Math.floor(Math.random() * (i > 40 ? 3 : (i > 20 ? 2 : 1)))];
      const total = Math.floor(Math.random() * 10000) + 1000;
      
      return {
        id: `ORD-${1000 + i}`,
        customer: `Cliente ${i + 1}`,
        date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        status,
        total,
        items: Math.floor(Math.random() * 10) + 1
      };
    });
  }

  private generateMockBillingData(): BillingData[] {
    return Array.from({ length: 40 }).map((_, i) => {
      const statuses: Array<'pago' | 'pendente' | 'cancelado'> = ['pago', 'pendente', 'cancelado'];
      const status = statuses[Math.floor(Math.random() * (i > 30 ? 3 : (i > 15 ? 2 : 1)))];
      
      return {
        id: `INV-${2000 + i}`,
        orderId: `ORD-${1000 + Math.floor(Math.random() * 50)}`,
        date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        amount: Math.floor(Math.random() * 10000) + 1000,
        paymentMethod: ['Cartão', 'Boleto', 'Transferência', 'Dinheiro'][Math.floor(Math.random() * 4)],
        status
      };
    });
  }



  private generateDailyData(days: number): DailyOrderData[] {
    return Array.from({ length: days }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      
      return {
        date: date.toLocaleDateString('pt-BR'),
        pedidosFaturados: Math.floor(Math.random() * 25) + 10,
        pedidosPendentes: Math.floor(Math.random() * 15) + 5,
        pedidosPerdidos: Math.floor(Math.random() * 5) + 1,
        faturamento: Math.floor(Math.random() * 15000) + 5000,
      };
    });
  }
}

export default DatabaseService.getInstance();