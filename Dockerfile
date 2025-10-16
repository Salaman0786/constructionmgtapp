# Node version
FROM node:20-alpine AS builder

# Make work directory
WORKDIR /usr/src/app

# Copy files
COPY package*.json ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY . ./

# Install packages 
RUN npm install

# Build application
RUN npm run build

# Install global serve
RUN npm install -g serve

# PORT defined
EXPOSE 3000

# Execute command

CMD ["serve", "-s", "dist", "-p", "3000"]
