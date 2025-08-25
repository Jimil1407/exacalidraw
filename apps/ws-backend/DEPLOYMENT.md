# WebSocket Backend Deployment Guide

## Deploy to Render

### Prerequisites
1. HTTP backend already deployed and working
2. Same JWT_SECRET as HTTP backend
3. Neon database connection (shared with HTTP backend)

### Steps

1. **Create a new Web Service on Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the service**
   - **Name**: `excalidraw-ws` (or any name you prefer)
   - **Root Directory**: `apps/ws-backend`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install --frozen-lockfile && cd packages/db && pnpm prisma generate && cd ../../apps/ws-backend && pnpm build`
   - **Start Command**: `cd apps/ws-backend && pnpm start`
   - **Instance Type**: Paid (recommended) - Free tier has memory limitations

3. **Set Environment Variables**
   - `NODE_ENV`: `production`
   - `PORT`: `8080` (Render will override this)
   - `JWT_SECRET`: Same secret as HTTP backend

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your service
   - The service URL will be something like: `https://excalidraw-ws.onrender.com`

### Important Notes
- **WebSocket Support**: Render supports WebSockets automatically
- **HTTP Health Check**: Service includes HTTP endpoints for health checks
- **URL Format**: Use `wss://` instead of `ws://` for production
- **JWT_SECRET**: Must be identical to HTTP backend
- **Database**: Uses the same Neon database as HTTP backend

### Testing
After deployment, test the service:
1. **Health Check**: `GET https://excalidraw-ws.onrender.com/health`
2. **WebSocket**: Convert to WebSocket URL: `wss://excalidraw-ws.onrender.com`
3. Test WebSocket connection with a valid JWT token

### Update Frontend
Once deployed, update your frontend config:
```typescript
// apps/excali-fe/app/config.ts
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://excalidraw-ws.onrender.com";
```

### Troubleshooting
- **Memory Issues**: If you get "Out of memory" errors, upgrade to a paid plan
- **Wrong Start Command**: Ensure start command is `cd apps/ws-backend && pnpm start`, not `pnpm run dev`
- **Port Detection**: Service should respond to health checks at `/health`
- Check the logs in Render dashboard if deployment fails
- Ensure JWT_SECRET matches HTTP backend
- Verify WebSocket connection in browser console
- Make sure the service URL uses `wss://` protocol

### Next Steps
After successful deployment, update the frontend configuration and test the full application.
