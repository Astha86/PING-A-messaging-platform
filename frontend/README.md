# **Ping – Frontend Experience (Next.js + TypeScript)**

Ping's frontend is a high-performance **Next.js+** and **TypeScript** application featuring stunning, dark-themed UI, rich micro-animations, and real-time connectivity.

---

## **Key Features**

- **Real-Time Connectivity**: Native-feeling chat powered by **Socket.IO**.
- **Responsive Layout**: Seamless switching between sidebar and message view on mobile devices.
- **Premium Aesthetics**: Gradient-heavy, blurred glass-morphism components and custom dark theme.
- **Smart Components**:
  - `MessageArea`: Dynamic message list with custom infinite scrolling behavior.
  - `MessageHeader`: Real-time presence indicators ("Online/Offline") and user stats.
  - `MessageInput`: Custom rich input with **Emoji Picker** and media handling.

---

## **Component Breakdown**

```bash
FRONTEND/
├── src/app/
│   ├── chat/             # Chat Interface
│   ├──  login/           # Login Interface
│   ├──  verify/          # Verify Interface
├── src/components/       # Modular, atomic components
│   ├── ChatSidebar.tsx   # Contact list, search, and activity tracking
│   ├── MessageArea.tsx   # Message bubble rendering and seen-status handling
│   ├── MessageInput.tsx  # Emoji-enabled, auto-scaling message input
│   ├── MessageHeader.tsx # Responsive chat controls and user detail
│   └── Loading.tsx       # Centralized, high-end loading animations
└── src/context/          # Global state (AppContext, SocketContext)
```

---

## **Deployment & Running Locally**

### **Option 1: Using Docker Compose**
Run the frontend along with the entire backend ecosystem from the project root:
```bash
docker-compose up --build -d
```
The application will be accessible at `http://localhost:3000`.

### **Option 2: Manual Development Mode**
If you prefer running just the frontend manually:

#### **1. Installation**
```bash
npm install
```

#### **2. Start Development**
```bash
npm run dev
```

---

## **Core Workflows**

### **Mobile View Management**

The UI uses conditional Tailwind classes and `selectedUser` state to intelligently hide the sidebar and show the chat area on smaller screens.

### **Real-time Engine**

We use `SocketContext` to provide a single WebSocket instance throughout the app, enabling:

- Incoming message live-updates.
- Message "Read/Seen" notifications.
- Real-time presence detection.

---

## **✨ Modern UI Highlights**

- **Lucide-React** for sharp iconography.
- **Tailwind CSS** for a streamlined, utility-first design system.
- **Custom Scroll-bars** to maintain a deep-space dark theme consistency.

---

_Ping: Designed for a modern web._
