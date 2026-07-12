import React, { useEffect, useState } from 'react';
import type { TransferRequest } from '../../shared/types';
import { fetchTransferRequests, approveTransferRequest } from '../../shared/api';
import { useAuth } from '../../shared/AuthContext';
import { Button } from '../../shared/Button';
import { Skeleton } from '../../shared/Skeleton';

export const TransferRequests: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || '';
  const [requests, setRequests] = useState<TransferRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const canApprove = role === 'Asset Manager' || role === 'Department Head';

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await fetchTransferRequests();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching transfer requests", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await approveTransferRequest(id);
      setRequests(reqs => reqs.filter(r => r.id !== id));
      alert("Transfer approved successfully.");
    } catch (err: any) {
      alert("Error approving transfer: " + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-10 w-64 mb-6" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-black text-white mb-6 tracking-tight">Pending Transfer Requests</h2>
      
      {requests.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800">
          <p className="text-slate-500">No pending requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 flex justify-between items-center transition-colors hover:bg-slate-800/60 shadow-sm">
              <div>
                <p className="font-bold text-white text-lg">Transfer for Allocation #{req.allocation_id}</p>
                <p className="text-sm text-slate-400">
                  Requested by <span className="text-blue-400">Employee #{req.requested_by}</span> to <span className="text-blue-400">Employee #{req.requested_to_employee_id}</span>
                </p>
                <p className="text-xs text-slate-500 mt-2">Requested on {new Date(req.created_at).toLocaleDateString()}</p>
              </div>
              
              {canApprove && req.status === 'requested' && (
                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleApprove(req.id)}
                    variant="primary"
                    className="text-sm"
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="danger"
                    className="text-sm"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
