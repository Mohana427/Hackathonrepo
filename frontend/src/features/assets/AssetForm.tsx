import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAsset } from '../../shared/api';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../shared/Button';
import { Skeleton } from '../../shared/Skeleton';
import { toast } from 'sonner';

export const AssetForm: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    tag: '',
    category: 'Electronics',
    serial_number: '',
    location: 'HQ',
    condition: 'good',
    is_bookable: false,
    acquisition_cost: '',
    acquisition_date: '',
    photo_url: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.tag) {
      setErrorMsg('Name and Tag are required');
      setStatus('error');
      return;
    }
    setStatus('loading');
    try {
      await createAsset({
        name: form.name,
        tag: form.tag,
        category: form.category,
        serial_number: form.serial_number || undefined,
        location: form.location,
        condition: form.condition,
        is_bookable: form.is_bookable,
        acquisition_cost: form.acquisition_cost ? parseFloat(form.acquisition_cost) : undefined,
        acquisition_date: form.acquisition_date || undefined,
        photo_url: form.photo_url || undefined,
      });
      setStatus('success');
      toast.success('Asset registered successfully');
      setTimeout(() => navigate('/assets'), 1500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Failed to create asset');
      setStatus('error');
      toast.error(err.response?.data?.detail || 'Failed to create asset');
    }
  };

  if (isInitializing) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center p-6">
        <GradientDots backgroundColor="#0f172a" />
        <div className="relative z-10 w-full max-w-2xl space-y-6">
          <Skeleton className="h-10 w-64 mx-auto" />
          <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl space-y-6 border border-slate-800/50">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden">
      <GradientDots backgroundColor="#0f172a" />
      
      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-black text-white mb-2 tracking-tight">Register Asset</h2>
          <p className="text-slate-400 font-medium">Add a new item to the inventory system</p>
        </div>

        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-500/20 text-green-400 rounded-2xl flex items-center gap-3 border border-green-500/30 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle size={24} />
            <span className="font-semibold">Asset registered successfully! Redirecting...</span>
          </div>
        )}

        {status === 'error' && errorMsg && (
          <div className="mb-6 p-4 bg-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 border border-red-500/30 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
            <AlertCircle size={24} />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        <form 
          onSubmit={handleSubmit} 
          className="bg-slate-900/40 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl space-y-6 border border-slate-800/50 animate-in fade-in zoom-in-95 duration-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Name *</label>
              <input
                type="text" required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-800/40 border border-slate-700/50 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                placeholder={'e.g. MacBook Pro 16"'}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Asset Tag *</label>
              <input
                type="text" required
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                className="w-full bg-slate-800/40 border border-slate-700/50 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                placeholder="e.g. AF-0006"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Category</label>
              <select 
                value={form.category} 
                onChange={(e) => setForm({ ...form, category: e.target.value })} 
                className="w-full bg-slate-800/40 border border-slate-700/50 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
              >
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="AV">AV</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Condition</label>
              <select 
                value={form.condition} 
                onChange={(e) => setForm({ ...form, condition: e.target.value })} 
                className="w-full bg-slate-800/40 border border-slate-700/50 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
              >
                <option value="new">New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Serial Number</label>
              <input
                type="text"
                value={form.serial_number}
                onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
                className="w-full bg-slate-800/40 border border-slate-700/50 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                placeholder="e.g. SN-1006"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full bg-slate-800/40 border border-slate-700/50 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                placeholder="e.g. HQ-01"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Acquisition Cost</label>
              <input
                type="number" step="0.01" min="0"
                value={form.acquisition_cost}
                onChange={(e) => setForm({ ...form, acquisition_cost: e.target.value })}
                className="w-full bg-slate-800/40 border border-slate-700/50 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Acquisition Date</label>
              <input
                type="date"
                value={form.acquisition_date}
                onChange={(e) => setForm({ ...form, acquisition_date: e.target.value })}
                className="w-full bg-slate-800/40 border border-slate-700/50 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Photo URL</label>
            <input
              type="url"
              value={form.photo_url}
              onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
              className="w-full bg-slate-800/40 border border-slate-700/50 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/50 transition-colors hover:bg-slate-800/50 cursor-pointer group">
            <input
              type="checkbox"
              id="is_bookable"
              checked={form.is_bookable}
              onChange={(e) => setForm({ ...form, is_bookable: e.target.checked })}
              className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 outline-none cursor-pointer"
            />
            <label htmlFor="is_bookable" className="text-sm font-medium text-slate-300 cursor-pointer group-hover:text-white transition-colors">
              Make this asset bookable for other users
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              isLoading={status === 'loading'}
              variant="primary"
              className="flex-1 py-4 text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              Save Asset
            </Button>
            <Button
              type="button"
              onClick={() => navigate('/assets')}
              variant="secondary"
              className="flex-1 py-4 text-lg font-bold rounded-2xl transition-all hover:bg-slate-700"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
