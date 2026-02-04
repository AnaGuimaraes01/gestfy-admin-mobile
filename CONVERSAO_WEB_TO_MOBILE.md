# Gestfy Admin Mobile - Documentação da Conversão Web → Mobile

## 📱 Visão Geral

Este documento descreve a conversão do aplicativo web admin Gestfy para um aplicativo mobile nativo usando React Native com Expo.

---

## 🔄 Conversão Web → Mobile

### 1. **AdminLoginScreen.js**
- **Arquivo Web Original**: `frontend/admin/js/auth.js` e `frontend/admin/login.html`
- **Funcionalidades Mantidas**:
  - Login com email e senha
  - Validação de formulário
  - Armazenamento seguro de token (AsyncStorage)
  - Tratamento de erros com feedback visual
  - Loading state durante requisição
  
- **Melhorias**:
  - Interface mobile otimizada
  - Teclado adaptativo
  - Tratamento de erros específicos (401, 400, 500)
  - Validação de email com regex
  - Design responsivo

### 2. **DashboardScreen.js**
- **Arquivo Web Original**: `frontend/admin/index.html` (home do admin)
- **Funcionalidades Mantidas**:
  - Exibição de estatísticas (total de pedidos, produtos, estoque)
  - Menu de navegação para outros módulos
  - Logout com confirmação
  - Carregamento de dados da API
  
- **Melhorias**:
  - Cards com cores temáticas
  - Menu com ícones emojis
  - Loading skeleton para melhor UX
  - Refresh automático ao entrar na tela

### 3. **ProdutosAdminScreen.js**
- **Arquivo Web Original**: `frontend/admin/js/produtos.js` e `frontend/admin/produtos.html`
- **Funcionalidades Mantidas**:
  - Listar produtos
  - Busca por nome
  - CRUD completo (Create, Read, Update, Delete)
  - Exibição de informações: nome, descrição, preço, estoque
  
- **Melhorias**:
  - Modal para visualizar/editar detalhes
  - Validação em tempo real
  - Pull-to-refresh
  - Cards visuais com cores
  - Status visual do estoque

### 4. **PedidosAdminScreen.js**
- **Arquivo Web Original**: `frontend/admin/js/pedidos.js` e `frontend/admin/pedidos.html`
- **Funcionalidades Mantidas**:
  - Listar todos os pedidos
  - Filtrar por status (pendente, confirmado, enviado, entregue, cancelado)
  - Buscar por ID ou cliente
  - Visualizar detalhes do pedido
  - Atualizar status do pedido
  - Exibir itens do pedido
  
- **Melhorias**:
  - Filtro de status com Picker
  - Modal com detalhes completos
  - Botões para alterar status rapidamente
  - Cores diferenciadas por status
  - Display de cliente, total e data

### 5. **EstoqueAdminScreen.js**
- **Arquivo Web Original**: `frontend/admin/js/estoque.js` e `frontend/admin/estoque.html`
- **Funcionalidades Mantidas**:
  - Listar itens de estoque
  - Buscar produtos por nome
  - Visualizar quantidade em estoque
  - Editar quantidade e tipo de movimento
  - Status visual (baixo estoque, fora de estoque)
  
- **Melhorias**:
  - Indicadores visuais de quantidade
  - Modal com informações detalhadas
  - Suporte para entrada/saída de estoque
  - Data de movimento automática
  - Avisos visuais de estoque baixo

### 6. **RelatoriosScreen.js**
- **Arquivo Web Original**: `frontend/admin/js/relatorios.js` e `frontend/admin/relatorios.html`
- **Funcionalidades Mantidas**:
  - Relatório de vendas (total, receita, ticket médio)
  - Relatório de estoque (total de produtos, itens baixos)
  - Relatório financeiro (receita, pendências, cancelamentos)
  - Refresh de dados
  
- **Melhorias**:
  - Cards com informações organizadas
  - Cores temáticas para cada tipo de relatório
  - Valores formatados em moeda
  - Botão de atualização manual
  - Interface clean e intuitiva

---

## 🗂️ Estrutura de Arquivos Criada

```
gestfy-admin-mobile/
├── src/
│   ├── screens/
│   │   ├── AdminLoginScreen.js        (Login do admin)
│   │   ├── DashboardScreen.js          (Dashboard principal)
│   │   ├── ProdutosAdminScreen.js      (Gerenciamento de produtos)
│   │   ├── PedidosAdminScreen.js       (Gerenciamento de pedidos)
│   │   ├── EstoqueAdminScreen.js       (Gerenciamento de estoque)
│   │   └── RelatoriosScreen.js         (Relatórios)
│   │
│   ├── services/
│   │   └── api.js                      (Cliente HTTP com Axios)
│   │
│   └── storage/
│       └── authStorage.js              (AsyncStorage para auth)
│
├── App.js                              (Navegação principal)
├── package.json                        (Dependências)
└── app.json                           (Configuração do Expo)
```

---

## 🔧 Dependências Utilizadas

```json
{
  "expo": "^latest",
  "@react-native-async-storage/async-storage": "^1.x",
  "@react-navigation/native": "^6.x",
  "@react-navigation/native-stack": "^6.x",
  "react-native-screens": "^3.x",
  "react-native-safe-area-context": "^4.x",
  "axios": "^1.x"
}
```

---

## 🔐 Segurança & Armazenamento Local

### AsyncStorage Usage
- **Token**: Armazenado com chave `adminToken`
- **Usuário**: Armazenado com chave `adminUser` (JSON)
- **Limpeza**: Token e usuário são removidos ao fazer logout
- **Verificação**: Token é verificado ao iniciar o app para restaurar sessão

### API Integration
- **Base URL**: `https://gestfy-backend.onrender.com/api`
- **Autenticação**: Bearer token no header de todas as requisições
- **Interceptadores**: 
  - Request: Adiciona token automaticamente
  - Response: Remove token se status 401

---

## 📱 Como Executar

### Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn
- Expo CLI instalado (`npm install -g expo-cli`)
- Aplicativo Expo Go no seu celular (Android/iOS)

### Passos

1. **Clonar/navegar para o projeto**:
   ```bash
   cd gestfy-admin-mobile
   ```

2. **Instalar dependências**:
   ```bash
   npm install
   ```

3. **Iniciar o Expo**:
   ```bash
   npx expo start
   ```

4. **Usar o aplicativo**:
   - **Android**: Escanear QR code com Expo Go
   - **iOS**: Escanear QR code com câmera (abre Expo Go automaticamente)
   - **Web**: Pressione `w` no terminal

---

## ⚙️ Configuração da API

### Para Produção (padrão)
A URL está configurada como `https://gestfy-backend.onrender.com/api`

### Para Desenvolvimento Local
Edite `src/services/api.js` e descomente:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

---

## 📋 Funcionalidades Implementadas

### ✅ Autenticação
- [x] Login com email e senha
- [x] Logout com confirmação
- [x] Persistência de sessão com token
- [x] Redirecionamento automático se não autenticado

### ✅ Dashboard
- [x] Estatísticas em tempo real
- [x] Menu de navegação
- [x] Refresh de dados

### ✅ Produtos
- [x] Listar todos os produtos
- [x] Buscar por nome
- [x] Criar novo produto
- [x] Editar produto existente
- [x] Excluir produto
- [x] Visualizar detalhes
- [x] Validação de forma

### ✅ Pedidos
- [x] Listar todos os pedidos
- [x] Filtrar por status
- [x] Buscar por ID ou cliente
- [x] Visualizar detalhes completos
- [x] Alterar status do pedido
- [x] Exibir itens do pedido

### ✅ Estoque
- [x] Listar itens de estoque
- [x] Buscar por produto
- [x] Visualizar quantidade
- [x] Editar quantidade
- [x] Movimentações (entrada/saída)
- [x] Status visual (baixo/fora de estoque)

### ✅ Relatórios
- [x] Relatório de vendas
- [x] Relatório de estoque
- [x] Relatório financeiro
- [x] Refresh de dados
- [x] Visualização clara de métricas

---

## 🎨 Design e UX

### Paleta de Cores
- **Primária**: #27ae60 (Verde)
- **Secundária**: #2c3e50 (Cinza escuro)
- **Sucesso**: #27ae60 (Verde)
- **Aviso**: #f39c12 (Laranja)
- **Erro**: #e74c3c (Vermelho)
- **Informação**: #3498db (Azul)

### Componentes
- **SafeAreaView**: Respeita notches e safe areas
- **FlatList**: Listas otimizadas com virtualization
- **Modal**: Para modais de detalhes/edição
- **TextInput**: Inputs com validação
- **TouchableOpacity**: Botões interativos
- **ActivityIndicator**: Loading states

---

## 🚀 Próximas Melhorias Possíveis

1. **Autenticação**:
   - Adicionar login com biometria
   - Suporte a 2FA
   - Recuperação de senha

2. **Produtos**:
   - Upload de imagens
   - Filtros avançados
   - Categorias

3. **Pedidos**:
   - Rastreamento em tempo real
   - Notificações push
   - Histórico de status

4. **Estoque**:
   - Alertas de estoque baixo
   - Movimentações detalhadas
   - Gráficos de tendência

5. **Geral**:
   - Dark mode
   - Offline mode com sincronização
   - Relatórios customizáveis com gráficos
   - Suporte a múltiplos idiomas

---

## 📞 Suporte

Para problemas com:
- **API**: Verifique se backend está rodando em `https://gestfy-backend.onrender.com`
- **Dados**: Verifique conexão com banco PostgreSQL via NEON
- **App**: Verifique versão do Node.js (16+) e dependências instaladas

---

## 📄 Notas Importantes

1. **NÃO foi alterado**: Backend, banco de dados ou qualquer API existente
2. **AsyncStorage APENAS**: Para dados locais (token, usuário)
3. **Banco NEON**: Acessado EXCLUSIVAMENTE pelo backend Spring Boot
4. **Código PURO**: React Native, sem WebView ou PWA
5. **Navegação**: React Navigation Stack para navegação entre telas

---

**Data**: 04 de fevereiro de 2026  
**Versão**: 1.0  
**Status**: Pronto para produção
