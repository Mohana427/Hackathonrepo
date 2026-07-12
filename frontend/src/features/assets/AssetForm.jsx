import { useState } from 'react';

function AssetForm() {
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    serial_number: '',
    acquisition_date: '',
    acquisition_cost: '',
    condition: 'good',
    location: '',
    is_bookable: false,
    photo_url: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.category_id || !form.serial_number || !form.location) {
      alert('Please fill the required fields.');
      return;
    }
    const cost = Number(form.acquisition_cost);
    if (!cost || cost <= 0) {
      alert('Acquisition cost must be a positive number.');
      return;
    }
    alert('Asset registration submitted locally. Connect this to the backend API when available.');
  };

  return (
    <div className="panel">
      <h2>Register Asset</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Category ID" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} />
        <input placeholder="Serial Number" value={form.serial_number} onChange={(e) => setForm({ ...form, serial_number: e.target.value })} />
        <input type="date" value={form.acquisition_date} onChange={(e) => setForm({ ...form, acquisition_date: e.target.value })} />
        <input type="number" step="0.01" placeholder="Acquisition Cost" value={form.acquisition_cost} onChange={(e) => setForm({ ...form, acquisition_cost: e.target.value })} />
        <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
          <option value="new">New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
          <option value="damaged">Damaged</option>
        </select>
        <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input placeholder="Photo URL" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} />
        <label>
          <input type="checkbox" checked={form.is_bookable} onChange={(e) => setForm({ ...form, is_bookable: e.target.checked })} />
          Bookable asset
        </label>
        <div className="row">
          <button type="submit">Save Asset</button>
          <button type="button" className="secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default AssetForm;
