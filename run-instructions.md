# How to Run the AI Cyber-Agent Platform

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher)
- **Python** (v3.11 or higher)
- **PostgreSQL** (v13 or higher)
- **Redis** (optional, for production)
- **Git**

## Option 1: Using Docker (Recommended)

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd cyber_agent_project
```

### 2. Set Up Environment Variables
```bash
# Copy the example environment file
cp backend/.env.example backend/.env

# Edit the .env file with your settings (optional for Docker)
# The default settings should work for Docker setup
```

### 3. Start All Services with Docker
```bash
# Build and start all services (frontend, backend, database, redis)
docker-compose up -d

# View logs (optional)
docker-compose logs -f
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### 5. Stop the Services
```bash
docker-compose down
```

---

## Option 2: Local Development Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd cyber_agent_project
```

### 2. Set Up PostgreSQL Database
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Or on macOS with Homebrew
brew install postgresql
brew services start postgresql

# Create database
sudo -u postgres createdb cyber_agent

# Create user (optional)
sudo -u postgres createuser --interactive
```

### 3. Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env

# Edit .env file with your database settings
# Example:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/cyber_agent
# SECRET_KEY=your-very-long-secret-key-here
```

### 4. Start Backend Server
```bash
# Make sure you're in the backend directory with venv activated
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Start the FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: http://localhost:8000

### 5. Set Up Frontend

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at: http://localhost:5173

---

## Option 3: Quick Test Run

If you just want to test the agents without the full UI:

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Run the agent test script
python test_agents.py
```

---

## Troubleshooting

### Common Issues:

1. **Port Already in Use**
   ```bash
   # Kill processes on specific ports
   # On Windows:
   netstat -ano | findstr :8000
   taskkill /PID <PID> /F
   
   # On macOS/Linux:
   lsof -ti:8000 | xargs kill -9
   ```

2. **Database Connection Error**
   ```bash
   # Check if PostgreSQL is running
   sudo systemctl status postgresql  # Linux
   brew services list | grep postgresql  # macOS
   
   # Restart PostgreSQL
   sudo systemctl restart postgresql  # Linux
   brew services restart postgresql  # macOS
   ```

3. **Python Dependencies Issues**
   ```bash
   # Upgrade pip
   pip install --upgrade pip
   
   # Install dependencies again
   pip install -r requirements.txt --force-reinstall
   ```

4. **Node.js Issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Environment Variables

Make sure your `backend/.env` file contains:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/cyber_agent
SECRET_KEY=your-secret-key-change-this-in-production-must-be-very-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=development
DEBUG=true
API_V1_STR=/api/v1
PROJECT_NAME=AI Cyber-Agent Platform
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## Testing the Application

### 1. Test Backend API
Visit: http://localhost:8000/docs

### 2. Test Frontend
Visit: http://localhost:3000 or http://localhost:5173

### 3. Test Agent Functionality
```bash
cd backend
python test_agents.py
```

### 4. Create Test User
1. Go to the signup page
2. Create a new account
3. Login and create a project
4. Add targets and run scans

---

## Development Workflow

### Backend Development
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Database Migrations (if needed)
```bash
cd backend
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

---

## Production Deployment

For production deployment, use Docker:

```bash
# Build for production
docker-compose -f docker-compose.prod.yml up -d

# Or use the regular docker-compose with production environment variables
```

Make sure to:
1. Set strong SECRET_KEY
2. Use production database
3. Set ENVIRONMENT=production
4. Configure proper CORS origins
5. Use HTTPS in production