# 🎄 Chat de Natal 2024

Um aplicativo de chat natalino para até 8 usuários, com chat global e mensagens diretas!

## ✨ Funcionalidades

- 🎅 **Chat Global**: Todos os usuários podem conversar em um único chat
- 💬 **Mensagens Diretas**: Envie mensagens privadas para outros usuários
- 👥 **Lista de Usuários**: Veja quem está online em tempo real
- 🎨 **Tema Natalino**: Interface totalmente tematizada para o Natal
- 📱 **Mobile First**: Otimizado para dispositivos móveis
- 🔐 **Autenticação**: Login seguro com token JWT (40 dias de expiração)
- ❄️ **Efeitos Visuais**: Neve caindo e animações festivas

## 🛠️ Tecnologias

### Backend

- Node.js + Express
- MongoDB + Mongoose
- Socket.io (chat em tempo real)
- JWT (autenticação)
- bcryptjs (criptografia)

### Frontend

- React 18
- Tailwind CSS
- Socket.io Client
- Zustand (gerenciamento de estado)
- React Router DOM

## 📱 Dispositivos Suportados

- iPhone SE, 6, 7, 8
- iPhone X, XR, 11, 12, 13, 14, 15
- iPhone 14/15 Pro Max
- Redmi, Samsung Galaxy, Pixel
- Qualquer dispositivo com navegador moderno

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ instalado
- MongoDB instalado e rodando
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/YagoCastelao/appnatal.git
cd appnatal
```

### 2. Configure o Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Edite o arquivo .env com suas configurações:
# - MONGODB_URI: URL do seu MongoDB
# - JWT_SECRET: Chave secreta para tokens
# - PORT: Porta do servidor (padrão: 5000)
# - CLIENT_URL: URL do frontend (padrão: http://localhost:5173)

# Iniciar o servidor
npm run dev
```

### 3. Configure o Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar o aplicativo
npm run dev
```

### 4. Acesse o aplicativo

Abra seu navegador em: `http://localhost:5173`

## 📁 Estrutura do Projeto

```
appnatal/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── DirectMessage.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── messages.js
│   │   └── directMessages.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── public/
    │   └── christmas-tree.svg
    ├── src/
    │   ├── components/
    │   │   ├── Avatar.jsx
    │   │   ├── BottomNav.jsx
    │   │   ├── ChristmasLights.jsx
    │   │   ├── Header.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── MessageBubble.jsx
    │   │   ├── MessageInput.jsx
    │   │   ├── Snowfall.jsx
    │   │   ├── TypingIndicator.jsx
    │   │   └── UserList.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── GlobalChatPage.jsx
    │   │   ├── UsersPage.jsx
    │   │   ├── MessagesPage.jsx
    │   │   ├── DirectMessagePage.jsx
    │   │   └── ProfilePage.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── socket.js
    │   ├── store/
    │   │   ├── authStore.js
    │   │   └── chatStore.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## 🎅 Avatares Natalinos

Cada usuário recebe um avatar natalino único ao se registrar:

- 🎅 Papai Noel
- 🤶 Mamãe Noel
- 🦌 Rena
- ⛄ Boneco de Neve
- 🎄 Árvore de Natal
- 🎁 Presente
- 👼 Anjo
- ❄️ Floco de Neve

## 🎨 Cores do Tema

- 🔴 Vermelho Natalino: `#c41e3a`
- 🟢 Verde Pinheiro: `#165b33`
- 🟡 Dourado: `#ffd700`
- ⚪ Neve: `#fffafa`

## 📝 API Endpoints

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter dados do usuário logado
- `POST /api/auth/logout` - Fazer logout

### Usuários

- `GET /api/users` - Listar todos os usuários
- `GET /api/users/online` - Listar usuários online
- `GET /api/users/:id` - Obter usuário específico
- `PUT /api/users/avatar` - Atualizar avatar

### Mensagens Globais

- `GET /api/messages` - Obter mensagens do chat global
- `POST /api/messages` - Enviar mensagem
- `DELETE /api/messages/:id` - Deletar mensagem

### Mensagens Diretas

- `GET /api/dm/conversations` - Listar conversas
- `GET /api/dm/:userId` - Obter mensagens com usuário
- `POST /api/dm/:userId` - Enviar mensagem direta

## 🔒 Segurança

- Senhas criptografadas com bcrypt
- Tokens JWT com expiração de 40 dias
- Proteção de rotas no frontend e backend
- Validação de dados

## 🎄 Feliz Natal!

Feito com ❤️ para celebrar o Natal 2025!

---

**Desenvolvido por Yago Castelao**
