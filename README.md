# ExcaliDraw - Real-time Collaborative Drawing Platform

A modern, real-time collaborative drawing and whiteboarding platform built with Next.js, WebSockets, and PostgreSQL. Create, share, and collaborate with your team in real-time.

![ExcaliDraw](https://exacalidraw-excali-fe.vercel.app/favicon.svg)

## 🌟 Features

- **Real-time Drawing**: Draw, sketch, and create with powerful tools in real-time collaboration
- **Team Collaboration**: Work together with your team in real-time with live cursors and chat
- **Multiple Tools**: Rectangle, Circle, Line, Ellipse, Triangle, Arrow, Text, Eraser, and Select tools
- **Room-based System**: Create and join rooms for organized collaboration
- **User Authentication**: Secure signup and signin with JWT tokens
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

## 🚀 Live Demo

**Frontend**: [https://exacalidraw-excali-fe.vercel.app](https://exacalidraw-excali-fe.vercel.app)

## 🏗️ Architecture

This is a monorepo built with Turborepo containing:

### Apps
- **`excali-fe`**: Next.js frontend application (deployed on Vercel)
- **`http-backend`**: Express.js REST API server (deployed on Render)
- **`ws-backend`**: WebSocket server for real-time communication (deployed on Render)

### Packages
- **`@repo/ui`**: Shared UI components library
- **`@repo/db`**: Database schema and Prisma client
- **`@repo/common`**: Shared types and utilities
- **`@repo/backend-common`**: Backend utilities and configurations

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js, WebSocket (ws), JWT authentication
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel (Frontend), Render (Backend), Neon (Database)
- **Package Manager**: pnpm
- **Monorepo**: Turborepo

## 📦 Installation

### Prerequisites
- Node.js 18+
- pnpm
- PostgreSQL database (or Neon account)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd draw-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create `.env` files in the following locations:
   
   **Root `.env`:**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/excalidraw"
   JWT_SECRET="your-super-secret-jwt-key"
   ```
   
   **`apps/excali-fe/.env.local`:**
   ```env
   NEXT_PUBLIC_BACKEND_URL="http://localhost:3002"
   NEXT_PUBLIC_WS_URL="ws://localhost:8080"
   ```

4. **Set up the database**
   ```bash
   cd packages/db
   pnpm prisma generate
   pnpm prisma migrate dev
   ```

5. **Start the development servers**
   ```bash
   # Start all services
   pnpm dev
   
   # Or start individual services
   pnpm dev --filter=excali-fe
   pnpm dev --filter=http-backend
   pnpm dev --filter=ws-backend
   ```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set root directory to `apps/excali-fe`
3. Set environment variables:
   - `NEXT_PUBLIC_BACKEND_URL`: Your HTTP backend URL
   - `NEXT_PUBLIC_WS_URL`: Your WebSocket backend URL

### HTTP Backend (Render)
1. Create a new Web Service on Render
2. Set root directory to `apps/http-backend`
3. Build command: `pnpm install --frozen-lockfile && cd packages/db && pnpm prisma generate && cd ../../apps/http-backend && pnpm build`
4. Start command: `cd packages/db && pnpm prisma migrate deploy && cd ../../apps/http-backend && pnpm start`
5. Environment variables:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `JWT_SECRET`: Your JWT secret
   - `FRONTEND_ORIGIN`: Your Vercel app URL

### WebSocket Backend (Render)
1. Create a new Web Service on Render
2. Set root directory to `apps/ws-backend`
3. Build command: `pnpm install --frozen-lockfile && cd packages/db && pnpm prisma generate && cd ../../apps/ws-backend && pnpm build`
4. Start command: `pnpm start`
5. Environment variables:
   - `JWT_SECRET`: Same as HTTP backend
   - `PORT`: 8080

### Database (Neon)
1. Create a new Neon project
2. Copy the connection string
3. Run migrations: `pnpm prisma migrate deploy`

## 🎨 Available Tools

- **Rectangle**: Draw rectangles and squares
- **Circle**: Draw circles and ellipses
- **Line**: Draw straight lines
- **Ellipse**: Draw ellipses
- **Triangle**: Draw triangles
- **Arrow**: Draw arrows
- **Text**: Add text annotations
- **Eraser**: Delete shapes
- **Select**: Move shapes around

## 🔧 Development

### Project Structure
```
draw-app/
├── apps/
│   ├── excali-fe/          # Next.js frontend
│   ├── http-backend/       # Express.js API
│   └── ws-backend/         # WebSocket server
├── packages/
│   ├── ui/                 # Shared UI components
│   ├── db/                 # Database schema
│   ├── common/             # Shared types
│   └── backend-common/     # Backend utilities
└── package.json
```

### Available Scripts
```bash
# Development
pnpm dev                    # Start all services
pnpm dev --filter=excali-fe # Start only frontend
pnpm dev --filter=http-backend # Start only HTTP backend
pnpm dev --filter=ws-backend   # Start only WebSocket backend

# Build
pnpm build                  # Build all packages
pnpm build --filter=excali-fe # Build only frontend

# Database
pnpm prisma generate        # Generate Prisma client
pnpm prisma migrate dev     # Run migrations
pnpm prisma studio          # Open Prisma Studio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Jimil Digaswala** - Built for creators everywhere.

---

⭐ Star this repository if you found it helpful!
