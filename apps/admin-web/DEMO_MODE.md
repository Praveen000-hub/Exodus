# 🎭 Demo Mode Documentation

## Overview

The admin dashboard is currently running in **DEMO MODE** with hardcoded authentication and mock data. This allows you to develop and test the frontend without requiring a backend server or database.

## Demo Credentials

Use these credentials to log in:

- **Username:** `admin`
- **Password:** `admin123`

These credentials are displayed on the login page for easy reference.

## What's Mocked

All API calls are intercepted and return mock data instead of making real HTTP requests:

### ✅ Authentication
- Login with hardcoded credentials
- JWT token simulation
- User session management

### ✅ Analytics
- Dashboard overview stats
- System metrics (30 days)
- Driver-specific analytics

### ✅ Drivers
- List all drivers (with pagination)
- View individual driver details
- Driver assignments
- Health history

### ✅ Assignments
- List assignments with filters
- View assignment details
- Generate assignments (simulated)
- Check generation status

### ✅ Health & Interventions
- Health events list
- Intervention alerts (risk > 75%)
- Force interventions

### ✅ Route Swaps
- Swap proposals list
- Swap details
- Cancel swaps

### ✅ Insurance Payouts
- Payout list with filters
- Approve/reject payouts
- Z-score based bonuses

### ✅ Monitoring
- Active drivers with GPS locations
- System health status
- Recent events

## Mock Data Details

### Drivers
- **3 drivers** with varying attributes:
  - Active drivers
  - On break drivers
  - Different fitness levels, ages, and preferences

### Dashboard Stats
- Total drivers: 45
- Active drivers: 38
- Packages delivered: 1189/1247 (95.3%)
- System fairness: 94.8%
- Total bonuses: $45,890.50

### System Metrics
- **30 days** of historical data
- Random but realistic values
- Trends and variations

## Switching Between Demo and Production

To toggle demo mode, update the `DEMO_MODE` constant in:

**File:** `src/lib/api/index.ts`
```typescript
// 🎭 DEMO MODE - Use mock data instead of real API
const DEMO_MODE = true; // Change to false for production
```

**File:** `src/lib/api/auth.ts`
```typescript
// 🎭 DEMO MODE - Hardcoded authentication
const DEMO_MODE = true; // Change to false for production
```

## Development Workflow

1. **Frontend Development**: Keep `DEMO_MODE = true`
   - Develop UI components
   - Test user flows
   - Design layouts
   - No backend required

2. **Backend Integration**: Set `DEMO_MODE = false`
   - Connect to real API
   - Test with actual data
   - Verify error handling

## Mock Data Structure

All mock data is centralized in:
```
src/lib/mock-data.ts
```

You can modify this file to:
- Add more sample data
- Adjust statistical values
- Create specific test scenarios
- Simulate edge cases

## Features Working in Demo Mode

✅ **Full UI/UX** - All pages and components render correctly
✅ **Navigation** - All routes and links work
✅ **Forms** - Input validation and submission (simulated)
✅ **Charts** - Data visualization with mock metrics
✅ **Pagination** - Browse through paginated data
✅ **Filters** - Apply filters to lists
✅ **Search** - Search functionality (simulated)
✅ **Real-time Updates** - Simulated network delays

## Limitations in Demo Mode

❌ **No Data Persistence** - Changes are not saved
❌ **No WebSocket** - Real-time updates use mock data
❌ **No File Uploads** - Export features return messages
❌ **No External APIs** - Maps, notifications, etc. are mocked

## Next Steps

When ready to connect to the backend:

1. Set up the backend server (FastAPI)
2. Configure database (PostgreSQL)
3. Update environment variables in `.env.local`
4. Set `DEMO_MODE = false` in API files
5. Test authentication with real endpoints
6. Verify all API integrations

## Tips for Demo Presentations

- Demo credentials are clearly shown on login page
- Data is realistic and representative
- Network delays are simulated for authenticity
- Error handling is demonstrated
- All features are functional

## Support

For questions or issues with demo mode, check:
- `src/lib/mock-data.ts` - Mock data definitions
- `src/lib/api/index.ts` - API mocking logic
- `src/lib/api/auth.ts` - Authentication mocking

---

**Current Status:** 🎭 DEMO MODE ACTIVE

All features are working with mock data. Ready for frontend development and demonstration!
