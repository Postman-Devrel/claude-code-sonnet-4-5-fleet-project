# Fleet Management Dashboard

A comprehensive fleet management dashboard built with React, TypeScript, and Tailwind CSS for monitoring and managing delivery trucks and operations.

## Features

### Core Functionality
- **Fleet Overview Dashboard**: Real-time monitoring of vehicle status, deliveries, and key metrics
- **Vehicle Management**: Track 50+ vehicles with detailed information, maintenance history, and fuel logs
- **Delivery Tracking**: Monitor 1,000+ deliveries with status filtering, search, and timeline tracking
- **Analytics & Reporting**: Visual insights with charts showing performance trends over 6 months of historical data
- **Responsive Design**: Optimized for desktop and tablet viewing

### Key Capabilities
- Real-time status updates for vehicles and deliveries
- Search and filter functionality across all resources
- Detailed views for individual vehicles and deliveries
- Historical data visualization using Recharts
- Performance metrics and completion rates
- Maintenance and fuel cost tracking

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Data Fetching**: TanStack React Query (React Query)
- **Charts**: Recharts
- **Build Tool**: Vite
- **Date Formatting**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository and navigate to the project directory:
```bash
cd fleet-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Configure the API endpoint:
```bash
cp .env.example .env
```

Edit `.env` and set your Fleet API base URL:
```env
VITE_API_BASE_URL=https://your-api-url.com
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variable in Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add `VITE_API_BASE_URL` with your API URL

### Option 2: Using Vercel Dashboard

1. Push your code to GitHub
2. Import the project in Vercel dashboard
3. Set the environment variable `VITE_API_BASE_URL`
4. Deploy

## Project Structure

```
fleet-dashboard/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Card.tsx
│   │   ├── Layout.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── StatCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── FilterSelect.tsx
│   ├── pages/             # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Deliveries.tsx
│   │   ├── DeliveryDetails.tsx
│   │   ├── Trucks.tsx
│   │   ├── TruckDetails.tsx
│   │   └── Analytics.tsx
│   ├── services/          # API services
│   │   ├── api.ts
│   │   ├── vehicles.ts
│   │   ├── deliveries.ts
│   │   ├── routes.ts
│   │   └── analytics.ts
│   ├── types/            # TypeScript type definitions
│   │   └── api.ts
│   ├── App.tsx           # Main app component with routing
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── .env.example          # Environment variables template
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
└── package.json
```

## API Integration

The dashboard integrates with a Fleet Management API that provides:
- `/vehicles/` - Vehicle data and status
- `/deliveries/` - Delivery tracking and history
- `/routes/` - Route information
- `/maintenance/` - Maintenance records
- `/fuel/` - Fuel logs
- `/gps/` - GPS tracking data

All API calls are made through service modules in `src/services/` and use React Query for caching and state management.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Page**: Create component in `src/pages/` and add route in `App.tsx`
2. **New API Endpoint**: Add service function in appropriate file in `src/services/`
3. **New Component**: Create reusable component in `src/components/`
4. **New Type**: Add TypeScript types in `src/types/api.ts`

## Contributing

When making changes:
1. Follow existing code structure and patterns
2. Use TypeScript for type safety
3. Maintain responsive design principles
4. Add proper error handling and loading states

## License

MIT

## Support

For issues or questions, please check the API documentation in `fleet-api-spec.yaml` or contact the development team.
