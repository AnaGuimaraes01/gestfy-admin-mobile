# 📱 Guia de Uso - Gestfy Admin Mobile

## 🎯 Como Usar o Aplicativo

### 1. **Login**
- Email: *seu email do administrador*
- Senha: *sua senha*
- Clique em "Entrar"

Seu token será salvo automaticamente no dispositivo.

### 2. **Dashboard**
Página inicial com:
- Número total de pedidos
- Número total de produtos
- Número de movimentações de estoque
- Menu com opções de navegação

### 3. **Produtos**
**Funcionalidades**:
- 🔍 Buscar por nome
- ➕ Adicionar novo produto
- ✏️ Editar produto existente
- 🗑️ Excluir produto
- 📋 Ver detalhes completos

**Campos obrigatórios**: Nome e Preço

### 4. **Pedidos**
**Funcionalidades**:
- 📋 Listar todos os pedidos
- 🔍 Buscar por ID ou nome do cliente
- 🏷️ Filtrar por status:
  - Pendente
  - Confirmado
  - Enviado
  - Entregue
  - Cancelado
- 📊 Visualizar detalhes completos
- 🔄 Alterar status do pedido

### 5. **Estoque**
**Funcionalidades**:
- 📦 Listar itens de estoque
- 🔍 Buscar por produto
- 📈 Editar quantidade
- ➡️ Tipo de movimento (Entrada/Saída)
- 🔴 Indicadores visuais:
  - Verde: Em estoque
  - Laranja: Baixo estoque
  - Vermelho: Fora de estoque

### 6. **Relatórios**
**Incluem**:
- 📊 **Vendas**: Total de pedidos, receita, ticket médio
- 📦 **Estoque**: Total de produtos, quantidade, produtos baixo estoque
- 💰 **Financeiro**: Receita total, pedidos pendentes/pagos/cancelados
- 🔄 Botão para atualizar dados

### 7. **Sair**
Clique em "Sair" no Dashboard para fazer logout.

---

## ⚙️ Configuração

### Para Usar com Backend Deployado (Padrão)
Nenhuma configuração necessária. O app já está configurado para `https://gestfy-backend.onrender.com/api`

### Para Usar com Backend Local
1. Abra `src/services/api.js`
2. Descomente: `const API_BASE_URL = 'http://localhost:8080/api';`
3. Comente: `const API_BASE_URL = 'https://gestfy-backend.onrender.com/api';`
4. Salve e reinicie o app

---

## 🔐 Segurança

- ✅ Todas as senhas são enviadas criptografadas (HTTPS)
- ✅ Token JWT é armazenado de forma segura
- ✅ Sessão expira automaticamente se token inválido
- ✅ Logout limpa todos os dados locais

---

## 📊 Funcionalidades por Módulo

### Produtos Admin
```
✅ Listar
✅ Buscar
✅ Criar
✅ Editar
✅ Deletar
```

### Pedidos Admin
```
✅ Listar
✅ Filtrar por status
✅ Buscar
✅ Visualizar detalhes
✅ Atualizar status
✅ Ver itens do pedido
```

### Estoque
```
✅ Listar
✅ Buscar
✅ Visualizar quantidade
✅ Editar quantidade
✅ Tipo de movimento
✅ Status visual
```

### Relatórios
```
✅ Vendas
✅ Estoque
✅ Financeiro
✅ Refresh manual
```

---

## 💡 Dicas

1. **Pull-to-Refresh**: Puxe para baixo na lista para atualizar dados
2. **Voltar**: Use o botão voltar do seu dispositivo
3. **Conexão**: Verifique sua internet se receber erro "Network Error"
4. **Token Expirado**: Faça logout e login novamente
5. **Campos Vazios**: Todos os erros aparecem com mensagens claras

---

## ❌ Erros Comuns

| Erro | O que significa | Solução |
|------|-----------------|----------|
| "Email ou senha inválidos" | Credenciais incorretas | Verifique email e senha |
| "Network Error" | Sem conexão com a API | Verifique internet e URL |
| "Erro no servidor" | Backend com problema | Aguarde e tente novamente |
| Tela branca | App travado | Feche e reabra o Expo Go |

---

## 📞 Informações de Suporte

- **Backend**: `https://gestfy-backend.onrender.com`
- **Banco de Dados**: PostgreSQL NEON (administrado pelo backend)
- **Documentação**: Veja `CONVERSAO_WEB_TO_MOBILE.md`

---

**Versão do App**: 1.0.0  
**Data**: 04 de fevereiro de 2026  
**Desenvolvido em**: React Native + Expo
