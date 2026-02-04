# 🔌 Configuração da API - Gestfy Admin Mobile

## 📍 URLs da API

### ✅ Produção (Padrão - Recomendado)

O app já está configurado para usar a API deployada:

```
https://gestfy-backend.onrender.com/api
```

**Vantagens**:
- Funciona em qualquer lugar
- Sem necessidade de backend local
- Dados sincronizados com web
- Pronto para produção

### 🔧 Desenvolvimento Local

Se você quer rodar o backend localmente:

**Arquivo**: `src/services/api.js`

**Passo 1**: Abra o arquivo
```bash
src/services/api.js
```

**Passo 2**: Encontre a linha (≈11):
```javascript
// URL base da API - Use a URL deployada do backend
const API_BASE_URL = 'https://gestfy-backend.onrender.com/api';
```

**Passo 3**: Descomente a linha abaixo:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

**Passo 4**: Comente a URL deployada:
```javascript
// const API_BASE_URL = 'https://gestfy-backend.onrender.com/api';
```

**Resultado Final**:
```javascript
// URL base da API - Use a URL deployada do backend
// const API_BASE_URL = 'https://gestfy-backend.onrender.com/api';

// Para desenvolvimento local, descomente a linha abaixo:
const API_BASE_URL = 'http://localhost:8080/api';
```

**Passo 5**: Salve o arquivo

**Passo 6**: Reinicie o Expo
- Ctrl+C no terminal
- Rode `npx expo start` novamente

---

## 🚀 Endpoints Disponíveis

Todos os endpoints retornam JSON e requerem o Bearer token no header.

### 🔐 Autenticação
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@gestfy.com",
  "password": "senha123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "Administrador",
    "email": "admin@gestfy.com"
  }
}
```

### 📦 Produtos
```http
GET /produtos
GET /produtos/:id
POST /produtos
PUT /produtos/:id
DELETE /produtos/:id
```

**Exemplo POST**:
```json
{
  "nome": "Sorvete Chocolate",
  "descricao": "Sorvete artesanal sabor chocolate",
  "preco": 15.50,
  "estoque": 50
}
```

### 📋 Pedidos
```http
GET /pedidos
GET /pedidos/:id
POST /pedidos
PUT /pedidos/:id
DELETE /pedidos/:id
```

**Exemplo PUT (alterar status)**:
```json
{
  "status": "Enviado"
}
```

**Status válidos**: Pendente, Confirmado, Enviado, Entregue, Cancelado

### 📦 Estoque
```http
GET /estoque
GET /estoque/:id
POST /estoque
PUT /estoque/:id
DELETE /estoque/:id
```

**Exemplo POST**:
```json
{
  "quantidade": 100,
  "dataMovimento": "2026-02-04",
  "tipo": "entrada"
}
```

### 📊 Relatórios
```http
GET /relatorios
GET /relatorios/vendas
GET /relatorios/estoque
GET /relatorios/financeiro
```

---

## 🔐 Autenticação & Headers

### Token JWT

Após login, o token é salvo automaticamente no AsyncStorage.

**Header automático adicionado**:
```http
Authorization: Bearer <token>
```

**Interceptador (automático)**:
```javascript
config.headers.Authorization = `Bearer ${token}`;
```

### Erro 401 (Token Expirado)

Se receber erro 401:
- Token é removido automaticamente
- Você é redirecionado para login
- Refaça o login

---

## 🧪 Testar Endpoints (Manual)

### Usando cURL

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gestfy.com","password":"senha123"}'

# Listar produtos (com token)
curl -X GET http://localhost:8080/api/produtos \
  -H "Authorization: Bearer TOKEN_AQUI"

# Criar produto
curl -X POST http://localhost:8080/api/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -d '{"nome":"Sorvete","preco":15.50,"estoque":50}'
```

### Usando Postman

1. Importe `https://gestfy-backend.onrender.com`
2. Crie coleção com variável `{{token}}`
3. Primeiro teste: POST /auth/login
4. Copie token da resposta
5. Use token nos próximos requests

---

## 🔄 Requisições com Axios

### Exemplo Básico

```javascript
import { produtosAPI } from '../services/api';

// Listar
const produtos = await produtosAPI.getAll();

// Obter um
const produto = await produtosAPI.getById(1);

// Criar
await produtosAPI.create({
  nome: 'Sorvete',
  preco: 15.50,
  estoque: 50
});

// Atualizar
await produtosAPI.update(1, {
  nome: 'Sorvete Novo',
  preco: 16.00
});

// Deletar
await produtosAPI.delete(1);
```

### Tratamento de Erros

```javascript
try {
  const data = await produtosAPI.getAll();
} catch (error) {
  if (error.response?.status === 401) {
    // Token expirado
    console.log('Refaça o login');
  } else if (error.response?.status === 400) {
    // Dados inválidos
    console.log(error.response.data.message);
  } else if (error.response?.status === 500) {
    // Erro no servidor
    console.log('Servidor indisponível');
  } else if (error.message === 'Network Error') {
    // Sem conexão
    console.log('Sem conexão de internet');
  }
}
```

---

## 📊 Status HTTP Esperados

| Código | Significado | O que fazer |
|--------|------------|------------|
| 200 | OK | Sucesso |
| 201 | Created | Criado com sucesso (POST) |
| 400 | Bad Request | Dados inválidos |
| 401 | Unauthorized | Token inválido/expirado |
| 403 | Forbidden | Sem permissão |
| 404 | Not Found | Recurso não existe |
| 500 | Server Error | Erro no backend |
| Network Error | Sem conexão | Verifique internet |

---

## 🛠️ Debug

### Ver Requisições no Console

Adicione ao `src/services/api.js`:

```javascript
// Interceptador de request (adicionar log)
api.interceptors.request.use((config) => {
  console.log('REQUEST:', config.method.toUpperCase(), config.url);
  return config;
});

// Interceptador de response (adicionar log)
api.interceptors.response.use((response) => {
  console.log('RESPONSE:', response.status, response.data);
  return response;
});
```

### Ver no Expo DevTools

1. Agitar o dispositivo (Android)
2. Ou Ctrl+D (iOS)
3. Abra "Debug Remote JS"
4. Abra Console do navegador
5. Veja logs

---

## ✅ Checklist de Configuração

### Produção
- [x] URL: `https://gestfy-backend.onrender.com/api`
- [x] Backend deployado no Render
- [x] Banco PostgreSQL (NEON) conectado
- [x] Sem mudanças de código necessárias

### Desenvolvimento
- [ ] Backend rodando localmente: `http://localhost:8080`
- [ ] Configurou `src/services/api.js`
- [ ] Reiniciou Expo
- [ ] Testou login
- [ ] Testou um CRUD

---

## 🔌 Conectividade

### Problema: Network Error

**Possíveis causas**:
1. Sem internet
2. Firewall bloqueando
3. URL errada em `api.js`
4. Backend offline

**Solução**:
```bash
# Testar conectividade
ping google.com

# Testar API
curl https://gestfy-backend.onrender.com/api/produtos

# Se localhost, testar backend
curl http://localhost:8080/api/produtos
```

### Problema: CORS Error

**Possível causa**: Backend sem CORS habilitado

**Solução**: Backend já tem:
```java
@CrossOrigin(origins = "*")
```

---

## 📚 Referência Rápida

| Função | Local |
|--------|-------|
| API Config | `src/services/api.js` |
| Auth | `src/storage/authStorage.js` |
| Login | `src/screens/AdminLoginScreen.js` |
| Usar API | Qualquer tela (import api) |

---

## 🎯 Próximos Passos

1. ✅ Configure a API (este documento)
2. Faça login com sucesso
3. Teste cada módulo (Produtos, Pedidos, etc)
4. Se tudo OK, você está pronto!

---

**Versão**: 1.0.0  
**Data**: 04 de fevereiro de 2026  
**Status**: Pronto para uso
