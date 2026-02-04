import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL base da API - Use a URL deployada do backend
const API_BASE_URL = 'https://gestfy-backend.onrender.com/api';

// Para desenvolvimento local, descomente a linha abaixo:
// const API_BASE_URL = 'http://localhost:8080/api';

// Criar instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para adicionar token em todas as requisições
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao obter token do AsyncStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador para tratamento de erros globais
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      await AsyncStorage.removeItem('adminToken');
      await AsyncStorage.removeItem('adminUser');
      // Aqui você pode redirecionar para login se necessário
    }
    return Promise.reject(error);
  }
);

// ============ AUTENTICAÇÃO ============
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  logout: async () => {
    try {
      await AsyncStorage.removeItem('adminToken');
      await AsyncStorage.removeItem('adminUser');
      return true;
    } catch (error) {
      throw error;
    }
  },
};

// ============ CLIENTES ============
export const clientesAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/clientes');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  create: async (cliente) => {
    try {
      const response = await api.post('/clientes', cliente);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  update: async (id, cliente) => {
    try {
      const response = await api.put(`/clientes/${id}`, cliente);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  delete: async (id) => {
    try {
      await api.delete(`/clientes/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },
};

// ============ PRODUTOS ============
export const produtosAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/produtos');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/produtos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  create: async (produto) => {
    try {
      const response = await api.post('/produtos', produto);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  update: async (id, produto) => {
    try {
      const response = await api.put(`/produtos/${id}`, produto);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  delete: async (id) => {
    try {
      await api.delete(`/produtos/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },
};

// ============ PEDIDOS ============
export const pedidosAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/pedidos');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  create: async (pedido) => {
    try {
      const response = await api.post('/pedidos', pedido);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  update: async (id, pedido) => {
    try {
      const response = await api.put(`/pedidos/${id}`, pedido);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  delete: async (id) => {
    try {
      await api.delete(`/pedidos/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },
};

// ============ ESTOQUE ============
export const estoqueAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/estoque');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/estoque/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  create: async (estoque) => {
    try {
      const response = await api.post('/estoque', estoque);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  update: async (id, estoque) => {
    try {
      const response = await api.put(`/estoque/${id}`, estoque);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  delete: async (id) => {
    try {
      await api.delete(`/estoque/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },
};

// ============ CAIXA ============
export const caixaAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/caixa');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/caixa/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  create: async (caixa) => {
    try {
      const response = await api.post('/caixa', caixa);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  update: async (id, caixa) => {
    try {
      const response = await api.put(`/caixa/${id}`, caixa);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ============ RELATÓRIOS ============
export const relatoriosAPI = {
  getTodosRelatorios: async () => {
    try {
      const response = await api.get('/relatorios');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getVendas: async () => {
    try {
      const response = await api.get('/relatorios/vendas');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getEstoque: async () => {
    try {
      const response = await api.get('/relatorios/estoque');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getFinanceiro: async () => {
    try {
      const response = await api.get('/relatorios/financeiro');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
