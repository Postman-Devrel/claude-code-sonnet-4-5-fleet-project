import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Trucks from './pages/Trucks';
import TruckDetails from './pages/TruckDetails';
import Deliveries from './pages/Deliveries';
import DeliveryDetails from './pages/DeliveryDetails';
import Analytics from './pages/Analytics';
import Organizations from './pages/Organizations';
import OrganizationDetails from './pages/OrganizationDetails';
import Drivers from './pages/Drivers';
import DriverDetails from './pages/DriverDetails';
import Locations from './pages/Locations';
import LocationDetails from './pages/LocationDetails';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="trucks" element={<Trucks />} />
            <Route path="trucks/:id" element={<TruckDetails />} />
            <Route path="deliveries" element={<Deliveries />} />
            <Route path="deliveries/:id" element={<DeliveryDetails />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="drivers/:id" element={<DriverDetails />} />
            <Route path="locations" element={<Locations />} />
            <Route path="locations/:id" element={<LocationDetails />} />
            <Route path="organizations" element={<Organizations />} />
            <Route path="organizations/:id" element={<OrganizationDetails />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
