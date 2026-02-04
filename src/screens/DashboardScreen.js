import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getUser, clearAuth } from '../storage/authStorage';
import { pedidosAPI, produtosAPI, caixaAPI } from '../services/api';

const DashboardScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPedidos: 0,
    totalProdutos: 0,
    totalCaixa: 0,
  });

  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const user = await getUser();
      if (user?.nome) {
        setUserName(user.nome);
      }

      // Carrega dados de pedidos
      const pedidos = await pedidosAPI.getAll();
      // Carrega dados de produtos
      const produtos = await produtosAPI.getAll();
      // Carrega dados de caixa
      const caixa = await caixaAPI.getAll();

      setStats({
        totalPedidos: Array.isArray(pedidos) ? pedidos.length : 0,
        totalProdutos: Array.isArray(produtos) ? produtos.length : 0,
        totalCaixa: Array.isArray(caixa) ? caixa.length : 0,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      // Não mostra erro aqui, pois pode ser problema de conexão ao carregar
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirmar Logout',
      'Deseja realmente sair do sistema?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: async () => {
            try {
              await clearAuth();
              navigation.replace('AdminLogin');
            } catch (error) {
              Alert.alert('Erro', 'Erro ao fazer logout');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'produtos',
      title: 'Produtos',
      icon: '📦',
      color: '#3498db',
      onPress: () => navigation.navigate('ProdutosAdmin'),
    },
    {
      id: 'pedidos',
      title: 'Pedidos',
      icon: '📋',
      color: '#e74c3c',
      onPress: () => navigation.navigate('PedidosAdmin'),
    },
    {
      id: 'estoque',
      title: 'Estoque',
      icon: '📊',
      color: '#f39c12',
      onPress: () => navigation.navigate('EstoqueAdmin'),
    },
    {
      id: 'relatorios',
      title: 'Relatórios',
      icon: '📈',
      color: '#9b59b6',
      onPress: () => navigation.navigate('Relatorios'),
    },
  ];

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.menuItem, { borderLeftColor: item.color }]}
      onPress={item.onPress}
    >
      <Text style={styles.menuIcon}>{item.icon}</Text>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuSubtitle}>Gerenciar</Text>
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Bem-vindo,</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#27ae60" />
          </View>
        ) : (
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: '#3498db' }]}>
              <Text style={styles.statNumber}>{stats.totalPedidos}</Text>
              <Text style={styles.statLabel}>Pedidos</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#e74c3c' }]}>
              <Text style={styles.statNumber}>{stats.totalProdutos}</Text>
              <Text style={styles.statLabel}>Produtos</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#f39c12' }]}>
              <Text style={styles.statNumber}>{stats.totalCaixa}</Text>
              <Text style={styles.statLabel}>Movimentações</Text>
            </View>
          </View>
        )}

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Funcionalidades</Text>
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Gestfy Admin - Sistema de Gestão para Pequenos Negócios
          </Text>
          <Text style={styles.infoVersion}>Versão 1.0 • 2026</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  menuItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  menuArrow: {
    fontSize: 20,
    color: '#bbb',
  },
  separator: {
    height: 8,
  },
  infoSection: {
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginBottom: 8,
  },
  infoVersion: {
    fontSize: 10,
    color: '#999',
  },
});

export default DashboardScreen;
