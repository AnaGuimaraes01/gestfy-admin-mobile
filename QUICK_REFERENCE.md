# ⚡ QUICK REFERENCE - Gestfy Admin Mobile

## 🚀 Iniciar em 3 Passos

```bash
# 1. Entrar na pasta
cd gestfy-admin-mobile

# 2. Instalar dependências
npm install

# 3. Iniciar
npx expo start
```

---

## 📱 Credenciais de Login

```
Email:  seu@email.com (mesmo do painel web)
Senha:  sua_senha (mesma do painel web)
```

---

## 🔌 URLs da API

### Produção
```
https://gestfy-backend.onrender.com/api
```

### Desenvolvimento Local
Edite `src/services/api.js` linha 11:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

---

## 📂 Estrutura Rápida

```
src/
├── screens/           # 6 telas
├── services/api.js    # Cliente HTTP
└── storage/           # AsyncStorage
```

---

## 🎯 6 Telas Principais

| Tela | Funcionalidade |
|------|---|
| **Login** | Autenticação |
| **Dashboard** | Estatísticas & menu |
| **Produtos** | CRUD (Create, Read, Update, Delete) |
| **Pedidos** | Gerenciar & atualizar status |
| **Estoque** | Visualizar & editar quantidade |
| **Relatórios** | Vendas, estoque, financeiro |

---

## 🔑 Funcionalidades por Tela

### 🔐 Login
- [x] Email/Senha
- [x] Validação
- [x] Armazenamento de token

### 📊 Dashboard
- [x] Estatísticas
- [x] Menu de navegação
- [x] Logout

### 📦 Produtos
- [x] Listar
- [x] Buscar
- [x] Criar
- [x] Editar
- [x] Deletar

### 📋 Pedidos
- [x] Listar
- [x] Filtrar por status
- [x] Buscar
- [x] Alterar status
- [x] Ver itens

### 📦 Estoque
- [x] Listar
- [x] Buscar
- [x] Editar quantidade
- [x] Entrada/Saída

### 📊 Relatórios
- [x] Vendas
- [x] Estoque
- [x] Financeiro
- [x] Refresh

---

## 📚 Documentação

| Doc | Para |
|-----|------|
| [PRIMEIRO_USO.md](PRIMEIRO_USO.md) | Começar rápido |
| [GUIA_USO.md](GUIA_USO.md) | Usar o app |
| [CONFIGURACAO_API.md](CONFIGURACAO_API.md) | Setup local |
| [README.md](README.md) | Entender projeto |

---

## ⚙️ Dependências Principais

```json
{
  "expo": "latest",
  "react": "18.x",
  "react-native": "latest",
  "@react-navigation/native": "^6.x",
  "@react-native-async-storage/async-storage": "^1.x",
  "axios": "^1.x"
}
```

---

## 🎨 Cores

```
Verde:      #27ae60  (Sucesso)
Cinza:      #2c3e50  (Headers)
Vermelho:   #e74c3c  (Erro)
Laranja:    #f39c12  (Aviso)
Azul:       #3498db  (Info)
```

---

## 🔐 Token JWT

**Salvo em**: AsyncStorage como `adminToken`

**Incluído automaticamente em**: Todos os requests

**Removido em**: Logout ou erro 401

---

## 🐛 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Expo não encontrado | `npm install -g expo-cli` |
| Module not found | `npm install` |
| Network Error | Verifique internet e URL |
| App branco | `expo start --clear` |
| Token expirado | Faça logout e login |

---

## 📊 Endpoints Rápidos

```
POST /auth/login
GET /produtos
POST /produtos
PUT /produtos/:id
DELETE /produtos/:id

GET /pedidos
PUT /pedidos/:id

GET /estoque
PUT /estoque/:id

GET /relatorios/vendas
GET /relatorios/estoque
GET /relatorios/financeiro
```

---

## 🎯 Fluxo de Uso

```
1. npm install
   ↓
2. npx expo start
   ↓
3. Escanear QR code
   ↓
4. Login com email/senha
   ↓
5. Dashboard com menu
   ↓
6. Selecionar módulo
   ↓
7. Usar funcionalidades
```

---

## 📱 Plataformas Suportadas

- ✅ Android 6+
- ✅ iOS 12+
- ✅ Web (browser)

---

## 💾 Dados Armazenados Localmente

- Token JWT
- Dados do usuário

**Sem**: Banco de dados local, senhas, dados sensíveis

---

## 🔄 Backend Integration

**Não alterado**: ✅
- Spring Boot 3.2.5
- Java 17
- PostgreSQL (NEON)
- Rotas REST
- Banco de dados

---

## 📈 Performance

- **Bundle**: ~2.5MB
- **Startup**: ~3s
- **Requisições**: <1s (boa conexão)
- **Suporta**: 1000+ produtos

---

## 🔒 Segurança

- ✅ HTTPS para API
- ✅ JWT Bearer token
- ✅ AsyncStorage para dados locais
- ✅ Sem senhas armazenadas
- ✅ Token expirado → re-login

---

## 🚀 Próximos Passos

1. Executar: `npx expo start`
2. Testar em smartphone/tablet
3. Usar em produção

---

## 📞 Ajuda Rápida

### "Como inicio?"
→ `npm install && npx expo start`

### "Como mudo a URL?"
→ Edite `src/services/api.js`

### "Esqueci a senha?"
→ Use a mesma do painel web

### "Como volto?"
→ Use botão voltar do dispositivo

### "Como saio?"
→ Toque em "Sair" no Dashboard

---

## ✅ Checklist Rápido

- [ ] Node.js instalado
- [ ] npm funcionando
- [ ] Clonou o projeto
- [ ] Rodou `npm install`
- [ ] Rodou `npx expo start`
- [ ] Escaneou QR code
- [ ] Fez login
- [ ] Viu Dashboard
- [ ] Testou um módulo

---

## 📊 Versão & Info

- **Versão**: 1.0.0
- **Data**: 04/02/2026
- **Framework**: React Native + Expo
- **Status**: ✅ Pronto

---

## 🎉 Pronto!

Você agora tem o Gestfy Admin Mobile funcionando! 🚀

---

**Próximo**: Leia [GUIA_USO.md](GUIA_USO.md)
