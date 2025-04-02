import React, { useState, useEffect } from 'react';
import { useAuth } from "@/utils/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Layout from '@/components/Layout';

interface User {
  USUARIO: string;
  NOME: string;
  EMAIL: string;
  GRAU: string;
  LOJAS: string;
  MODULO: string;
  BANCOS: string;
  LIMICP: string;
  CCUSTO: string;
  ARMAZEN: string;
  permissoes: {
    sistema_completo: boolean;
    lojas: boolean;
    modulo: boolean;
    bancos: boolean;
    limicp: boolean;
    ccusto: boolean;
    armazen: boolean;
  };
}

const UserPermissions = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/users');
      if (!response.ok) throw new Error('Falha ao carregar usuários');
      const data = await response.json();
      setUsers(data.map((user: User) => ({
        ...user,
        permissoes: {
          sistema_completo: user.GRAU === 'S',
          lojas: !!user.LOJAS,
          modulo: !!user.MODULO,
          bancos: !!user.BANCOS,
          limicp: !!user.LIMICP,
          ccusto: !!user.CCUSTO,
          armazen: !!user.ARMAZEN
        }
      })));
    } catch (error) {
      toast.error('Erro ao carregar usuários');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = async (usuario: string, permissao: keyof User['permissoes']) => {
    if (usuario === user?.USUARIO) {
      toast.error('Você não pode alterar suas próprias permissões');
      return;
    }

    const updatedUsers = users.map(user => {
      if (user.USUARIO === usuario) {
        return {
          ...user,
          permissoes: {
            ...user.permissoes,
            [permissao]: !user.permissoes[permissao]
          }
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    setSaving(true);

    try {
      const response = await fetch(`http://localhost:3000/api/auth/users/${usuario}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permissoes: updatedUsers.find(u => u.USUARIO === usuario)?.permissoes
        }),
      });

      if (!response.ok) throw new Error('Falha ao atualizar permissões');
      toast.success('Permissões atualizadas com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar permissões');
      console.error(error);
      // Reverte a mudança em caso de erro
      setUsers(users);
    } finally {
      setSaving(false);
    }
  };

  // Se o usuário não tiver permissão de sistema completo, não mostra o componente
  if (user?.GRAU !== 'S') {
    return (
      <Layout>
        <Card>
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Você não tem permissão para acessar esta página.</p>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Permissões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Sistema Completo</TableHead>
                    <TableHead>Lojas</TableHead>
                    <TableHead>Módulo</TableHead>
                    <TableHead>Bancos</TableHead>
                    <TableHead>Limite CP</TableHead>
                    <TableHead>C. Custo</TableHead>
                    <TableHead>Armazen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.USUARIO}>
                      <TableCell className="font-medium">{user.USUARIO}</TableCell>
                      <TableCell>{user.NOME}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={user.permissoes.sistema_completo}
                          onCheckedChange={() => handlePermissionChange(user.USUARIO, 'sistema_completo')}
                          disabled={user.USUARIO === user?.USUARIO || saving}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={user.permissoes.lojas}
                          onCheckedChange={() => handlePermissionChange(user.USUARIO, 'lojas')}
                          disabled={user.USUARIO === user?.USUARIO || saving}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={user.permissoes.modulo}
                          onCheckedChange={() => handlePermissionChange(user.USUARIO, 'modulo')}
                          disabled={user.USUARIO === user?.USUARIO || saving}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={user.permissoes.bancos}
                          onCheckedChange={() => handlePermissionChange(user.USUARIO, 'bancos')}
                          disabled={user.USUARIO === user?.USUARIO || saving}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={user.permissoes.limicp}
                          onCheckedChange={() => handlePermissionChange(user.USUARIO, 'limicp')}
                          disabled={user.USUARIO === user?.USUARIO || saving}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={user.permissoes.ccusto}
                          onCheckedChange={() => handlePermissionChange(user.USUARIO, 'ccusto')}
                          disabled={user.USUARIO === user?.USUARIO || saving}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={user.permissoes.armazen}
                          onCheckedChange={() => handlePermissionChange(user.USUARIO, 'armazen')}
                          disabled={user.USUARIO === user?.USUARIO || saving}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UserPermissions; 