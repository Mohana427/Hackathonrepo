import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Asset } from '../../shared/types';
import { fetchAssets, deleteAsset } from '../../shared/api';
import { Search, Plus, Trash2, Eye } from 'lucide-react';

export const AssetList: React.FC = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssets();
  }, [search, statusFilter]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const data = await fetchAssets(search || undefined, statusFilter || undefined);
      setAssets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    try {
      await deleteAsset(id);
      setAssets(assets.filter(a => a.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete asset');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Asset Directory</h2>
        <button
          onClick={() => navigate('/assets/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} /> Register Asset
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by tag, name, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border p-2 pl-10 rounded-lg"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="allocated">Allocated</option>
          <option value="reserved">Reserved</option>
          <option value="under_maintenance">Under Maintenance</option>
          <option value="lost">Lost</option>
          <option value="retired">Retired</option>
          <option value="disposed">Disposed</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading assets...</div>
      ) : assets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No assets found</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tag</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm">{asset.tag}</td>
                  <td className="px-4 py-3">{asset.name}</td>
                  <td className="px-4 py-3">{asset.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      asset.status === 'available' ? 'bg-green-100 text-green-800' :
                      asset.status === 'allocated' ? 'bg-blue-100 text-blue-800' :
                      asset.status === 'under_maintenance' ? 'bg-orange-100 text-orange-800' :
                      asset.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {asset.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">{asset.location}</td>
                  <td className="px-4 py-3 capitalize">{asset.condition}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => navigate(`/assets/${asset.id}`)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
