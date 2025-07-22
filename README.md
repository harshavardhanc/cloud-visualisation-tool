# CloudViz - Multi-Cloud Infrastructure Visualization Tool

A modern web application for visualizing and managing cloud infrastructure across AWS, Azure, and GCP.

## 🚀 Running with Docker

### Prerequisites

- Docker installed on your machine
- Docker Compose (included with Docker Desktop)

### Quick Start

1. **Clone and navigate to the project directory**
2. **Build and run with Docker Compose:**

```bash
# Production build
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

3. **Access the application:**
   - Open your browser and go to `http://localhost:8080`

### 🔧 Troubleshooting Docker Build Issues

If you encounter dependency resolution errors, try one of these solutions:

#### Solution 1: Use Legacy Peer Deps (Recommended)
The main Dockerfile has been updated to use `--legacy-peer-deps` to resolve conflicts:

```bash
# This should work out of the box
docker-compose up --build
```

#### Solution 2: Use Clean Dependencies Build
If you still have issues, use the clean Dockerfile without unused 3D libraries:

```bash
# Build with clean dependencies
docker build -f Dockerfile.clean -t cloudviz .
docker run -p 8080:8080 cloudviz
```

#### Solution 3: Manual Build with Force
If the above doesn't work, try:

```bash
# Build with --force flag
docker build --build-arg INSTALL_CMD="npm install --force" -t cloudviz .
docker run -p 8080:8080 cloudviz
```

### Development Mode with Hot Reload

For development with file watching and hot reload:

```bash
# Create a development docker-compose override
cat > docker-compose.override.yml << EOF
version: '3.8'
services:
  cloudviz:
    build:
      dockerfile: Dockerfile.dev
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
EOF

# Run development version
docker-compose up --build
```

### Manual Docker Commands

If you prefer running Docker commands manually:

```bash
# Build the image
docker build -t cloudviz .

# Run the container
docker run -p 8080:8080 cloudviz

# For development with volume mounting
docker build -f Dockerfile.dev -t cloudviz-dev .
docker run -p 8080:8080 -v $(pwd):/app -v /app/node_modules cloudviz-dev
```

## 🛠 Local Development (without Docker)

If you prefer to run locally without Docker:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📦 Project Structure

```
cloudviz/
├── client/              # React frontend
│   ├── pages/          # Route components
│   ├── components/ui/  # UI component library
│   └── global.css      # Styling
├── server/             # Express backend
│   ├── routes/         # API endpoints
│   └── index.ts        # Server setup
├── shared/             # Shared types
└── Docker files        # Container configuration
```

## 🌟 Features

- **Multi-cloud support**: AWS, Azure, GCP visualization
- **Account management**: Connect and manage multiple cloud accounts
- **Resource monitoring**: Real-time metrics and cost tracking
- **Responsive design**: Works on desktop and mobile
- **Modern UI**: Built with Radix UI and Tailwind CSS

## 🔧 Configuration

### Environment Variables

Create a `.env` file for custom configuration:

```env
NODE_ENV=production
PORT=8080
# Add your cloud provider API keys here
# AWS_ACCESS_KEY_ID=your_key
# AZURE_SUBSCRIPTION_ID=your_id
# GCP_PROJECT_ID=your_project
```

### Docker Environment

Environment variables can be set in `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - PORT=8080
  - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
```

## 🚢 Deployment

### Production Deployment

The application is production-ready and can be deployed to:

- **VM/VPS**: Use the Docker setup
- **Cloud platforms**: Deploy the container to AWS ECS, Azure Container Instances, or GCP Cloud Run
- **Kubernetes**: Use the Docker image with your K8s manifests

### Building for Production

```bash
# Build optimized production image
docker build -t cloudviz:latest .

# Test production build locally
docker run -p 8080:8080 cloudviz:latest
```

## 📝 API Endpoints

- `GET /api/ping` - Health check
- `GET /api/demo` - Demo endpoint
- Additional endpoints can be added in `server/routes/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker: `docker-compose up --build`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
