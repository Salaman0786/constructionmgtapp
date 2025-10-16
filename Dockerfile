# Use Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Expose the Vite dev server port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
