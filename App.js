import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { isAuthenticated } from './src/storage/authStorage';

// Import screens
import AdminLoginScreen from './src/screens/AdminLoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ProdutosAdminScreen from './src/screens/ProdutosAdminScreen';
import PedidosAdminScreen from './src/screens/PedidosAdminScreen';
import EstoqueAdminScreen from './src/screens/EstoqueAdminScreen';
import RelatoriosScreen from './src/screens/RelatoriosScreen';

const Stack = createNativeStackNavigator();

// Componente Loading
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#27ae60" />
  </View>
);

// Stack de Autenticação
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true,
      cardStyle: { backgroundColor: '#fff' },
    }}
  >
    <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
  </Stack.Navigator>
);

// Stack de App (após login)
const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true,
      cardStyle: { backgroundColor: '#f5f5f5' },
    }}
  >
    <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
    <Stack.Screen
      name="ProdutosAdmin"
      component={ProdutosAdminScreen}
      options={{
        title: 'Produtos',
      }}
    />
    <Stack.Screen
      name="PedidosAdmin"
      component={PedidosAdminScreen}
      options={{
        title: 'Pedidos',
      }}
    />
    <Stack.Screen
      name="EstoqueAdmin"
      component={EstoqueAdminScreen}
      options={{
        title: 'Estoque',
      }}
    />
    <Stack.Screen
      name="Relatorios"
      component={RelatoriosScreen}
      options={{
        title: 'Relatórios',
      }}
    />
  </Stack.Navigator>
);

// Componente Root Navigation
const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    // Verificar se usuário já está autenticado
    const bootstrapAsync = async () => {
      try {
        const token = await isAuthenticated();
        setUserToken(token ? 'dummy_token' : null);
      } catch (error) {
        console.error('Erro ao restaurar token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {userToken == null ? <AuthStack /> : <AppStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return <RootNavigator />;
}
