import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Modal,
  Picker,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { pedidosAPI } from '../services/api';

const PedidosAdminScreen = ({ navigation }) => {
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      loadPedidos();
    }, [])
  );

  useEffect(() => {
    filterPedidos();
  }, [searchQuery, statusFilter, pedidos]);

  const loadPedidos = async () => {
    setLoading(true);
    try {
      const data = await pedidosAPI.getAll();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      Alert.alert('Erro', 'Falha ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const filterPedidos = () => {
    let filtered = pedidos;

    // Filtro por status
    if (statusFilter) {
      filtered = filtered.filter(
        (pedido) => pedido.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Filtro por busca
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (pedido) =>
          pedido.id?.toString().includes(searchQuery) ||
          pedido.cliente?.nome?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPedidos(filtered);
  };

  const handleUpdateStatus = async (pedido, novoStatus) => {
    try {
      await pedidosAPI.update(pedido.id, {
        ...pedido,
        status: novoStatus,
      });
      Alert.alert('Sucesso', 'Status do pedido atualizado');
      setModalVisible(false);
      loadPedidos();
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      Alert.alert('Erro', 'Falha ao atualizar status do pedido');
    }
  };

  const handleViewPedido = (pedido) => {
    setSelectedPedido(pedido);
    setModalVisible(true);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPedidos();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendente':
        return '#f39c12';
      case 'confirmado':
        return '#3498db';
      case 'enviado':
        return '#9b59b6';
      case 'entregue':
        return '#27ae60';
      case 'cancelado':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const renderPedidoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.pedidoCard}
      onPress={() => handleViewPedido(item)}
    >
      <View style={styles.pedidoHeader}>
        <Text style={styles.pedidoId}>Pedido #{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.pedidoCliente} numberOfLines={1}>
        {item.cliente?.nome || 'Cliente não identificado'}
      </Text>
      <View style={styles.pedidoFooter}>
        <Text style={styles.pedidoTotal}>R$ {item.total?.toFixed(2)}</Text>
        <Text style={styles.pedidoData}>
          {new Date(item.data).toLocaleDateString('pt-BR')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pedidos</Text>
      </View>

      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por ID ou cliente..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        <View style={styles.statusFilterContainer}>
          <Picker
            selectedValue={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
            style={styles.picker}
          >
            <Picker.Item label="Todos os status" value="" />
            <Picker.Item label="Pendente" value="pendente" />
            <Picker.Item label="Confirmado" value="confirmado" />
            <Picker.Item label="Enviado" value="enviado" />
            <Picker.Item label="Entregue" value="entregue" />
            <Picker.Item label="Cancelado" value="cancelado" />
          </Picker>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#27ae60" />
        </View>
      ) : filteredPedidos.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Nenhum pedido encontrado</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPedidos}
          renderItem={renderPedidoItem}
          keyExtractor={(item) => String(item.id)}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.list}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalhes do Pedido</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {selectedPedido && (
              <>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>ID do Pedido</Text>
                  <Text style={styles.modalValue}>#{selectedPedido.id}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Cliente</Text>
                  <Text style={styles.modalValue}>
                    {selectedPedido.cliente?.nome}
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Email</Text>
                  <Text style={styles.modalValue}>
                    {selectedPedido.cliente?.email}
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Telefone</Text>
                  <Text style={styles.modalValue}>
                    {selectedPedido.cliente?.telefone}
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Data do Pedido</Text>
                  <Text style={styles.modalValue}>
                    {new Date(selectedPedido.data).toLocaleDateString('pt-BR')}
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Status</Text>
                  <View style={[styles.statusBadgeModal, { backgroundColor: getStatusColor(selectedPedido.status) }]}>
                    <Text style={styles.statusText}>{selectedPedido.status}</Text>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Itens do Pedido</Text>
                  {selectedPedido.itens && selectedPedido.itens.length > 0 ? (
                    selectedPedido.itens.map((item, index) => (
                      <View key={index} style={styles.itemRow}>
                        <Text style={styles.itemNome}>{item.produto?.nome}</Text>
                        <Text style={styles.itemQtd}>
                          {item.quantidade}x R$ {item.preco?.toFixed(2)}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.modalValue}>Nenhum item</Text>
                  )}
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Total</Text>
                  <Text style={styles.totalValue}>R$ {selectedPedido.total?.toFixed(2)}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Alterar Status</Text>
                  <View style={styles.statusButtonsContainer}>
                    {['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'].map((status) => (
                      <TouchableOpacity
                        key={status}
                        style={[
                          styles.statusButton,
                          selectedPedido.status?.toLowerCase() === status &&
                            styles.statusButtonActive,
                        ]}
                        onPress={() => handleUpdateStatus(selectedPedido, status.charAt(0).toUpperCase() + status.slice(1))}
                      >
                        <Text
                          style={[
                            styles.statusButtonText,
                            selectedPedido.status?.toLowerCase() === status &&
                              styles.statusButtonTextActive,
                          ]}
                        >
                          {status}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeModalButtonText}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterContainer: {
    padding: 12,
    gap: 8,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  statusFilterContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  list: {
    padding: 12,
  },
  pedidoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pedidoId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeModal: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  pedidoCliente: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  pedidoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pedidoTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27ae60',
  },
  pedidoData: {
    fontSize: 12,
    color: '#999',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  modal: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    backgroundColor: '#2c3e50',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalSection: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  modalLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },
  modalValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  itemNome: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  itemQtd: {
    fontSize: 13,
    color: '#27ae60',
    fontWeight: '600',
    marginLeft: 8,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  statusButtonActive: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  statusButtonText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  closeModalButton: {
    backgroundColor: '#95a5a6',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  closeModalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default PedidosAdminScreen;
