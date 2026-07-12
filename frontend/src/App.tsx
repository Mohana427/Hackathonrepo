import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './shared/AuthContext';
import { LoginPage } from './features/auth/LoginPage';
import Dashboard from './features/dashboard/Dashboard.jsx';
import AssetList from './features/assets/AssetList.jsx';
import AssetForm from './features/assets/AssetForm.jsx';
import AssetDetail from './features/assets/AssetDetail.jsx';
import { AllocationPage } from './features/allocation/AllocationPage';
import { TransferRequests } from './features/allocation/TransferRequests';
import { BookingCalendar } from './features/booking/BookingCalendar';
import { MaintenancePage } from './features/maintenance/MaintenancePage';
import { LogOut } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav className="bg-gray-800 text-white p-4">
        <div className="max-w-7xl mx-auto flex gap-4 items-center flex-wrap">
          <Link to="/" className="font-bold text-xl mr-4 hover:text-blue-300">AssetFlow</Link>
          <Link to="/dashboard" className="hover:text-blue-300 text-sm">Dashboard</Link>
          <Link to="/assets" className="hover:text-blue-300 text-sm">Assets</Link>
          <Link to="/allocation" className="hover:text-blue-300 text-sm">Allocation</Link>
          <Link to="/transfers" className="hover:text-blue-300 text-sm">Transfers</Link>
          <Link to="/booking" className="hover:text-blue-300 text-sm">Booking</Link>
          <Link to="/maintenance" className="hover:text-blue-300 text-sm">Maintenance</Link>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-gray-300">
              {user?.name} ({user?.role})
            </span>
            <button onClick={logout} className="hover:text-red-300 flex items-center gap-1 text-sm">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/assets" element={<ProtectedRoute><AssetList /></ProtectedRoute>} />
          <Route path="/assets/new" element={<ProtectedRoute><AssetForm /></ProtectedRoute>} />
          <Route path="/assets/:id" element={<ProtectedRoute><AssetDetail /></ProtectedRoute>} />
          <Route path="/allocation" element={<ProtectedRoute><AllocationPage /></ProtectedRoute>} />
          <Route path="/transfers" element={<ProtectedRoute><TransferRequests /></ProtectedRoute>} />
          <Route path="/booking" element={<ProtectedRoute><BookingCalendar /></ProtectedRoute>} />
          <Route path="/maintenance" element={<ProtectedRoute><MaintenancePage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
