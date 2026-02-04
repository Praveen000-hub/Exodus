# FaIr_AI Driver Web App

A Progressive Web App (PWA) for delivery drivers built with Next.js 16, React 19, and Tailwind CSS 4.1.

## 🚀 Features

### Core Innovations Implemented
1. **Fairness Assignment** - View today's route with equal difficulty distribution
2. **Shadow AI Comparison** - See savings compared to old assignment system
3. **SHAP Explainability** - Understand why you got specific routes
4. **LSTM 30-Day Forecasting** - Plan ahead with AI predictions
5. **Health Guardian** - Real-time health monitoring with risk assessment
6. **Route Swap Marketplace** - Exchange routes with other drivers
7. **Insurance Bonus** - Automatic compensation for unavoidable delays

### Pages Implemented
- **Dashboard** (`/main`) - Three-tab interface (Today/Health/Future)
- **Swap Marketplace** (`/main/swap`) - Route exchange system
- **Live Tracking** (`/main/tracking`) - Real-time delivery progress
- **Summary** (`/main/summary`) - Performance overview
- **History** (`/main/history`) - Past assignments and earnings
- **Calendar** (`/main/calendar`) - 30-day forecast view
- **Profile** (`/main/profile`) - Driver information
- **Settings** (`/main/settings`) - App preferences
- **Login** (`/login`) - Authentication

## 🎨 Design System

### Color Scheme
- **Primary**: Orange (#f97316) for CTAs, highlights, progress bars
- **Background**: Off-white (#F9FAFB, #FDFDFD) only
- **Text**: Black with opacity variations (100%, 80%, 60%)
- **Success/Warning**: Represented using orange intensity + text labels

### Components
- **Cards**: Rounded (rounded-xl), soft shadow, thin orange borders
- **Buttons**: Primary (orange bg, white text), Secondary (orange border, orange text)
- **Gauges**: Orange gradient progress bars with smooth transitions
- **Live Badges**: Orange with animated pulse dot

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **UI**: React 19, TypeScript, Tailwind CSS 4.1
- **Components**: Custom shadcn/ui components with orange theme
- **State**: React Query for server state, Zustand for client state
- **Icons**: Lucide React
- **PWA**: Service Worker, Web App Manifest

### Folder Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main app pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── providers.tsx      # React Query provider
├── components/
│   ├── ui/                # Base UI components
│   ├── features/          # Feature-specific components
│   │   ├── assignment/    # Today's route components
│   │   ├── dashboard/     # Shadow comparison, quick actions
│   │   ├── explainability/ # SHAP explanation
│   │   ├── health/        # Health monitoring
│   │   ├── forecast/      # LSTM predictions
│   │   └── insurance/     # Bonus alerts
│   └── layout/            # Layout components (sidebar, header)
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
├── types/                 # TypeScript type definitions
└── styles/                # Additional styles
```

## 🔧 Development

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation
```bash
cd apps/driver-web
npm install
```

### Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Type Check
```bash
npm run type-check
```

## 📱 PWA Features

### Offline Support
- Service Worker caches critical resources
- Offline data sync when connection restored
- Background sync for GPS and health data

### Installation
- Installable on mobile devices
- App shortcuts for quick access
- Native app-like experience

### Notifications
- Push notifications for health alerts
- Swap requests and assignment updates
- Bonus notifications

## 🎯 Key Components

### Desktop Layout
- **Sidebar Navigation**: Fixed left sidebar with driver info
- **Main Content**: Centered content area (max-width 1200-1320px)
- **Header**: Status indicators, time, notifications

### Dashboard Tabs
1. **Today Tab**: 2-column grid layout
   - Left: TodayRouteCard, ShadowComparisonCard, WhyThisRouteCard
   - Right: HealthGaugeCard, BonusAlertsCard, QuickActionsCard

2. **Health Tab**: Expanded health monitoring
3. **Future Tab**: 30-day forecast calendar

### Real-world Micro-details
- Building properties (lift availability, floors, parking distance)
- Weather conditions with advice
- Route specifics (stops, packages, expected times)
- Health metrics (hours worked, floors climbed, heart rate)

## 🔌 API Integration

### Mock Data
Currently uses mock data for development. Replace with actual API calls:

```typescript
// hooks/useAssignment.ts
const { data: assignment } = useAssignment(driverId);

// hooks/useHealth.ts  
const { data: healthData } = useHealth(driverId);

// hooks/useForecast.ts
const { data: forecast } = useForecast(driverId);
```

### WebSocket Integration
Real-time updates for:
- GPS tracking
- Health monitoring
- Assignment changes
- Swap notifications

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://fairai-backend.up.railway.app/api/v1
NEXT_PUBLIC_WS_URL=wss://fairai-backend.up.railway.app/ws
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-key
```

## 📊 Performance

### Optimization Features
- React 19 compiler optimizations
- Automatic code splitting per route
- Image optimization (AVIF/WebP)
- Package import optimization
- Service Worker caching

### Loading States
- Skeleton loaders for all major cards
- Progressive loading with React Suspense
- Error boundaries with retry functionality

## 🎨 Customization

### Theme Colors
Update `tailwind.config.js` and `globals.css` for color changes:

```css
:root {
  --primary: 24 95% 53%; /* Orange */
  --background: 0 0% 98%; /* Off-white */
}
```

### Component Styling
All components use consistent utility classes:
- `.fairai-card` - Standard card styling
- `.fairai-button-primary` - Primary button
- `.fairai-live-badge` - Live status indicator

## 🔒 Security

- JWT token authentication
- Input validation and sanitization
- HTTPS enforcement
- Content Security Policy headers
- Rate limiting on API calls

## 📈 Analytics

### Metrics Tracked
- Page views and user interactions
- Feature usage (swap proposals, health checks)
- Performance metrics (Core Web Vitals)
- Error tracking and reporting

## 🤝 Contributing

1. Follow the existing folder structure
2. Use TypeScript for all new files
3. Implement proper loading and error states
4. Add proper accessibility attributes
5. Test on mobile devices

## 📄 License

This project is part of the FaIr_AI system for fair delivery driver assignment.