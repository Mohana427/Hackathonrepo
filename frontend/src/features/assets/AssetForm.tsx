import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAsset } from '../../shared/api';
import { CheckCircle, AlertCircle } from 'lucide-react';

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
      setTimeout(() => navigate('/assets'), 1500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Failed to create asset');
      setStatus('error');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Register Asset</h2>

      {status === 'success' && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
          <CheckCircle size={20} />
          <span>Asset registered successfully! Redirecting...</span>
        </div>
      )}

      {status === 'error' && errorMsg && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text" required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border p-2 rounded-lg"
              placeholder={'e.g. MacBook Pro 16"'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Asset Tag *</label>
            <input
              type="text" required
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
              className="w-full border p-2 rounded-lg"
              placeholder="e.g. AF-0006"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border p-2 rounded-lg">
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="AV">AV</option>
              <option value="General">General</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Condition</label>
            <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className="w-full border p-2 rounded-lg">
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
              <option value="damaged">Damaged</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Serial Number</label>
            <input
              type="text"
              value={form.serial_number}
              onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
              className="w-full border p-2 rounded-lg"
              placeholder="e.g. SN-1006"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full border p-2 rounded-lg"
              placeholder="e.g. HQ-01"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Acquisition Cost</label>
            <input
              type="number" step="0.01" min="0"
              value={form.acquisition_cost}
              onChange={(e) => setForm({ ...form, acquisition_cost: e.target.value })}
              className="w-full border p-2 rounded-lg"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Acquisition Date</label>
            <input
              type="date"
              value={form.acquisition_date}
              onChange={(e) => setForm({ ...form, acquisition_date: e.target.value })}
              className="w-full border p-2 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Photo URL</label>
          <input
            type="url"
            value={form.photo_url}
            onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
            className="w-full border p-2 rounded-lg"
            placeholder="https://..."
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_bookable}
            onChange={(e) => setForm({ ...form, is_bookable: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm font-medium">Bookable asset</span>
        </label>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {status === 'loading' ? 'Saving...' : 'Save Asset'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/assets')}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
