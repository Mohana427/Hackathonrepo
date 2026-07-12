import React, { useState, useEffect } from 'react';
import type { MaintenanceRequest } from '../../shared/types';
import { 
  createMaintenanceRequest, fetchMaintenanceHistory, 
  approveMaintenance, rejectMaintenance, assignTechnician, resolveMaintenance 
} from '../../shared/api';

import { useAuth } from '../../shared/AuthContext';

export const MaintenancePage: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || '';
  const [assetId, setAssetId] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async (id: number) => {
    try {
      const data = await fetchMaintenanceHistory(id);
      setRequests(data);
    } catch (err) {
      console.error(err);
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
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.detail || err.message));
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
      
      await loadHistory(parseInt(assetId));
    } catch (err: any) {
      alert(`Error during ${action}: ` + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">
      {/* Raise Request Form */}
      <div className="lg:w-1/3 bg-white p-6 rounded shadow h-fit">
        <h2 className="text-xl font-bold mb-4">Raise Maintenance Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Asset ID</label>
            <input 
              type="number" required 
              value={assetId} onChange={e => setAssetId(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Issue Description</label>
            <textarea 
              required rows={3}
              value={description} onChange={e => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select 
              value={priority} onChange={e => setPriority(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button 
            type="submit" disabled={loading || !assetId}
            className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            Submit Request
          </button>
        </form>
      </div>

      {/* Status Board (List View) */}
      <div className="lg:w-2/3 bg-white p-6 rounded shadow min-h-[500px]">
        <h2 className="text-xl font-bold mb-4">Maintenance History</h2>
        {!assetId ? (
          <p className="text-gray-500">Enter Asset ID to view history.</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">No maintenance records found.</p>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <div key={req.id} className="border rounded p-4 flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">REQ #{req.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      req.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      req.status === 'rejected' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {req.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`text-xs px-2 py-0.5 border rounded-full ${
                      req.priority === 'high' ? 'border-red-500 text-red-500' : 'border-gray-300'
                    }`}>
                      {req.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm mt-2">{req.issue_description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Raised: {new Date(req.created_at).toLocaleDateString()}
                    {req.technician_name && ` | Tech: ${req.technician_name}`}
                  </p>
                </div>

                {/* Actions (Role Gated) */}
                {role === 'Asset Manager' && (
                  <div className="flex md:flex-col gap-2 justify-start md:justify-center">
                    {req.status === 'pending' && (
                      <>
                        <button onClick={() => handleAction('approve', req.id)} className="bg-green-600 text-white text-xs px-3 py-1 rounded">Approve</button>
                        <button onClick={() => handleAction('reject', req.id)} className="bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded">Reject</button>
                      </>
                    )}
                    {req.status === 'approved' && (
                      <button onClick={() => handleAction('assign', req.id)} className="bg-blue-600 text-white text-xs px-3 py-1 rounded">Assign Tech</button>
                    )}
                    {(req.status === 'technician_assigned' || req.status === 'in_progress') && (
                      <button onClick={() => handleAction('resolve', req.id)} className="bg-indigo-600 text-white text-xs px-3 py-1 rounded">Mark Resolved</button>
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
