import AsyncStorage from '@react-native-async-storage/async-storage';

const ADMIN_TOKEN_KEY = 'adminToken';
const ADMIN_USER_KEY = 'adminUser';

/**
 * Armazenar token de autenticação do admin
 * @param {string} token - Token JWT do backend
 */
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(ADMIN_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Erro ao salvar token:', error);
    return false;
  }
};

/**
 * Obter token armazenado
 * @returns {Promise<string|null>} Token ou null se não existir
 */
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(ADMIN_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Erro ao obter token:', error);
    return null;
  }
};

/**
 * Verificar se existe token válido
 * @returns {Promise<boolean>} true se token existe
 */
export const hasToken = async () => {
  try {
    const token = await AsyncStorage.getItem(ADMIN_TOKEN_KEY);
    return token !== null;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return false;
  }
};

/**
 * Armazenar dados do usuário admin
 * @param {object} user - Dados do usuário (id, nome, email, etc)
 */
export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    return false;
  }
};

/**
 * Obter dados do usuário armazenado
 * @returns {Promise<object|null>} Dados do usuário ou null
 */
export const getUser = async () => {
  try {
    const userJson = await AsyncStorage.getItem(ADMIN_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    return null;
  }
};

/**
 * Remover token e dados do usuário (logout)
 */
export const clearAuth = async () => {
  try {
    await AsyncStorage.multiRemove([ADMIN_TOKEN_KEY, ADMIN_USER_KEY]);
    return true;
  } catch (error) {
    console.error('Erro ao limpar autenticação:', error);
    return false;
  }
};

/**
 * Verificar se usuário está autenticado
 * @returns {Promise<boolean>} true se autenticado
 */
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem(ADMIN_TOKEN_KEY);
    return token !== null;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return false;
  }
};
