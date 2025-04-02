import React, { useState, useEffect } from 'react';
import { useAuth } from "@/utils/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Layout from '@/components/Layout';

interface User {
  USUARIO: string;
  NOME: string;
  COMISSAO: number;
}

const UserPermissions = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/users');
      if (!response.ok) throw new Error('Falha ao carregar usuários');
      const data = await response.json();
      setUsers(data.map((user: User) => ({
        USUARIO: user.USUARIO,
        NOME: user.NOME,
        COMISSAO: Number(user.COMISSAO) || 0
      })));
    } catch (error) {
      toast.error('Erro ao carregar usuários');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleComissaoChange = async (usuario: string, value: string) => {
    const comissao = parseFloat(value);
    
    if (isNaN(comissao) || comissao < 0 || comissao > 100) {
      toast.error('A comissão deve ser um número entre 0 e 100');
      return;
    }

    if (usuario === currentUser?.USUARIO) {
      toast.error('Você não pode alterar suas próprias permissões');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`http://localhost:3000/api/auth/users/${usuario}/comissao`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comissao }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Falha ao atualizar comissão');
      }
      
      setUsers(users.map(u => 
        u.USUARIO === usuario ? { ...u, COMISSAO: comissao } : u
      ));
      
      toast.success('Comissão atualizada com sucesso');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar comissão');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Se o usuário não tiver permissão de sistema completo, não mostra o componente
  if (currentUser?.GRAU !== 'S') {
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
                    <TableHead>Login</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Comissão (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.USUARIO}>
                      <TableCell className="font-medium">{user.USUARIO}</TableCell>
                      <TableCell>{user.NOME}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={user.COMISSAO}
                          onChange={(e) => handleComissaoChange(user.USUARIO, e.target.value)}
                          disabled={user.USUARIO === currentUser?.USUARIO || saving}
                          className="w-24"
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