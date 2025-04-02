import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useAuth } from "@/utils/auth";
import { API_ENDPOINTS } from '@/config/api';

interface User {
  USUARIO: string;
  NOME: string;
  EMAIL: string;
  GRAU: string;
  permissoes: {
    sistema_completo: boolean;
  };
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.auth.users);
      if (!response.ok) throw new Error('Falha ao carregar usuários');
      const data = await response.json();
      setUsers(data.map((user: User) => ({
        ...user,
        permissoes: {
          sistema_completo: user.GRAU === 'S'
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

    try {
      const response = await fetch(API_ENDPOINTS.auth.userPermissions(usuario), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permissao,
          valor: updatedUsers.find(u => u.USUARIO === usuario)?.permissoes[permissao]
        }),
      });

      if (!response.ok) throw new Error('Falha ao atualizar permissões');
      toast.success('Permissões atualizadas com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar permissões');
      console.error(error);
      // Reverte a mudança em caso de erro
      setUsers(users);
    }
  };

  // Se o usuário não tiver permissão de sistema completo, não mostra o componente
  if (user?.GRAU !== 'S') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acesso Negado</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Você não tem permissão para acessar esta página.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Usuários</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead>Sistema Completo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.USUARIO}>
                <TableCell>{user.USUARIO}</TableCell>
                <TableCell>{user.NOME}</TableCell>
                <TableCell>{user.EMAIL}</TableCell>
                <TableCell>{user.GRAU === 'S' ? 'Sistema Completo' : 'Visualização'}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={user.permissoes.sistema_completo}
                    onCheckedChange={() => handlePermissionChange(user.USUARIO, 'sistema_completo')}
                    disabled={user.USUARIO === user?.USUARIO} // Não permite alterar suas próprias permissões
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserManagement;