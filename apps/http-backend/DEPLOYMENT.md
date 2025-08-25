# HTTP Backend Deployment Guide

## Deploy to Render

### Prerequisites
1. Create a Neon database and get the connection string
2. Generate a JWT secret (you can use: `openssl rand -base64 32`)

### Steps

1. **Create a new Web Service on Render**
   - Go to [render.com](https://render.com) and create a new account
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the service**
   - **Name**: `excalidraw-api` (or any name you prefer)
   - **Root Directory**: `apps/http-backend`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install --frozen-lockfile && cd packages/db && pnpm prisma generate && cd ../../apps/http-backend && pnpm build`
   - **Start Command**: `sh -c "cd ../../packages/db && pnpm prisma migrate deploy && cd ../../apps/http-backend && pnpm start"`
   - **Instance Type**: Free (or paid if needed)

3. **Set Environment Variables**
   - `NODE_ENV`: `production`
   - `PORT`: `3002` (Render will override this)
   - `DATABASE_URL`: Your Neon connection string
   - `JWT_SECRET`: Your generated JWT secret
   - `FRONTEND_ORIGIN`: Your frontend URL (e.g., `https://your-app.vercel.app`)

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your service
   - The service URL will be something like: `https://excalidraw-api.onrender.com`

### Health Check
The service includes a health check endpoint at `/health` that returns:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Testing
After deployment, test the endpoints:
- Health: `GET https://your-service.onrender.com/health`
- Signup: `POST https://your-service.onrender.com/signup`
- Signin: `POST https://your-service.onrender.com/signin`

### Troubleshooting
- Check the logs in Render dashboard if deployment fails
- Ensure all environment variables are set correctly
- Verify the Neon database connection string is correct
- Make sure the JWT_SECRET is the same across all services

### Next Steps
After successful deployment, note down the service URL for configuring the frontend and WebSocket backend.
