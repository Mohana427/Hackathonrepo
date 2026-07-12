import React, { useState } from 'react';
import { createAllocation, createTransferRequest } from '../../shared/api';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from '../../shared/Button';
import { Skeleton } from '../../shared/Skeleton';
import { toast } from 'sonner';

export const AllocationPage: React.FC = () => {
  const [assetId, setAssetId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'conflict'>('idle');
  const [conflictData, setConflictData] = useState<{ holderName: string, allocationId: number } | null>(null);

  // Transfer Request Modal State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferForm, setTransferForm] = useState({
    requested_to_employee_id: '',
    requested_to_department_id: '',
  });
  const [transferLoading, setTransferLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setConflictData(null);
    setShowTransferModal(false);

    try {
      await createAllocation({
        asset_id: parseInt(assetId),
        employee_id: employeeId ? parseInt(employeeId) : undefined,
        expected_return_date: expectedReturnDate ? new Date(expectedReturnDate).toISOString() : undefined
      });
      setStatus('success');
      toast.success('Asset allocated successfully');
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
        toast.error(err.response?.data?.detail || err.message);
      }
    }
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conflictData) return;
    setTransferLoading(true);
    try {
      await createTransferRequest({
        allocation_id: conflictData.allocationId,
        requested_to_employee_id: transferForm.requested_to_employee_id ? parseInt(transferForm.requested_to_employee_id) : undefined,
        requested_to_department_id: transferForm.requested_to_department_id ? parseInt(transferForm.requested_to_department_id) : undefined,
      });
      toast.success("Transfer request submitted successfully!");
      setShowTransferModal(false);
      setTransferForm({ requested_to_employee_id: '', requested_to_department_id: '' });
    } catch (err: any) {
      toast.error("Error submitting transfer request: " + (err.response?.data?.detail || err.message));
    } finally {
      setTransferLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="bg-slate-900/50 p-6 rounded-3xl space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-black text-white mb-6 tracking-tight">Allocate Asset</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-slate-800">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 ml-1">Asset ID</label>
          <input 
            type="number" 
            required 
            value={assetId} 
            onChange={e => setAssetId(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 text-white p-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 ml-1">Employee ID</label>
          <input 
            type="number" 
            value={employeeId} 
            onChange={e => setEmployeeId(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 text-white p-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Optional if department provided"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 ml-1">Expected Return Date</label>
          <input 
            type="date" 
            value={expectedReturnDate} 
            onChange={e => setExpectedReturnDate(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 text-white p-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        
        <Button 
          type="submit" 
          isLoading={status === 'loading'}
          variant="primary"
          className="w-full py-3"
        >
          Allocate Asset
        </Button>
      </form>

      {status === 'success' && (
        <div className="mt-4 p-4 bg-green-500/20 text-green-400 rounded-xl flex items-center gap-2 border border-green-500/30">
          <CheckCircle2 size={20} />
          <span>Asset allocated successfully!</span>
        </div>
      )}

      {status === 'conflict' && conflictData && (
        <div className="mt-4 p-4 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl">
          <div className="flex items-start gap-2 mb-3">
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-amber-200">Asset Unavailable</h4>
              <p>This asset is currently held by <strong>{conflictData.holderName}</strong>.</p>
            </div>
          </div>
          <div className="ml-7">
            <Button 
              onClick={() => setShowTransferModal(true)}
              variant="primary"
              className="text-sm"
            >
              Request Transfer
            </Button>
          </div>
        </div>
      )}
       
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            <button 
              onClick={() => setShowTransferModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-black text-white mb-2">Request Asset Transfer</h3>
            <p className="text-sm text-slate-400 mb-6">
              This asset is currently held by {conflictData?.holderName}. Please specify the new recipient.
            </p>
            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 ml-1">Recipient Employee ID</label>
                <input 
                  type="number" 
                  value={transferForm.requested_to_employee_id} 
                  onChange={e => setTransferForm({ ...transferForm, requested_to_employee_id: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white p-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Employee ID"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 ml-1">Recipient Department ID</label>
                <input 
                  type="number" 
                  value={transferForm.requested_to_department_id} 
                  onChange={e => setTransferForm({ ...transferForm, requested_to_department_id: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white p-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Department ID"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  onClick={() => setShowTransferModal(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  isLoading={transferLoading}
                  variant="primary"
                  className="flex-1"
                >
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
