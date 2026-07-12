import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Asset, Allocation, MaintenanceRequest } from '../../shared/types';
import { fetchAsset, fetchAllocationHistory, fetchMaintenanceHistory } from '../../shared/api';
import { ArrowLeft } from 'lucide-react';

export const AssetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadData(parseInt(id));
  }, [id]);

  const loadData = async (assetId: number) => {
    try {
      const [assetData, allocData, maintData] = await Promise.all([
        fetchAsset(assetId),
        fetchAllocationHistory(assetId).catch(() => []),
        fetchMaintenanceHistory(assetId).catch(() => []),
      ]);
      setAsset(assetData);
      setAllocations(allocData);
      setMaintenance(maintData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;
  if (!asset) return <div className="p-6 text-center text-red-500">Asset not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate('/assets')} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
        <ArrowLeft size={18} /> Back to Assets
      </button>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">{asset.name}</h2>
            <p className="text-gray-500 font-mono">{asset.tag}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            asset.status === 'available' ? 'bg-green-100 text-green-800' :
            asset.status === 'allocated' ? 'bg-blue-100 text-blue-800' :
            asset.status === 'under_maintenance' ? 'bg-orange-100 text-orange-800' :
            asset.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {asset.status.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-gray-500">Category</div>
            <div className="font-medium">{asset.category}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Location</div>
            <div className="font-medium">{asset.location}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Condition</div>
            <div className="font-medium capitalize">{asset.condition}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Serial Number</div>
            <div className="font-medium font-mono">{asset.serial_number || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Acquisition Cost</div>
            <div className="font-medium">{asset.acquisition_cost ? `$${asset.acquisition_cost.toLocaleString()}` : 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Bookable</div>
            <div className="font-medium">{asset.is_bookable ? 'Yes' : 'No'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Created</div>
            <div className="font-medium">{new Date(asset.created_at).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Last Updated</div>
            <div className="font-medium">{new Date(asset.updated_at).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Allocation History</h3>
          {allocations.length === 0 ? (
            <p className="text-gray-500 text-sm">No allocation history.</p>
          ) : (
            <div className="space-y-3">
              {allocations.map((alloc) => (
                <div key={alloc.id} className="border rounded p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Employee #{alloc.employee_id || 'N/A'}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      alloc.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>{alloc.status}</span>
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {new Date(alloc.allocated_date).toLocaleDateString()}
                    {alloc.actual_return_date && ` - ${new Date(alloc.actual_return_date).toLocaleDateString()}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Maintenance History</h3>
          {maintenance.length === 0 ? (
            <p className="text-gray-500 text-sm">No maintenance history.</p>
          ) : (
            <div className="space-y-3">
              {maintenance.map((req) => (
                <div key={req.id} className="border rounded p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">REQ #{req.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      req.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>{req.status.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-gray-600 mt-1">{req.issue_description}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    {new Date(req.created_at).toLocaleDateString()}
                    {req.technician_name && ` | Tech: ${req.technician_name}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
