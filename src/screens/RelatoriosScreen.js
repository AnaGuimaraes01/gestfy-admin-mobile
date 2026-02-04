import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { relatoriosAPI, pedidosAPI, produtosAPI } from '../services/api';

const { width } = Dimensions.get('window');

const RelatoriosScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [relatorios, setRelatorios] = useState({
    vendas: null,
    estoque: null,
    financeiro: null,
  });

  useFocusEffect(
    React.useCallback(() => {
      loadRelatorios();
    }, [])
  );

  const loadRelatorios = async () => {
    setLoading(true);
    try {
      const [vendas, estoque, financeiro] = await Promise.all([
        relatoriosAPI.getVendas().catch(() => null),
        relatoriosAPI.getEstoque().catch(() => null),
        relatoriosAPI.getFinanceiro().catch(() => null),
      ]);

      setRelatorios({
        vendas,
        estoque,
        financeiro,
      });
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      Alert.alert('Erro', 'Falha ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRelatorios();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Relatórios</Text>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#27ae60" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Relatórios</Text>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <Refreshing
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {/* Relatório de Vendas */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📊 Vendas</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Período</Text>
            </View>
          </View>

          {relatorios.vendas ? (
            <View style={styles.cardContent}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total de Pedidos</Text>
                <Text style={styles.statValue}>
                  {relatorios.vendas.totalPedidos || 0}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Receita Total</Text>
                <Text style={styles.statValue}>
                  R$ {parseFloat(relatorios.vendas.receitaTotal || 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Ticket Médio</Text>
                <Text style={styles.statValue}>
                  R$ {parseFloat(relatorios.vendas.ticketMedio || 0).toFixed(2)}
                </Text>
              </View>
              {relatorios.vendas.produtosMaisVendidos && (
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Produto Top 1</Text>
                  <Text style={styles.statValue}>
                    {relatorios.vendas.produtosMaisVendidos[0]?.nome || 'N/A'}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.noDataText}>Dados não disponíveis</Text>
          )}
        </View>

        {/* Relatório de Estoque */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📦 Estoque</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Atual</Text>
            </View>
          </View>

          {relatorios.estoque ? (
            <View style={styles.cardContent}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total de Produtos</Text>
                <Text style={styles.statValue}>
                  {relatorios.estoque.totalProdutos || 0}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Itens em Estoque</Text>
                <Text style={styles.statValue}>
                  {relatorios.estoque.totalItens || 0}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Produtos Baixo Estoque</Text>
                <Text style={[styles.statValue, { color: '#f39c12' }]}>
                  {relatorios.estoque.produtosBaixoEstoque || 0}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Produtos Fora de Estoque</Text>
                <Text style={[styles.statValue, { color: '#e74c3c' }]}>
                  {relatorios.estoque.produtosFora || 0}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noDataText}>Dados não disponíveis</Text>
          )}
        </View>

        {/* Relatório Financeiro */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>💰 Financeiro</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Resumo</Text>
            </View>
          </View>

          {relatorios.financeiro ? (
            <View style={styles.cardContent}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Receita Total</Text>
                <Text style={[styles.statValue, { color: '#27ae60' }]}>
                  R$ {parseFloat(relatorios.financeiro.receitaTotal || 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Pedidos Pendentes</Text>
                <Text style={[styles.statValue, { color: '#f39c12' }]}>
                  R$ {parseFloat(relatorios.financeiro.pendente || 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Pedidos Pagos</Text>
                <Text style={[styles.statValue, { color: '#27ae60' }]}>
                  R$ {parseFloat(relatorios.financeiro.pago || 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Cancelados</Text>
                <Text style={[styles.statValue, { color: '#e74c3c' }]}>
                  R$ {parseFloat(relatorios.financeiro.cancelado || 0).toFixed(2)}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noDataText}>Dados não disponíveis</Text>
          )}
        </View>

        {/* Informações Adicionais */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ℹ️ Informações</Text>
          <View style={styles.cardContent}>
            <Text style={styles.infoText}>
              Os relatórios são atualizados em tempo real com base nos dados do sistema.
            </Text>
            <Text style={styles.infoText}>
              Para mais detalhes, acesse cada módulo (Produtos, Pedidos, Estoque).
            </Text>
          </View>
        </View>

        {/* Ações */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#3498db' }]}
            onPress={handleRefresh}
          >
            <Text style={styles.actionButtonText}>🔄 Atualizar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#9b59b6' }]}
            onPress={() => Alert.alert('Exportar', 'Funcionalidade não implementada')}
          >
            <Text style={styles.actionButtonText}>📥 Exportar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Componente customizado para refresh
const Refreshing = ({ refreshing, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  return null; // Implementação simplificada
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    padding: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    color: '#555',
    fontWeight: '500',
  },
  cardContent: {
    gap: 0,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  noDataText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default RelatoriosScreen;
