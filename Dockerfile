# Use Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (clean, reproducible)
RUN npm ci

# Copy rest of the project files
COPY . .

# Build the project (output goes to /app/dist)
RUN npm run build

# Default command — optional (just to keep container alive or show build result)
CMD ["sh", "-c", "echo 'Build completed. Files are in /app/dist'; ls -la /app/dist"]
