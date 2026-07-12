const kpis = [
  { label: 'Assets Available', value: 8 },
  { label: 'Assets Allocated', value: 3 },
  { label: 'Maintenance Today', value: 1 },
  { label: 'Active Bookings', value: 0 },
  { label: 'Pending Transfers', value: 0 },
  { label: 'Upcoming Returns', value: 2 }
];

function Dashboard() {
  return (
    <div className="panel">
      <h2>Dashboard</h2>
      <div className="grid kpi-grid">
        {kpis.map((item) => (
          <div key={item.label} className="card">
            <div className="muted">{item.label}</div>
            <h3>{item.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
