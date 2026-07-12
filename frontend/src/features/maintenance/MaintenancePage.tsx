import React, { useState, useEffect } from 'react';
import type { MaintenanceRequest } from '../../shared/types';
import { 
  createMaintenanceRequest, fetchMaintenanceHistory, 
  approveMaintenance, rejectMaintenance, assignTechnician, resolveMaintenance 
} from '../../shared/api';
import { useAuth } from '../../shared/AuthContext';
import { Button } from '../../shared/Button';
import { Skeleton } from '../../shared/Skeleton';
import { toast } from 'sonner';

export const MaintenancePage: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || '';
  const [assetId, setAssetId] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const loadHistory = async (id: number) => {
    setLoading(true);
    try {
      const data = await fetchMaintenanceHistory(id);
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assetId) loadHistory(parseInt(assetId));
  }, [assetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMaintenanceRequest({
        asset_id: parseInt(assetId),
        issue_description: description,
        priority
      });
      await loadHistory(parseInt(assetId));
      setDescription('');
      setPriority('medium');
      toast.success('Maintenance request submitted');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'approve' | 'reject' | 'assign' | 'resolve', id: number) => {
    try {
      if (action === 'approve') await approveMaintenance(id);
      if (action === 'reject') await rejectMaintenance(id);
      if (action === 'assign') {
        const tech = prompt("Enter technician name:");
        if (tech) await assignTechnician(id, tech);
      }
      if (action === 'resolve') await resolveMaintenance(id);
      
      await loadHistry(parseInt(assetId));
      toast.success(`Request ${action}ed successfully`);
    } catch (err: any) {
      toast.error(`Error during ${action}: ` + (err.response?.data?.detail || err.message));
    }
  };

  if (isInitializing) {
    return (
      <div className="p-6 max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3 space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="bg-slate-900/50 p-6 rounded-3xl space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        <div className="lg:w-2/3 space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="bg-slate-900/50 p-6 rounded-3xl space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">
      {/* Raise Request Form */}
      <div className="lg:w-1/3 bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-slate-800 h-fit">
        <h2 className="text-2xl font-black text-white mb-6 tracking-tight">Raise Maintenance Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 ml-1">Asset ID</label>
            <input 
              type="number" required 
              value={assetId} onChange={e => setAssetId(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-white p-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 ml-1">Issue Description</label>
            <textarea 
              required rows={3}
              value={description} onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-white p-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 ml-1">Priority</label>
            <select 
              value={priority} onChange={e => setPriority(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-white p-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <Button 
            type="submit" disabled={loading || !assetId}
            variant="primary"
            className="w-full py-3"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </form>
      </div>
 
      {/* Status Board */}
      <div className="lg:w-2/3 bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-slate-800 min-h-[500px]">
        <h2 className="text-2xl font-black text-white mb-6 tracking-tight">Maintenance History</h2>
        {!assetId ? (
          <p className="text-slate-500 italic text-center py-12">Enter Asset ID to view history.</p>
        ) : loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <p className="text-slate-500 italic text-center py-12">No maintenance records found.</p>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <div key={req.id} className="bg-slate-800/40 border border-slate-700 rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-4 transition-colors hover:bg-slate-800/60">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white">REQ #{req.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                      req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      req.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                      req.status === 'rejected' ? 'bg-slate-700 text-slate-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 border rounded-full font-bold uppercase tracking-tighter ${
                      req.priority === 'high' ? 'border-red-500 text-red-500' : 'border-slate-700 text-slate-500'
                    }`}>
                      {req.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mt-2">{req.issue_description}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Raised: {new Date(req.created_at).toLocaleDateString()}
                    {req.technician_name && ` | Tech: ${req.technician_name}`}
                  </p>
                </div>
 
                {role === 'Asset Manager' && (
                  <div className="flex md:flex-col gap-2 justify-start md:justify-center">
                      {req.status === 'pending' && (
                        <>
                          <Button onClick={() => handleAction('approve', req.id)} variant="primary" className="text-xs px-3 py-1">Approve</Button>
                          <Button onClick={() => handleAction('reject', req.id)} variant="secondary" className="text-xs px-3 py-1">Reject</Button>
                        </>
                      )}
                      {req.status === 'approved' && (
                        <Button onClick={() => handleAction('assign', req.id)} variant="primary" className="text-xs px-3 py-1">Assign Tech</Button>
                      )}
                      {(req.status === 'technician_assigned' || req.status === 'in_progress') && (
                        <Button onClick={() => handleAction('resolve', req.id)} variant="primary" className="text-xs px-3 py-1">Mark Resolved</Button>
                      )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
