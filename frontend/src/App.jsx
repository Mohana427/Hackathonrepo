import { NavLink, Route, Routes } from 'react-router-dom';
import AssetList from './features/assets/AssetList';
import AssetForm from './features/assets/AssetForm';
import AssetDetail from './features/assets/AssetDetail';
import Dashboard from './features/dashboard/Dashboard';

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>AssetFlow</h2>
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/assets">Asset Directory</NavLink>
          <NavLink to="/assets/new">Register Asset</NavLink>
        </nav>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assets" element={<AssetList />} />
          <Route path="/assets/new" element={<AssetForm />} />
          <Route path="/assets/:id" element={<AssetDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
