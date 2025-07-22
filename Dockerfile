# Use the official Node.js 18 image as base
FROM node:18-alpine

# Build argument for install command (allows customization)
ARG INSTALL_CMD="npm ci --legacy-peer-deps"

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies using the specified command
RUN ${INSTALL_CMD}

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Verify the build output exists
RUN ls -la dist/
RUN ls -la dist/spa/ || echo "SPA build not found"
RUN ls -la dist/server/ || echo "Server build not found"

# Expose the port the app runs on
EXPOSE 8080

# Define the command to run the application
CMD ["npm", "start"]
