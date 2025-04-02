import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import UserManagement from '@/components/UserManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Sliders, UserCog, Bell } from 'lucide-react';

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate({ hash: value === 'general' ? '' : value });
  };

  const handleSaveGeneral = () => {
    toast.success('Configurações gerais salvas com sucesso!');
  };

  const handleSaveNotifications = () => {
    toast.success('Preferências de notificação salvas com sucesso!');
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center">
          <Sliders className="h-5 w-5 mr-2 text-muted-foreground" />
          <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:w-[400px]">
            <TabsTrigger value="general" className="flex items-center">
              <UserCog className="h-4 w-4 mr-2" />
              <span>Geral</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              <span>Notificações</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Gerencie as configurações gerais do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="system-name">Nome do Sistema</Label>
                    <Input id="system-name" defaultValue="Mithra" className="input-focus-ring" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time-zone">Fuso Horário</Label>
                    <select
                      id="time-zone"
                      className="w-full p-2 rounded-md border border-input bg-background input-focus-ring"
                    >
                      <option value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</option>
                      <option value="America/Manaus">America/Manaus (GMT-4)</option>
                      <option value="America/Belem">America/Belem (GMT-3)</option>
                      <option value="America/Noronha">America/Noronha (GMT-2)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Formato de Data</Label>
                    <select
                      id="date-format"
                      className="w-full p-2 rounded-md border border-input bg-background input-focus-ring"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="debug-mode">Modo Debug</Label>
                      <p className="text-sm text-muted-foreground">
                        Ative para logs detalhados
                      </p>
                    </div>
                    <Switch id="debug-mode" />
                  </div>
                </div>
                
                <Button onClick={handleSaveGeneral}>Salvar Configurações</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Configure como e quando receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Notificações por E-mail</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba alertas importantes por e-mail
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="system-alerts">Alertas do Sistema</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificações sobre o desempenho do sistema
                      </p>
                    </div>
                    <Switch id="system-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="activity-summary">Resumo de Atividades</Label>
                      <p className="text-sm text-muted-foreground">
                        Relatório diário de atividades do sistema
                      </p>
                    </div>
                    <Switch id="activity-summary" />
                  </div>
                </div>
                
                <Button onClick={handleSaveNotifications}>Salvar Preferências</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
