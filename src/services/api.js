import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// URL base do backend (SEM /api no final)
const API_BASE_URL = 'https://gestfy-backend.onrender.com';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


// ============================
// INTERCEPTADOR DE REQUEST
// ============================

api.interceptors.request.use(
  async (config) => {

    try {

      const token = await AsyncStorage.getItem('adminToken');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

    } catch (error) {

      console.error('Erro ao obter token:', error);

    }

    return config;

  },
  (error) => Promise.reject(error)
);


// ============================
// INTERCEPTADOR DE RESPONSE
// ============================

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    if (error.response?.status === 401) {

      await AsyncStorage.removeItem('adminToken');
      await AsyncStorage.removeItem('adminUser');

      console.log("Token inválido ou expirado");

    }

    return Promise.reject(error);

  }

);


// ============================
// AUTH (LOGIN FAKE)
// ============================

export const authAPI = {

  login: async (username, password) => {

    // LOGIN IGUAL AO FRONTEND WEB

    if (username === "admin" && password === "admin123") {

      const fakeToken = "fake-token-admin";

      await AsyncStorage.setItem('adminToken', fakeToken);
      await AsyncStorage.setItem('adminUser', username);

      return {
        token: fakeToken,
        username: username
      };

    } else {

      throw new Error("Usuário ou senha inválidos");

    }

  },

  logout: async () => {

    await AsyncStorage.removeItem('adminToken');
    await AsyncStorage.removeItem('adminUser');

    return true;

  }

};


// ============================
// CLIENTES
// ============================

export const clientesAPI = {

  getAll: async () => {

    const response = await api.get('/api/clientes');
    return response.data;

  },

  getById: async (id) => {

    const response = await api.get(`/api/clientes/${id}`);
    return response.data;

  },

  create: async (cliente) => {

    const response = await api.post('/api/clientes', cliente);
    return response.data;

  },

  update: async (id, cliente) => {

    const response = await api.put(`/api/clientes/${id}`, cliente);
    return response.data;

  },

  delete: async (id) => {

    await api.delete(`/api/clientes/${id}`);
    return true;

  }

};


// ============================
// PRODUTOS
// ============================

export const produtosAPI = {

  getAll: async () => {

    const response = await api.get('/api/produtos');
    return response.data;

  },

  create: async (produto) => {

    const response = await api.post('/api/produtos', produto);
    return response.data;

  }

};


// ============================
// PEDIDOS
// ============================

export const pedidosAPI = {

  getAll: async () => {

    const response = await api.get('/api/pedidos');
    return response.data;

  }

};


// ============================
// ESTOQUE
// ============================

export const estoqueAPI = {

  getAll: async () => {

    const response = await api.get('/api/estoque');
    return response.data;

  }

};


// ============================
// RELATÓRIOS
// ============================

export const relatoriosAPI = {

  getVendas: async () => {

    const response = await api.get('/api/relatorios/vendas');
    return response.data;

  }

};


export default api;
