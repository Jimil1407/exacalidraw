# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/http-backend/package.json ./apps/http-backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/http-backend/ ./apps/http-backend/
COPY packages/ ./packages/

# Build the application
WORKDIR /app/apps/http-backend
RUN pnpm build

# Production stage
FROM node:18-alpine AS production

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files and install only production dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/http-backend/package.json ./apps/http-backend/

RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=base /app/apps/http-backend/dist ./apps/http-backend/dist
COPY --from=base /app/packages/db/generated ./packages/db/generated

# Set working directory to the app
WORKDIR /app/apps/http-backend

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["pnpm", "run", "dev"]
