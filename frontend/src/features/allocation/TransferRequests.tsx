import React, { useEffect, useState } from 'react';
import type { TransferRequest } from '../../shared/types';
import { fetchTransferRequests, approveTransferRequest } from '../../shared/api';

import { useAuth } from '../../shared/AuthContext';

export const TransferRequests: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || '';
  const [requests, setRequests] = useState<TransferRequest[]>([]);
  const canApprove = role === 'Asset Manager' || role === 'Department Head';

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await fetchTransferRequests();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching transfer requests", err);
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Pending Transfer Requests</h2>
      
      {requests.length === 0 ? (
        <p className="text-gray-500">No pending requests.</p>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="bg-white p-4 rounded shadow border flex justify-between items-center">
              <div>
                <p className="font-semibold">Transfer for Allocation #{req.allocation_id}</p>
                <p className="text-sm text-gray-600">
                  Requested by Employee #{req.requested_by} to Employee #{req.requested_to_employee_id}
                </p>
                <p className="text-xs text-gray-400 mt-1">Requested on {new Date(req.created_at).toLocaleDateString()}</p>
              </div>
              
              {canApprove && req.status === 'requested' && (
                <div className="space-x-2">
                  <button 
                    onClick={() => handleApprove(req.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button 
                    className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 border border-red-200"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
