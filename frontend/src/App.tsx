import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './shared/AuthContext';
import { EnterpriseBackground } from './shared/EnterpriseBackground';
import { LoginPage } from './features/auth/LoginPage';
import LandingPage from './features/landing/LandingPage';
import { Dashboard } from './features/dashboard/Dashboard';
import { AssetList } from './features/assets/AssetList';
import { AssetForm } from './features/assets/AssetForm';
import { AssetDetail } from './features/assets/AssetDetail';
import { AllocationPage } from './features/allocation/AllocationPage';
import { TransferRequests } from './features/allocation/TransferRequests';
import { BookingCalendar } from './features/booking/BookingCalendar';
import { MaintenancePage } from './features/maintenance/MaintenancePage';
import { LogOut, LayoutDashboard, Package, ArrowLeftRight, Calendar, Wrench, UserCircle } from 'lucide-react';

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
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      );
    }

  return (
    <EnterpriseBackground>
      <div className="min-h-screen font-sans">
        <nav className="bg-slate-900/80 backdrop-blur-md text-white p-4 sticky top-0 z-50 shadow-xl border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex gap-6 items-center flex-wrap">
            <Link to="/" className="font-black text-2xl mr-6 hover:text-blue-400 transition-colors tracking-tighter">
              Asset<span className="text-blue-500">Flow</span>
            </Link>
            
            <div className="flex gap-1 items-center">
              <NavLink to="/dashboard" icon={<LayoutDashboard size={16}/>} label="Dashboard" />
              <NavLink to="/assets" icon={<Package size={16}/>} label="Assets" />
              <NavLink to="/allocation" icon={<ArrowLeftRight size={16}/>} label="Allocation" />
              <NavLink to="/transfers" icon={<ArrowLeftRight size={16}/>} label="Transfers" />
              <NavLink to="/booking" icon={<Calendar size={16}/>} label="Booking" />
              <NavLink to="/maintenance" icon={<Wrench size={16}/>} label="Maintenance" />
            </div>

            <div className="ml-auto flex items-center gap-4">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-bold text-white leading-none">{user?.name}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">{user?.role}</span>
              </div>
              <Link to="/profile" className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                <UserCircle size={20} />
              </Link>
              <button onClick={logout} className="p-2 rounded-full text-slate-300 hover:text-red-400 hover:bg-slate-800 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </nav>

        <main className="p-4 md:p-8">
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
            <Route path="/profile" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </EnterpriseBackground>
  );
};

const NavLink: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => {
  return (
    <Link 
      to={to} 
      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
    >
      {icon} {label}
    </Link>
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
