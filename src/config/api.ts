export const API_BASE_URL = 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  auth: {
    users: `${API_BASE_URL}/auth/users`,
    userPermissions: (username: string) => `${API_BASE_URL}/auth/users/${username}/permissions`,
    userComissao: (username: string) => `${API_BASE_URL}/auth/users/${username}/comissao`,
    pedidos: `${API_BASE_URL}/auth/pedidos`
  }
}; 