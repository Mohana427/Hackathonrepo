import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './shared/AuthContext';
import { LoginPage } from './features/auth/LoginPage';
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
        <div className="max-w-6xl mx-auto flex gap-6 items-center">
          <span className="font-bold text-xl mr-4">AssetFlow</span>
          <Link to="/allocation" className="hover:text-blue-300">Allocation</Link>
          <Link to="/transfers" className="hover:text-blue-300">Transfers</Link>
          <Link to="/booking" className="hover:text-blue-300">Booking</Link>
          <Link to="/maintenance" className="hover:text-blue-300">Maintenance</Link>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-gray-300">
              {user?.name} ({user?.role})
            </span>
            <button onClick={logout} className="hover:text-red-300 flex items-center gap-1">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="p-4">
        <Routes>
          <Route path="/allocation" element={<ProtectedRoute><AllocationPage /></ProtectedRoute>} />
          <Route path="/transfers" element={<ProtectedRoute><TransferRequests /></ProtectedRoute>} />
          <Route path="/booking" element={<ProtectedRoute><BookingCalendar /></ProtectedRoute>} />
          <Route path="/maintenance" element={<ProtectedRoute><MaintenancePage /></ProtectedRoute>} />
          <Route path="/" element={
            <div className="max-w-xl mx-auto text-center mt-10">
              <h1 className="text-3xl font-bold mb-4">Welcome to AssetFlow</h1>
              <p className="text-gray-600">Select a workflow from the navigation bar.</p>
            </div>
          } />
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
