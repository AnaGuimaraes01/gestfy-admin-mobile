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
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { estoqueAPI, produtosAPI } from '../services/api';

const EstoqueAdminScreen = ({ navigation }) => {
  const [estoque, setEstoque] = useState([]);
  const [filteredEstoque, setFilteredEstoque] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('view'); // view, edit, create

  // Form states
  const [formData, setFormData] = useState({
    quantidade: '',
    dataMovimento: new Date().toISOString().split('T')[0],
    tipo: 'entrada',
  });

  useFocusEffect(
    React.useCallback(() => {
      loadEstoque();
    }, [])
  );

  useEffect(() => {
    filterEstoque();
  }, [searchQuery, estoque]);

  const loadEstoque = async () => {
    setLoading(true);
    try {
      const data = await estoqueAPI.getAll();
      setEstoque(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar estoque:', error);
      Alert.alert('Erro', 'Falha ao carregar dados de estoque');
    } finally {
      setLoading(false);
    }
  };

  const filterEstoque = () => {
    if (!searchQuery.trim()) {
      setFilteredEstoque(estoque);
      return;
    }

    const filtered = estoque.filter((item) =>
      item.produto?.nome?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEstoque(filtered);
  };

  const handleEditEstoque = (item) => {
    setFormMode('edit');
    setSelectedItem(item);
    setFormData({
      quantidade: String(item.quantidade || ''),
      dataMovimento: new Date().toISOString().split('T')[0],
      tipo: 'entrada',
    });
    setModalVisible(true);
  };

  const handleViewEstoque = (item) => {
    setFormMode('view');
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleSaveEstoque = async () => {
    // Validação
    if (!formData.quantidade.trim()) {
      Alert.alert('Erro', 'Quantidade é obrigatória');
      return;
    }

    const quantidade = parseInt(formData.quantidade);
    if (isNaN(quantidade) || quantidade <= 0) {
      Alert.alert('Erro', 'Quantidade deve ser um número maior que 0');
      return;
    }

    try {
      const data = {
        quantidade: quantidade,
        dataMovimento: formData.dataMovimento,
        tipo: formData.tipo,
      };

      if (formMode === 'edit') {
        await estoqueAPI.update(selectedItem.id, data);
        Alert.alert('Sucesso', 'Estoque atualizado com sucesso');
      }

      setModalVisible(false);
      loadEstoque();
    } catch (error) {
      console.error('Erro ao salvar estoque:', error);
      Alert.alert('Erro', 'Falha ao salvar dados de estoque');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEstoque();
    setRefreshing(false);
  };

  const renderEstoqueItem = ({ item }) => {
    const statusColor =
      item.quantidade > 10 ? '#27ae60' : item.quantidade > 0 ? '#f39c12' : '#e74c3c';

    return (
      <TouchableOpacity
        style={styles.estoqueCard}
        onPress={() => handleViewEstoque(item)}
      >
        <View style={styles.estoqueInfo}>
          <Text style={styles.produtoNome} numberOfLines={1}>
            {item.produto?.nome}
          </Text>
          <Text style={styles.produtoSKU}>{item.sku || 'SKU não definido'}</Text>
          <View style={styles.estoqueDetails}>
            <View style={[styles.quantidadeBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.quantidadeText}>{item.quantidade} un</Text>
            </View>
            <Text style={styles.ultimoMovimento}>
              {new Date(item.dataMovimento).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        </View>
        <Text style={styles.detailsArrow}>›</Text>
      </TouchableOpacity>
    );
  };

  const renderModalContent = () => {
    if (formMode === 'view') {
      return (
        <ScrollView>
          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>Produto</Text>
            <Text style={styles.modalValue}>{selectedItem?.produto?.nome}</Text>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>SKU</Text>
            <Text style={styles.modalValue}>{selectedItem?.sku || 'Não definido'}</Text>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>Quantidade Atual</Text>
            <Text style={[styles.modalValue, { fontSize: 18, fontWeight: 'bold' }]}>
              {selectedItem?.quantidade} unidades
            </Text>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>Último Movimento</Text>
            <Text style={styles.modalValue}>
              {new Date(selectedItem?.dataMovimento).toLocaleDateString(
                'pt-BR',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }
              )}
            </Text>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>Tipo de Movimento</Text>
            <Text style={styles.modalValue}>{selectedItem?.tipo}</Text>
          </View>

          <View style={styles.statusIndicator}>
            {selectedItem?.quantidade > 10 && (
              <Text style={styles.statusGood}>✓ Em estoque</Text>
            )}
            {selectedItem?.quantidade > 0 && selectedItem?.quantidade <= 10 && (
              <Text style={styles.statusWarning}>⚠ Estoque baixo</Text>
            )}
            {selectedItem?.quantidade === 0 && (
              <Text style={styles.statusDanger}>✕ Fora de estoque</Text>
            )}
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.button, styles.buttonEdit]}
              onPress={() => handleEditEstoque(selectedItem)}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView>
        <View style={styles.modalSection}>
          <Text style={styles.label}>Produto</Text>
          <Text style={styles.readOnlyValue}>{selectedItem?.produto?.nome}</Text>
        </View>

        <View style={styles.modalSection}>
          <Text style={styles.label}>Quantidade *</Text>
          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            value={formData.quantidade}
            onChangeText={(value) =>
              setFormData({ ...formData, quantidade: value })
            }
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.modalSection}>
          <Text style={styles.label}>Data do Movimento</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#f5f5f5' }]}
            placeholder="YYYY-MM-DD"
            value={formData.dataMovimento}
            onChangeText={(value) =>
              setFormData({ ...formData, dataMovimento: value })
            }
            editable={false}
          />
        </View>

        <View style={styles.modalSection}>
          <Text style={styles.label}>Tipo de Movimento</Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.tipo === 'entrada' && styles.typeButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, tipo: 'entrada' })}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  formData.tipo === 'entrada' && styles.typeButtonTextActive,
                ]}
              >
                Entrada
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.tipo === 'saida' && styles.typeButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, tipo: 'saida' })}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  formData.tipo === 'saida' && styles.typeButtonTextActive,
                ]}
              >
                Saída
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.modalActions}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSave]}
            onPress={handleSaveEstoque}
          >
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonCancel]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Estoque</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#27ae60" />
        </View>
      ) : filteredEstoque.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Nenhum item de estoque encontrado</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEstoque}
          renderItem={renderEstoqueItem}
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
            <Text style={styles.modalTitle}>
              {formMode === 'view' ? 'Detalhes do Estoque' : 'Editar Estoque'}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>{renderModalContent()}</View>
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
  searchContainer: {
    padding: 12,
    paddingBottom: 8,
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
  list: {
    padding: 12,
  },
  estoqueCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  estoqueInfo: {
    flex: 1,
    marginRight: 12,
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  produtoSKU: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  estoqueDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantidadeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  quantidadeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  ultimoMovimento: {
    fontSize: 12,
    color: '#666',
  },
  detailsArrow: {
    fontSize: 20,
    color: '#bbb',
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
  },
  modalLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  modalValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  readOnlyValue: {
    fontSize: 14,
    color: '#555',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  typeButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  statusIndicator: {
    backgroundColor: '#ecf0f1',
    borderRadius: 6,
    padding: 12,
    marginVertical: 12,
    alignItems: 'center',
  },
  statusGood: {
    color: '#27ae60',
    fontWeight: '600',
    fontSize: 14,
  },
  statusWarning: {
    color: '#f39c12',
    fontWeight: '600',
    fontSize: 14,
  },
  statusDanger: {
    color: '#e74c3c',
    fontWeight: '600',
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonSave: {
    backgroundColor: '#27ae60',
  },
  buttonEdit: {
    backgroundColor: '#3498db',
  },
  buttonCancel: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default EstoqueAdminScreen;
