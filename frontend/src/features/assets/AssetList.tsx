import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Asset } from '../../shared/types';
import { fetchAssets, deleteAsset } from '../../shared/api';
import { Search, Plus, Trash2, Eye } from 'lucide-react';
import { Button } from '../../shared/Button';
import { toast } from 'sonner';

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
      toast.success('Asset deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to delete asset');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-black text-white tracking-tight">Asset Directory</h2>
        <Button
          onClick={() => navigate('/assets/new')}
          variant="primary"
          className="flex items-center gap-2"
        >
          <Plus size={18} /> Register Asset
        </Button>
      </div>

        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search by tag, name, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 text-white p-2 pl-10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900/50 border border-slate-700 text-white p-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
         <div className="text-center py-8 text-slate-400">Loading assets...</div>
       ) : assets.length === 0 ? (
         <div className="text-center py-8 text-slate-400">No assets found</div>
       ) : (
         <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-slate-800">
           <table className="w-full">
             <thead className="bg-slate-800/50">
               <tr>
                 <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Tag</th>
                 <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                 <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                 <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                 <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Location</th>
                 <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Condition</th>
                 <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-800">
               {assets.map((asset) => (
                 <tr key={asset.id} className="hover:bg-slate-800/30 transition-colors">
                   <td className="px-4 py-3 font-mono text-sm text-blue-400">{asset.tag}</td>
                   <td className="px-4 py-3 text-white">{asset.name}</td>
                   <td className="px-4 py-3 text-slate-300">{asset.category}</td>
                   <td className="px-4 py-3">
                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                       asset.status === 'available' ? 'bg-green-500/20 text-green-400' :
                       asset.status === 'allocated' ? 'bg-blue-500/20 text-blue-400' :
                       asset.status === 'under_maintenance' ? 'bg-orange-500/20 text-orange-400' :
                       asset.status === 'reserved' ? 'bg-yellow-500/20 text-yellow-400' :
                       'bg-slate-700/50 text-slate-300'
                     }`}>
                       {asset.status.replace(/_/g, ' ')}
                     </span>
                   </td>
                   <td className="px-4 py-3 text-slate-300">{asset.location}</td>
                   <td className="px-4 py-3 capitalize text-slate-300">{asset.condition}</td>
                   <td className="px-4 py-3 text-right">
                     <Button
                       onClick={() => navigate(`/assets/${asset.id}`)}
                       variant="ghost"
                       className="text-blue-400 hover:text-blue-300 p-2 h-auto w-auto mr-2"
                     >
                       <Eye size={16} />
                     </Button>
                     <Button
                       onClick={() => handleDelete(asset.id)}
                       variant="ghost"
                       className="text-red-400 hover:text-red-300 p-2 h-auto w-auto"
                     >
                       <Trash2 size={16} />
                     </Button>
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
