# 🚀 PRIMEIRO USO - Guia Passo a Passo

## ⏱️ Tempo Estimado: 10 minutos

---

## ✅ PASSO 1: Verificar Pré-requisitos (2 min)

### Windows/Mac/Linux

Abra um terminal e execute:

```bash
node --version
npm --version
```

### Resultado esperado:
```
v16.0.0 (ou superior)
8.0.0 (ou superior)
```

**Não tem Node.js?**  
Baixe em: https://nodejs.org/

---

## ✅ PASSO 2: Navegar para o Projeto (1 min)

### Windows (PowerShell/CMD)
```bash
cd C:\Users\Ana Carla\Desktop\gestfy-admin-mobile
```

### Mac/Linux
```bash
cd ~/Desktop/gestfy-admin-mobile
```

---

## ✅ PASSO 3: Instalar Dependências (5 min)

Execute no terminal:

```bash
npm install
```

### Esperado
- Vários pacotes serão baixados
- Criará pasta `node_modules`
- Fim com mensagem "added X packages"

### Se der erro
Tente:
```bash
npm install --legacy-peer-deps
```

---

## ✅ PASSO 4: Iniciar o Aplicativo (1 min)

### Opção 1: Windows (Automático)
Clique 2x em:
```
start.bat
```

### Opção 2: Linux/Mac (Automático)
```bash
bash start.sh
```

### Opção 3: Manual (Qualquer OS)
```bash
npx expo start
```

---

## ✅ PASSO 5: Conectar ao Dispositivo

### Android
1. Instale o app **Expo Go** da Google Play
2. Abra Expo Go
3. Escaneie o **QR code** mostrado no terminal
4. App abrirá automaticamente

### iOS
1. Abra a câmera nativa
2. Aponte para o **QR code** do terminal
3. Toque na notificação "Open in Expo Go"
4. App abrirá automaticamente

### Web (Teste Rápido)
No terminal onde rodou Expo, pressione:
```
w
```

---

## 🎯 PASSO 6: Fazer Login

### Credenciais Padrão

Usando um email de admin no seu sistema:

**Email**: seu@email.com  
**Senha**: sua_senha

(Mesmo login do painel web admin)

### O que esperar
1. Tela de login carrega
2. Digita email e senha
3. Clica "Entrar"
4. Vê Dashboard com estatísticas
5. Pode acessar: Produtos, Pedidos, Estoque, Relatórios

---

## 📱 PASSO 7: Explorar as Funcionalidades

### Dashboard
- Clique em **Bem-vindo** para ver estatísticas
- Clique em **Sair** para fazer logout

### Produtos
- Clique em **Produtos**
- Veja a lista
- Clique **+ Novo** para criar
- Clique em um produto para editar/deletar

### Pedidos
- Clique em **Pedidos**
- Filtro por status (selecione)
- Busque por ID ou cliente
- Clique em um pedido para ver detalhes
- Altere o status do pedido

### Estoque
- Clique em **Estoque**
- Veja quantidade disponível
- Clique em um item para editar
- Movimentações entrada/saída

### Relatórios
- Clique em **Relatórios**
- Veja métricas de vendas, estoque e financeiro
- Clique **🔄 Atualizar** para sincronizar dados

---

## 🔧 TROUBLESHOOTING RÁPIDO

### ❌ "Expo command not found"
```bash
npm install -g expo-cli
npx expo start
```

### ❌ "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### ❌ "Network Error" no login
- Verifique sua internet
- Backend está rodando? `https://gestfy-backend.onrender.com`

### ❌ App fica em branco
- Feche Expo Go
- No terminal: Ctrl+C
- Execute: `npx expo start --clear`

### ❌ "Permission denied" (Linux/Mac)
```bash
chmod +x start.sh
bash start.sh
```

---

## 💡 DICAS ÚTEIS

### Pull-to-Refresh
Puxe a lista para baixo para atualizar dados

### Voltar
Use o botão voltar nativo do seu dispositivo

### Offline
App funciona offline, mas sincroniza quando conectar

### Cache
Se ficar lento: `expo start --clear`

### Modo Dev
Abra menu: Agitar o dispositivo (Android) ou Ctrl+D (iOS)

---

## 🎯 PRÓXIMOS PASSOS

### Para Desenvolvedores
1. Edite `App.js` para adicionar novas telas
2. Crie componentes em `src/screens/`
3. Adicione APIs em `src/services/api.js`

### Para Produção
1. Configure o ambiente de produção
2. Gere apk/ipa com EAS
3. Faça upload nas lojas

### Documentação
- 📖 Leia `README.md`
- 📖 Leia `GUIA_USO.md`
- 📖 Leia `CONVERSAO_WEB_TO_MOBILE.md`

---

## ✅ Checklist de Primeiro Uso

- [ ] Node.js instalado
- [ ] npm funcionando
- [ ] Navegou para a pasta do projeto
- [ ] Executou `npm install`
- [ ] Iniciou com `npx expo start`
- [ ] Escaneou o QR code
- [ ] Fez login com sucesso
- [ ] Viu o Dashboard
- [ ] Testou Produtos
- [ ] Testou Pedidos
- [ ] Testou Estoque
- [ ] Viu Relatórios

---

## 📞 AINDA NÃO FUNCIONOU?

### Verificar

1. **Terminal/Console**
   - Há erros de JavaScript?
   - Há erros de rede?
   - Há logs de sucesso?

2. **Conectividade**
   - WiFi conectado?
   - Mesma rede para celular?
   - Firewall bloqueando?

3. **Projeto**
   - Pasta `gestfy-admin-mobile` existe?
   - `node_modules` foi criada?
   - `App.js` existe?

4. **Device**
   - Expo Go instalado?
   - Versão atualizada?
   - Espaço em disco?

---

## 🎉 PARABÉNS!

Você agora tem o **Gestfy Admin Mobile** funcionando! 🚀

Aproveite para gerenciar seu negócio em qualquer lugar, em qualquer hora!

---

**Próximo passo**: Leia `GUIA_USO.md` para explorar todas as funcionalidades!

**Versão**: 1.0.0  
**Data**: 04 de fevereiro de 2026
