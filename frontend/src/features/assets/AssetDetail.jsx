import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

const asset = {
  id: 1,
  asset_tag: 'AF-0001',
  name: 'MacBook Pro',
  category: 'Electronics',
  status: 'available',
  location: 'HQ-01',
  condition: 'good',
  serial_number: 'SN-1001',
  acquisition_cost: 1800,
  acquisition_date: '2024-01-10',
  allocation_history: [],
  maintenance_history: []
};

function AssetDetail() {
  const { id } = useParams();
  const currentAsset = useMemo(() => ({ ...asset, id: Number(id) || asset.id }), [id]);

  return (
    <div className="panel">
      <h2>{currentAsset.name}</h2>
      <p className="muted">Asset tag: {currentAsset.asset_tag}</p>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div><strong>Category</strong><div>{currentAsset.category}</div></div>
        <div><strong>Status</strong><div><span className={`badge ${currentAsset.status}`}>{currentAsset.status.replace(/_/g, ' ')}</span></div></div>
        <div><strong>Location</strong><div>{currentAsset.location}</div></div>
        <div><strong>Condition</strong><div>{currentAsset.condition}</div></div>
        <div><strong>Serial Number</strong><div>{currentAsset.serial_number}</div></div>
        <div><strong>Acquisition Cost</strong><div>${currentAsset.acquisition_cost}</div></div>
      </div>

      <div className="grid" style={{ marginTop: 20 }}>
        <div className="panel">
          <h3>Allocation History</h3>
          {currentAsset.allocation_history.length ? <div>History available when backend data is present.</div> : <p className="muted">No history yet.</p>}
        </div>
        <div className="panel">
          <h3>Maintenance History</h3>
          {currentAsset.maintenance_history.length ? <div>History available when backend data is present.</div> : <p className="muted">No history yet.</p>}
        </div>
      </div>
    </div>
  );
}

export default AssetDetail;
