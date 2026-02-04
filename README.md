# FairAI System - Driver Assignment Platform

A comprehensive full-stack system for fair driver assignment using AI/ML, featuring real-time tracking, health monitoring, and advanced forecasting.

## 🚀 Features

- **Fair Assignment Algorithm**: PuLP optimization for equitable package distribution
- **Shadow AI Comparison**: XGBoost baseline vs fair algorithm
- **30-Day LSTM Forecast**: Predictive earnings forecasting
- **Health Guardian**: Random Forest health risk prediction
- **Route Swap Marketplace**: Driver-to-driver route exchanges
- **Insurance Bonus System**: Z-score based performance rewards
- **Real-time Updates**: WebSocket for live tracking
- **PWA Support**: Offline-capable mobile experience
- **SHAP Explainability**: Transparent AI decision-making

## 📁 Project Structure

```
fairai-system/
├── apps/           # Frontend applications (Next.js)
├── services/       # Backend services (FastAPI)
├── ml/            # Machine learning models
├── packages/      # Shared packages
├── docs/          # Documentation
└── infrastructure/ # Docker, K8s, Terraform
```

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- PWA Support

### Backend
- FastAPI (Python)
- PostgreSQL
- Redis
- WebSocket

### ML/AI
- XGBoost
- LSTM (Keras)
- Random Forest (scikit-learn)
- SHAP
- PuLP

## 🏃 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 14+
- Redis 6+

### Installation

```bash
# Clone the repository
git clone https://github.com/Praveen000-hub/Exodus.git
cd fairai-system

# Install dependencies
make setup

# Start services
make dev
```

### Manual Setup

```bash
# Install frontend dependencies
cd apps/driver-web && npm install
cd ../admin-web && npm install

# Install backend dependencies
cd ../../services/backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start services
# Terminal 1: Backend
cd services/backend
uvicorn app.main:app --reload

# Terminal 2: Driver App
cd apps/driver-web
npm run dev

# Terminal 3: Admin Dashboard
cd apps/admin-web
npm run dev
```

## 🐳 Docker Setup

```bash
docker-compose up -d
```

## 📚 Documentation

- [Architecture](docs/architecture.md)
- [API Reference](docs/api-reference.md)
- [Deployment Guide](docs/deployment.md)
- [17 Technical Pipelines](docs/pipelines/)
- [7 Innovations](docs/innovations.md)

## 🧪 Testing

```bash
# Backend tests
cd services/backend
pytest

# Frontend tests
cd apps/driver-web
npm test
```

## 📦 Deployment

```bash
# Staging
make deploy-staging

# Production
make deploy-production
```

## 🤝 Contributing

See [Team Guide](docs/team-guide.md) for contribution guidelines.

## 📄 License

See [LICENSE](LICENSE) file.

## 👥 Team

Built with ❤️ by the FairAI Team
