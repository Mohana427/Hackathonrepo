import { useEffect, useMemo, useState } from 'react';

const sampleAssets = [
  { id: 1, asset_tag: 'AF-0001', name: 'MacBook Pro', category: 'Electronics', status: 'available', location: 'HQ-01', condition: 'good' },
  { id: 2, asset_tag: 'AF-0002', name: 'Conference Laptop', category: 'Electronics', status: 'allocated', location: 'Room 2', condition: 'new' },
  { id: 3, asset_tag: 'AF-0003', name: 'Projector', category: 'AV', status: 'under_maintenance', location: 'Storage A', condition: 'fair' }
];

function AssetList() {
  const [assets] = useState(sampleAssets);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesStatus = !status || asset.status === status;
      const matchesSearch = !search || `${asset.asset_tag} ${asset.name} ${asset.location}`.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [assets, search, status]);

  return (
    <div className="panel">
      <h2>Asset Directory</h2>
      <div className="row" style={{ marginBottom: 16 }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="allocated">Allocated</option>
          <option value="reserved">Reserved</option>
          <option value="under_maintenance">Under Maintenance</option>
          <option value="lost">Lost</option>
          <option value="retired">Retired</option>
          <option value="disposed">Disposed</option>
        </select>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by tag, name, or location" />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Asset Tag</th>
            <th>Name</th>
            <th>Category</th>
            <th>Status</th>
            <th>Location</th>
            <th>Condition</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssets.map((asset) => (
            <tr key={asset.id}>
              <td>{asset.asset_tag}</td>
              <td>{asset.name}</td>
              <td>{asset.category}</td>
              <td><span className={`badge ${asset.status}`}>{asset.status.replace(/_/g, ' ')}</span></td>
              <td>{asset.location}</td>
              <td>{asset.condition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssetList;
