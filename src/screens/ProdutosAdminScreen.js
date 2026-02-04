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
import { produtosAPI } from '../services/api';

const ProdutosAdminScreen = ({ navigation }) => {
  const [produtos, setProdutos] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('view'); // view, edit, create

  // Form states
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    estoque: '',
  });

  useFocusEffect(
    React.useCallback(() => {
      loadProdutos();
    }, [])
  );

  useEffect(() => {
    filterProdutos();
  }, [searchQuery, produtos]);

  const loadProdutos = async () => {
    setLoading(true);
    try {
      const data = await produtosAPI.getAll();
      setProdutos(Array.isArray(data) ? data : []);
      setFilteredProdutos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      Alert.alert('Erro', 'Falha ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const filterProdutos = () => {
    if (!searchQuery.trim()) {
      setFilteredProdutos(produtos);
      return;
    }

    const filtered = produtos.filter((produto) =>
      produto.nome?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProdutos(filtered);
  };

  const handleAddProduto = () => {
    setFormMode('create');
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      estoque: '',
    });
    setSelectedProduto(null);
    setModalVisible(true);
  };

  const handleEditProduto = (produto) => {
    setFormMode('edit');
    setSelectedProduto(produto);
    setFormData({
      nome: produto.nome || '',
      descricao: produto.descricao || '',
      preco: String(produto.preco || ''),
      estoque: String(produto.estoque || ''),
    });
    setModalVisible(true);
  };

  const handleViewProduto = (produto) => {
    setFormMode('view');
    setSelectedProduto(produto);
    setModalVisible(true);
  };

  const handleSaveProduto = async () => {
    // Validação
    if (!formData.nome.trim()) {
      Alert.alert('Erro', 'Nome do produto é obrigatório');
      return;
    }

    if (!formData.preco.trim()) {
      Alert.alert('Erro', 'Preço é obrigatório');
      return;
    }

    const preco = parseFloat(formData.preco);
    if (isNaN(preco)) {
      Alert.alert('Erro', 'Preço deve ser um número válido');
      return;
    }

    try {
      const data = {
        nome: formData.nome.trim(),
        descricao: formData.descricao.trim(),
        preco: preco,
        estoque: parseInt(formData.estoque) || 0,
      };

      if (formMode === 'create') {
        await produtosAPI.create(data);
        Alert.alert('Sucesso', 'Produto criado com sucesso');
      } else if (formMode === 'edit') {
        await produtosAPI.update(selectedProduto.id, data);
        Alert.alert('Sucesso', 'Produto atualizado com sucesso');
      }

      setModalVisible(false);
      loadProdutos();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      Alert.alert('Erro', 'Falha ao salvar produto');
    }
  };

  const handleDeleteProduto = (produto) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir o produto "${produto.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await produtosAPI.delete(produto.id);
              Alert.alert('Sucesso', 'Produto excluído com sucesso');
              loadProdutos();
            } catch (error) {
              console.error('Erro ao excluir produto:', error);
              Alert.alert('Erro', 'Falha ao excluir produto');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProdutos();
    setRefreshing(false);
  };

  const renderProdutoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.produtoCard}
      onPress={() => handleViewProduto(item)}
    >
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome} numberOfLines={1}>
          {item.nome}
        </Text>
        <Text style={styles.produtoDescricao} numberOfLines={1}>
          {item.descricao}
        </Text>
        <View style={styles.produtoDetails}>
          <Text style={styles.produtoPreco}>R$ {item.preco?.toFixed(2)}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.estoque} un</Text>
          </View>
        </View>
      </View>
      <Text style={styles.detailsArrow}>›</Text>
    </TouchableOpacity>
  );

  const renderModalContent = () => {
    if (formMode === 'view') {
      return (
        <ScrollView>
          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>Nome</Text>
            <Text style={styles.modalValue}>{selectedProduto?.nome}</Text>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>Descrição</Text>
            <Text style={styles.modalValue}>{selectedProduto?.descricao}</Text>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>Preço</Text>
            <Text style={styles.modalValue}>
              R$ {selectedProduto?.preco?.toFixed(2)}
            </Text>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>Estoque</Text>
            <Text style={styles.modalValue}>{selectedProduto?.estoque} unidades</Text>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.button, styles.buttonEdit]}
              onPress={() => handleEditProduto(selectedProduto)}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonDelete]}
              onPress={() => {
                setModalVisible(false);
                handleDeleteProduto(selectedProduto);
              }}
            >
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView>
        <View style={styles.modalSection}>
          <Text style={styles.label}>Nome *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do produto"
            value={formData.nome}
            onChangeText={(value) =>
              setFormData({ ...formData, nome: value })
            }
            editable={formMode !== 'view'}
          />
        </View>

        <View style={styles.modalSection}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descrição do produto"
            value={formData.descricao}
            onChangeText={(value) =>
              setFormData({ ...formData, descricao: value })
            }
            multiline={true}
            numberOfLines={3}
            editable={formMode !== 'view'}
          />
        </View>

        <View style={styles.modalSection}>
          <Text style={styles.label}>Preço (R$) *</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={formData.preco}
            onChangeText={(value) =>
              setFormData({ ...formData, preco: value })
            }
            keyboardType="decimal-pad"
            editable={formMode !== 'view'}
          />
        </View>

        <View style={styles.modalSection}>
          <Text style={styles.label}>Estoque</Text>
          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            value={formData.estoque}
            onChangeText={(value) =>
              setFormData({ ...formData, estoque: value })
            }
            keyboardType="number-pad"
            editable={formMode !== 'view'}
          />
        </View>

        <View style={styles.modalActions}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSave]}
            onPress={handleSaveProduto}
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
        <Text style={styles.headerTitle}>Produtos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddProduto}
        >
          <Text style={styles.addButtonText}>+ Novo</Text>
        </TouchableOpacity>
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
      ) : filteredProdutos.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProdutos}
          renderItem={renderProdutoItem}
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
              {formMode === 'view'
                ? 'Ver Produto'
                : formMode === 'edit'
                ? 'Editar Produto'
                : 'Novo Produto'}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  searchContainer: {
    padding: 16,
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
  produtoCard: {
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
  produtoInfo: {
    flex: 1,
    marginRight: 12,
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  produtoDescricao: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  produtoDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  produtoPreco: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27ae60',
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
  textArea: {
    textAlignVertical: 'top',
    paddingVertical: 10,
    minHeight: 80,
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
  buttonDelete: {
    backgroundColor: '#e74c3c',
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

export default ProdutosAdminScreen;
