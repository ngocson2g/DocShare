FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and lockfile
COPY package.json package-lock.json* ./

# Install dependencies for production
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Expose port (default from config/index.js is 3000)
EXPOSE 3000

# Start application
CMD ["npm", "start"]
