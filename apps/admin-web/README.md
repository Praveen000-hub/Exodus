# FaIr_AI Admin Dashboard

Admin dashboard for the **FaIr_AI** (Fair Assignment with Insurance and Reassignment AI) delivery driver management system.

## 🚀 Features

- **Real-time Monitoring**: Live driver tracking with WebSocket updates
- **AI-Powered Assignments**: View and generate optimized route assignments
- **Health Interventions**: Monitor driver health and trigger interventions
- **Route Swaps**: Marketplace for voluntary route exchanges
- **Analytics Dashboard**: Comprehensive system metrics and trends
- **Driver Management**: Full CRUD operations for driver data
- **Responsive Design**: Mobile-first UI with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (auth)
- **API Client**: Axios with interceptors
- **Charts**: Recharts
- **Real-time**: WebSocket
- **Deployment**: Vercel

## 🔧 Installation

1. **Navigate to the project directory**:
   ```bash
   cd apps/admin-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   
   The `.env.local` file is already configured with default values:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Prerequisites

Make sure the backend API is running on `http://localhost:8000` before starting the frontend.

## 🎯 Usage

### Default Login Credentials

Use these credentials to log in (configured in your backend):
- **Email**: admin@fair-ai.com
- **Password**: admin123

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_ENVIRONMENT=development
```

## Project Structure

```
admin-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # Shared UI components
│   │   ├── charts/           # Chart components
│   │   ├── tables/           # Table components
│   │   └── features/         # Feature-specific components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities and API clients
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
└── package.json
```

## Features Documentation

### Dashboard Pages

1. **Overview** (`/overview`)
   - System health metrics
   - Active drivers count
   - Today's assignment summary
   - Recent interventions and swaps

2. **Drivers** (`/drivers`)
   - Driver list with filters
   - Individual driver profiles
   - Performance history

3. **Assignments** (`/assignments`)
   - Assignment generation history
   - Fairness metrics
   - Shadow AI comparisons

4. **Analytics** (`/analytics`)
   - System-wide analytics
   - Charts and trends
   - Forecast accuracy

5. **Interventions** (`/interventions`)
   - Health intervention log
   - Risk assessment history

6. **Swaps** (`/swaps`)
   - Swap proposal history
   - Acceptance rates
   - Marketplace activity

7. **Monitoring** (`/monitoring`)
   - Real-time GPS tracking
   - Live system events
   - WebSocket connection status

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Deployment

This app is designed to be deployed on Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## API Integration

The admin dashboard integrates with the FaIr_AI backend API:

- **Authentication**: JWT-based authentication
- **REST API**: All CRUD operations
- **WebSocket**: Real-time updates for monitoring

See `/services/backend` for API documentation.

## License

Proprietary - FaIr_AI System
