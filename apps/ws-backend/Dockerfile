# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/ws-backend/package.json ./apps/ws-backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/ws-backend/ ./apps/ws-backend/
COPY packages/ ./packages/

# Build the application
WORKDIR /app/apps/ws-backend
RUN pnpm build

# Production stage
FROM node:18-alpine AS production

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files and install only production dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/ws-backend/package.json ./apps/ws-backend/

RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=base /app/apps/ws-backend/dist ./apps/ws-backend/dist
COPY --from=base /app/packages/db/generated ./packages/db/generated

# Set working directory to the app
WORKDIR /app/apps/ws-backend

# Expose port
EXPOSE 8080

# Start the application
CMD ["pnpm", "run", "dev"]
