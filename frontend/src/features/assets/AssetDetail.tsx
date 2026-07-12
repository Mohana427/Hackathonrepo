import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Asset, Allocation, MaintenanceRequest } from '../../shared/types';
import { fetchAsset, fetchAllocationHistory, fetchMaintenanceHistory } from '../../shared/api';
import { ArrowLeft, ArrowLeftRight, Wrench } from 'lucide-react';
import { Button } from '../../shared/Button';
import { Skeleton } from '../../shared/Skeleton';

export const AssetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadData(parseInt(id));
  }, [id]);

  const loadData = async (assetId: number) => {
    try {
      const [assetData, allocData, maintData] = await Promise.all([
        fetchAsset(assetId),
        fetchAllocationHistory(assetId).catch(() => []),
        fetchMaintenanceHistory(assetId).catch(() => []),
      ]);
      setAsset(assetData);
      setAllocations(allocData);
      setMaintenance(maintData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-64 w-full rounded-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-80 w-full rounded-3xl" />
        <Skeleton className="h-80 w-full rounded-3xl" />
      </div>
    </div>
  );

  if (!asset) return <div className="p-6 text-center text-red-400">Asset not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Button 
        onClick={() => navigate('/assets')} 
        variant="ghost" 
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
      >
        <ArrowLeft size={18} /> Back to Assets
      </Button>

      <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-slate-800">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">{asset.name}</h2>
            <p className="text-slate-400 font-mono text-sm mt-1">{asset.tag}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            asset.status === 'available' ? 'bg-green-500/20 text-green-400' :
            asset.status === 'allocated' ? 'bg-blue-500/20 text-blue-400' :
            asset.status === 'under_maintenance' ? 'bg-orange-500/20 text-orange-400' :
            asset.status === 'reserved' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-slate-700/50 text-slate-300'
          }`}>
            {asset.status.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Category', value: asset.category },
            { label: 'Location', value: asset.location },
            { label: 'Condition', value: asset.condition },
            { label: 'Serial Number', value: asset.serial_number || 'N/A' },
            { label: 'Acquisition Cost', value: asset.acquisition_cost ? `$${asset.acquisition_cost.toLocaleString()}` : 'N/A' },
            { label: 'Bookable', value: asset.is_bookable ? 'Yes' : 'No' },
            { label: 'Created', value: new Date(asset.created_at).toLocaleDateString() },
            { label: 'Last Updated', value: new Date(asset.updated_at).toLocaleDateString() },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">{item.label}</div>
              <div className="font-semibold text-slate-200">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ArrowLeftRight size={20} className="text-blue-400" /> Allocation History
          </h3>
          {allocations.length === 0 ? (
            <p className="text-slate-500 text-sm italic">No allocation history available.</p>
          ) : (
            <div className="space-y-4">
              {allocations.map((alloc) => (
                <div key={alloc.id} className="bg-slate-800/40 border border-slate-700 p-4 rounded-2xl text-sm transition-colors hover:bg-slate-800/60">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200">Employee #{alloc.employee_id || 'N/A'}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                      alloc.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
                    }`}>{alloc.status}</span>
                  </div>
                  <div className="text-slate-500 text-xs mt-2">
                    {new Date(alloc.allocated_date).toLocaleDateString()}
                    {alloc.actual_return_date && ` - ${new Date(alloc.actual_return_date).toLocaleDateString()}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Wrench size={20} className="text-orange-400" /> Maintenance History
          </h3>
          {maintenance.length === 0 ? (
            <p className="text-slate-500 text-sm italic">No maintenance history available.</p>
          ) : (
            <div className="space-y-4">
              {maintenance.map((req) => (
                <div key={req.id} className="bg-slate-800/40 border border-slate-700 p-4 rounded-2xl text-sm transition-colors hover:bg-slate-800/60">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-200">REQ #{req.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                      req.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                      req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>{req.status.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-slate-300 leading-relaxed">{req.issue_description}</div>
                  <div className="text-slate-500 text-xs mt-3 flex justify-between">
                    <span>{new Date(req.created_at).toLocaleDateString()}</span>
                    {req.technician_name && <span className="text-blue-400">Tech: {req.technician_name}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
