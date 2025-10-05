# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build production version
RUN npm run build

# Expose port 5173 (external port)
EXPOSE 5173

# Set environment to production
ENV NODE_ENV=production

# Start preview server on port 4173 (internal) mapped to 5173 (external)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
