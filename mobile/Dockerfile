FROM node:22

WORKDIR /app

# Install global dependencies
RUN npm install -g @expo/cli

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose ports for Expo
EXPOSE 8081 19000 19001 19002

# Start Expo development server
CMD ["npx", "expo", "start", "--tunnel"]