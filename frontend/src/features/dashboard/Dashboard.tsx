import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DashboardStats } from '../../shared/types';
import { fetchDashboardStats } from '../../shared/api';
import { Package, CheckCircle, Wrench, Calendar, ArrowLeftRight, Clock, AlertTriangle, TrendingUp, LayoutGrid, Activity, User, Mail, ShieldCheck, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../shared/Button';
import { Skeleton } from '../../shared/Skeleton';
import { useAuth } from '../../shared/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  if (loading) return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="lg:col-span-2 h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    </div>
  );
  
  if (!stats) return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 text-center">
        <AlertTriangle className="mx-auto text-red-500 mb-3" size={48} />
        <h3 className="text-red-400 font-bold text-lg">System Synchronization Error</h3>
        <p className="text-red-500/70 text-sm">Unable to fetch dashboard metrics. Please contact your administrator.</p>
      </div>
    </div>
  );

  const kpis = [
    { label: 'Total Assets', value: stats.total_assets, icon: Package, color: 'text-blue-400', bg: 'bg-blue-400/10', chartColor: '#3b82f6' },
    { label: 'Available', value: stats.available, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10', chartColor: '#22c55e' },
    { label: 'Allocated', value: stats.allocated, icon: ArrowLeftRight, color: 'text-indigo-400', bg: 'bg-indigo-400/10', chartColor: '#6366f1' },
    { label: 'Under Maintenance', value: stats.under_maintenance, icon: Wrench, color: 'text-orange-400', bg: 'bg-orange-400/10', chartColor: '#f97316' },
    { label: 'Pending Bookings', value: stats.pending_bookings, icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-400/10', chartColor: '#a855f7' },
    { label: 'Pending Transfers', value: stats.pending_transfers, icon: ArrowLeftRight, color: 'text-cyan-400', bg: 'bg-cyan-400/10', chartColor: '#06b6d4' },
    { label: 'Pending Maintenance', value: stats.pending_maintenance, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10', chartColor: '#eab308' },
    { label: 'Overdue Allocations', value: stats.overdue_allocations, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10', chartColor: '#ef4444' },
  ];

  const chartData = [
    { name: 'Available', value: stats.available, color: '#22c55e' },
    { name: 'Allocated', value: stats.allocated, color: '#6366f1' },
    { name: 'Maintenance', value: stats.under_maintenance, color: '#f97316' },
    { name: 'Other', value: stats.total_assets - (stats.available + stats.allocated + stats.under_maintenance), color: '#64748b' },
  ].filter(item => item.value > 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-widest mb-2">
            <Activity size={16} />
            <span>Real-time Analytics</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">Executive Overview</h2>
          <p className="text-slate-400 mt-1">Comprehensive status of organization-wide asset distribution.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-700 shadow-sm flex items-center gap-2 text-sm font-medium text-slate-300">
            <TrendingUp size={16} className="text-green-400" />
            <span>System Healthy</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={kpi.label} 
            className="bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 shadow-2xl hover:shadow-blue-500/20 hover:border-white/20 transition-all group cursor-default ring-1 ring-white/5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${kpi.bg} ${kpi.color} p-3 rounded-xl transition-transform group-hover:scale-110`}>
                <kpi.icon size={24} />
              </div>
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Live Data</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-400 mb-1">{kpi.label}</div>
              <div className="text-3xl font-black text-white">{kpi.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-2xl ring-1 ring-white/5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                <LayoutGrid size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Asset Distribution Analysis</h3>
            </div>
            <button className="text-sm text-blue-400 font-semibold hover:underline">View Detailed Report</button>
          </div>
          <div className="h-64 bg-slate-800/30 rounded-2xl border border-slate-700 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden border border-white/10 ring-1 ring-white/5">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
           <div className="relative z-10 h-full flex flex-col">
             <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
             <div className="space-y-3">
               <Button 
                 variant="secondary" 
                 className="w-full justify-start py-4 px-4 text-base" 
                 onClick={() => navigate('/assets/new')}
               >
                 <Package size={18} className="text-blue-400 mr-2" /> Register New Asset
               </Button>
               <Button 
                 variant="secondary" 
                 className="w-full justify-start py-4 px-4 text-base" 
                 onClick={() => navigate('/allocation')}
               >
                 <ArrowLeftRight size={18} className="text-purple-400 mr-2" /> Initiate Transfer
               </Button>
               <Button 
                 variant="secondary" 
                 className="w-full justify-start py-4 px-4 text-base" 
                 onClick={() => navigate('/maintenance')}
               >
                 <Wrench size={18} className="text-orange-400 mr-2" /> Schedule Maintenance
               </Button>
               <Button 
                 variant="secondary" 
                 className="w-full justify-start py-4 px-4 text-base" 
                 onClick={() => navigate('/booking')}
               >
                 <Calendar size={18} className="text-green-400 mr-2" /> Manage Bookings
               </Button>
             </div>
             <div className="mt-auto pt-8">
               <div className="p-4 bg-blue-600/20 border border-blue-500/30 rounded-2xl text-xs text-blue-200 leading-relaxed">
                 <span className="font-bold block mb-1">System Tip:</span>
                 Check "Overdue Allocations" regularly to maintain asset availability.
               </div>
             </div>
           </div>
        </div>
      </div>


      {/* User & Account Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-slate-900 rounded-full"></div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-black text-white">{user?.name}</h3>
              <p className="text-slate-400">{user?.role} • AssetFlow Enterprise</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                  <Mail size={14} /> {user?.email || 'user@assetflow.dev'}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                  <ShieldCheck size={14} /> Verified Account
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800 p-8 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Settings size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">Account Management</h3>
          </div>
          <div className="flex flex-col gap-3">
            <Button 
              variant="secondary" 
              className="w-full py-3 text-sm" 
              onClick={() => navigate('/settings')}
            >
              <Settings size={16} className="mr-2" /> Account Settings
            </Button>
            <Button variant="primary" className="w-full py-3 text-sm">
              <User size={16} className="mr-2" /> Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
