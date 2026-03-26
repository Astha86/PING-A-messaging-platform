# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Run build if typescript
RUN npm run build || true

# Expose port
EXPOSE 3003

# Start the application
CMD ["npm", "start"]
