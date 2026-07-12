import React, { useState } from 'react';
import { createAllocation } from '../../shared/api';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const AllocationPage: React.FC = () => {
  const [assetId, setAssetId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'conflict'>('idle');
  const [conflictData, setConflictData] = useState<{ holderName: string, allocationId: number } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setConflictData(null);

    try {
      await createAllocation({
        asset_id: parseInt(assetId),
        employee_id: employeeId ? parseInt(employeeId) : undefined,
        expected_return_date: expectedReturnDate ? new Date(expectedReturnDate).toISOString() : undefined
      });
      setStatus('success');
      // Reset form
      setAssetId('');
      setEmployeeId('');
      setExpectedReturnDate('');
    } catch (err: any) {
      if (err.response?.status === 409) {
        setStatus('conflict');
        setConflictData({
          holderName: err.response.data.detail.holder_name || err.response.data.detail.detail.replace('currently held by ', ''),
          allocationId: err.response.data.detail.allocation_id
        });
      } else {
        setStatus('idle');
        alert("An error occurred: " + (err.response?.data?.detail || err.message));
      }
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Allocate Asset</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Asset ID</label>
          <input 
            type="number" 
            required 
            value={assetId} 
            onChange={e => setAssetId(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Employee ID</label>
          <input 
            type="number" 
            value={employeeId} 
            onChange={e => setEmployeeId(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Optional if department provided"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Expected Return Date</label>
          <input 
            type="date" 
            value={expectedReturnDate} 
            onChange={e => setExpectedReturnDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={status === 'loading'}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {status === 'loading' ? 'Allocating...' : 'Allocate'}
        </button>
      </form>

      {status === 'success' && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded flex items-center gap-2">
          <CheckCircle2 size={20} />
          <span>Asset allocated successfully!</span>
        </div>
      )}

      {status === 'conflict' && conflictData && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded">
          <div className="flex items-start gap-2 mb-3">
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-900">Asset Unavailable</h4>
              <p>This asset is currently held by <strong>{conflictData.holderName}</strong>.</p>
            </div>
          </div>
          <div className="ml-7">
            <button 
              onClick={() => {
                alert(`Opening transfer request modal for allocation ${conflictData.allocationId}`);
                // In a real app, this would open a modal calling createTransferRequest
              }}
              className="bg-amber-600 text-white px-3 py-1.5 rounded text-sm hover:bg-amber-700"
            >
              Request Transfer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
