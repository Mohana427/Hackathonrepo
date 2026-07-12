import React, { useState, useEffect } from 'react';
import type { DashboardStats } from '../../shared/types';
import { fetchDashboardStats } from '../../shared/api';
import { Package, CheckCircle, Wrench, Calendar, ArrowLeftRight, Clock, AlertTriangle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading dashboard...</div>;
  if (!stats) return <div className="p-6 text-center text-red-500">Failed to load dashboard</div>;

  const kpis = [
    { label: 'Total Assets', value: stats.total_assets, icon: Package, color: 'bg-blue-500' },
    { label: 'Available', value: stats.available, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Allocated', value: stats.allocated, icon: ArrowLeftRight, color: 'bg-indigo-500' },
    { label: 'Under Maintenance', value: stats.under_maintenance, icon: Wrench, color: 'bg-orange-500' },
    { label: 'Pending Bookings', value: stats.pending_bookings, icon: Calendar, color: 'bg-purple-500' },
    { label: 'Pending Transfers', value: stats.pending_transfers, icon: ArrowLeftRight, color: 'bg-cyan-500' },
    { label: 'Pending Maintenance', value: stats.pending_maintenance, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Overdue Allocations', value: stats.overdue_allocations, icon: AlertTriangle, color: 'bg-red-500' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <div className={`${kpi.color} text-white p-3 rounded-lg`}>
              <kpi.icon size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-500">{kpi.label}</div>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
