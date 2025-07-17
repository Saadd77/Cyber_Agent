# AI Cyber-Agent Platform

An intelligent cybersecurity assessment platform that combines rule-based and machine learning approaches for automated security testing.

## Features

- **Dual AI Implementation**: Rule-based and ML engines
- **Three Agent Types**: Web Classification, Web Penetration Testing, Network Scanning
- **Real-time Terminal**: Interactive command execution
- **Project Management**: Organize security assessments
- **Comprehensive Reporting**: Detailed findings and recommendations

## Quick Start

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd cyber_agent_project
```

2. Create environment file:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

3. Start all services:
```bash
docker-compose up -d
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Local Development

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

#### Database Setup
```bash
# Install PostgreSQL and create database
createdb cyber_agent
# Tables will be created automatically when the backend starts
```

## API Endpoints

- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/auth/signup` - User registration
- `GET /api/v1/projects` - List projects
- `POST /api/v1/projects` - Create project
- `GET /api/v1/targets/project/{id}` - List targets
- `POST /api/v1/targets` - Create target

## Architecture

```
Frontend (React) ↔ Backend (FastAPI) ↔ Database (PostgreSQL)
                      ↓
               AI Agents (Rule-based + ML)
                      ↓
               Security Tools (Nmap, etc.)
```

## Development Status

✅ Phase 1: Backend Foundation & Database - COMPLETE
🔄 Phase 2: AI Agents Implementation - IN PROGRESS
📋 Phase 3: Real-time Features & Integration - PLANNED
📋 Phase 4: Advanced Features - PLANNED
📋 Phase 5: Docker & Deployment - PLANNED

## Contributing

1. Follow the development phases outlined in the project plan
2. Ensure all tests pass before submitting changes
3. Update documentation for new features

## License

This project is for educational purposes as part of the Advanced Smart AI Agent course.

## Setup Instructions Summary

### 1. Create Project Structure
```bash
mkdir cyber_agent_project
cd cyber_agent_project
mkdir frontend backend database
```

### 2. Move Frontend Files
Move your existing React files to the `frontend/` directory.

### 3. Create Backend Files
Create all the backend files as shown in this document in the `backend/` directory.

### 4. Update Frontend Dependencies
In your `frontend/package.json`, add:
```json
{
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 5. Environment Configuration
```bash
cp backend/.env.example backend/.env
# Edit the .env file with your settings
```

### 6. Start Development
```bash
# Option 1: Docker (recommended)
docker-compose up -d

# Option 2: Local development
# Terminal 1 (Backend)
cd backend && uvicorn app.main:app --reload

# Terminal 2 (Frontend)  
cd frontend && npm start

# Terminal 3 (Database)
# Make sure PostgreSQL is running
```

## Ready for Phase 2? 🚀

Phase 1 is now complete with:
- ✅ Complete project structure with frontend/backend separation
- ✅ Updated requirements with latest versions
- ✅ Full database schema with relationships
- ✅ Authentication system with JWT
- ✅ Project and target management APIs
- ✅ Frontend integration ready
- ✅ Docker configuration for easy deployment
- ✅ Comprehensive documentation

**Next Step**: Phase 2 - AI Agents Implementation (Rule-based + ML engines)