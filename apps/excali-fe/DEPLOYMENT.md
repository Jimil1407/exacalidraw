# Frontend Deployment Guide - Vercel

## Deploy to Vercel

### Prerequisites
1. HTTP backend deployed at: https://exacalidraw-http-backend.onrender.com
2. WebSocket backend deployed at: https://exacalidraw-ws.onrender.com
3. Vercel account (free tier available)

### Steps

1. **Install Vercel CLI** (optional but recommended)
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set the following configuration:
     - **Framework Preset**: Next.js
     - **Root Directory**: `apps/excali-fe`
     - **Build Command**: `cd ../.. && pnpm install --frozen-lockfile && cd apps/excali-fe && pnpm build`
     - **Output Directory**: `apps/excali-fe/.next`
     - **Install Command**: `cd ../.. && pnpm install --frozen-lockfile`

3. **Set Environment Variables**
   - `NEXT_PUBLIC_BACKEND_URL`: `https://exacalidraw-http-backend.onrender.com`
   - `NEXT_PUBLIC_WS_URL`: `wss://exacalidraw-ws.onrender.com`

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a URL like: `https://your-app.vercel.app`

### Alternative: Deploy via CLI

1. **Navigate to the frontend directory**
   ```bash
   cd apps/excali-fe
   ```

2. **Deploy with Vercel CLI**
   ```bash
   vercel
   ```

3. **Follow the prompts**
   - Set root directory: `apps/excali-fe`
   - Set build command: `cd ../.. && pnpm install --frozen-lockfile && cd apps/excali-fe && pnpm build`
   - Set environment variables when prompted

### Environment Variables

Set these in Vercel dashboard (Project Settings → Environment Variables):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://exacalidraw-http-backend.onrender.com` |
| `NEXT_PUBLIC_WS_URL` | `wss://exacalidraw-ws.onrender.com` |

### Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to Project Settings → Domains
   - Add your domain (e.g., `app.yourdomain.com`)

2. **Update CORS** (if needed)
   - Update `FRONTEND_ORIGIN` in your HTTP backend to include your custom domain

### Testing

After deployment, test the full application:

1. **Visit your Vercel URL**
2. **Sign up/Sign in** - should connect to HTTP backend
3. **Create/Join a room** - should work with real-time updates
4. **Test drawing features** - should connect to WebSocket backend
5. **Verify all tools work** - eraser, text, select, etc.

### Troubleshooting

- **Build Failures**: Check that all dependencies are properly installed
- **Environment Variables**: Ensure they're set correctly in Vercel dashboard
- **CORS Issues**: Update `FRONTEND_ORIGIN` in HTTP backend if needed
- **WebSocket Connection**: Check browser console for connection errors

### Next Steps

After successful deployment:
1. Test all features thoroughly
2. Set up custom domain (optional)
3. Configure monitoring and analytics
4. Set up CI/CD for automatic deployments

Your Excalidraw application should now be fully deployed and accessible! 🎉
