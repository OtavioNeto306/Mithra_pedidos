
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Database, CheckCircle2, XCircle } from 'lucide-react';
import databaseService, { DatabaseConfig as DBConfig } from '@/services/DatabaseService';

type DatabaseType = 'mysql' | 'oracle';

// Using the DatabaseConfig from our service
type DatabaseConfig = DBConfig;

const defaultConfigs: Record<DatabaseType, Partial<DatabaseConfig>> = {
  mysql: {
    port: '3306'
  },
  oracle: {
    port: '1521'
  }
};

const DatabaseConnection = () => {
  const [dbType, setDbType] = useState<DatabaseType>('mysql');
  const [config, setConfig] = useState<DatabaseConfig>({
    type: 'mysql',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: '5445',
    database: 'emporio'
  });
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');

  const handleTypeChange = (type: DatabaseType) => {
    setDbType(type);
    setConfig(prev => ({
      ...prev,
      type,
      port: defaultConfigs[type].port || prev.port
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const testConnection = async () => {
    setConnectionStatus('connecting');
    
    try {
      const isSuccess = await databaseService.testConnection(config);
      
      if (isSuccess) {
        setConnectionStatus('success');
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error('Erro ao testar conexão com o banco de dados');
    }
  };

  const saveConnection = () => {
    // Validate all fields are filled
    const emptyFields = Object.entries(config)
      .filter(([_, value]) => !value)
      .map(([key]) => key);
    
    if (emptyFields.length > 0) {
      toast.error(`Por favor, preencha os seguintes campos: ${emptyFields.join(', ')}`);
      return;
    }
    
    if (connectionStatus !== 'success') {
      toast.warning('Por favor, teste a conexão antes de salvar.');
      return;
    }
    
    // Save configuration to our database service
    databaseService.setDatabaseConfig(config);
    toast.success('Configuração de banco de dados salva com sucesso!');
    
    // Log for debugging
    console.log('Saved database config:', config);
  };

  return (
    <div className="glass-panel rounded-xl p-6 max-w-2xl mx-auto animate-scale-in">
      <div className="flex items-center space-x-3 mb-6">
        <Database className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">Configuração de Banco de Dados</h2>
      </div>
      
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="dbType">Tipo de Banco de Dados</Label>
          <Select value={dbType} onValueChange={(value) => handleTypeChange(value as DatabaseType)}>
            <SelectTrigger id="dbType" className="input-focus-ring">
              <SelectValue placeholder="Selecione o tipo de banco" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mysql">MySQL</SelectItem>
              <SelectItem value="oracle">Oracle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="host">Host</Label>
            <Input
              id="host"
              name="host"
              value={config.host}
              onChange={handleInputChange}
              className="input-focus-ring"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="port">Porta</Label>
            <Input
              id="port"
              name="port"
              value={config.port}
              onChange={handleInputChange}
              className="input-focus-ring"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuário</Label>
            <Input
              id="username"
              name="username"
              value={config.username}
              onChange={handleInputChange}
              className="input-focus-ring"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={config.password}
              onChange={handleInputChange}
              className="input-focus-ring"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="database">Nome do Banco de Dados</Label>
          <Input
            id="database"
            name="database"
            value={config.database}
            onChange={handleInputChange}
            className="input-focus-ring"
          />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 mt-2">
          <Button 
            onClick={testConnection} 
            variant="outline" 
            className="w-full md:w-auto"
            disabled={connectionStatus === 'connecting'}
          >
            {connectionStatus === 'connecting' ? 'Testando...' : 'Testar Conexão'}
          </Button>
          
          <Button 
            onClick={saveConnection} 
            className="w-full md:w-auto"
          >
            Salvar Configuração
          </Button>
          
          {connectionStatus === 'success' && (
            <div className="flex items-center text-green-600">
              <CheckCircle2 className="w-5 h-5 mr-1" />
              <span>Conexão estabelecida</span>
            </div>
          )}
          
          {connectionStatus === 'error' && (
            <div className="flex items-center text-red-600">
              <XCircle className="w-5 h-5 mr-1" />
              <span>Falha na conexão</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseConnection;
