export default function Reports() {
  const zarFormatter = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR"
  });

  const weekly = [
    { day: "Mon", revenue: 4200, orders: 78 },
    { day: "Tue", revenue: 3960, orders: 71 },
    { day: "Wed", revenue: 4480, orders: 82 },
    { day: "Thu", revenue: 4860, orders: 88 },
    { day: "Fri", revenue: 5590, orders: 104 },
    { day: "Sat", revenue: 6120, orders: 116 },
    { day: "Sun", revenue: 5010, orders: 91 }
  ];

  const totalRevenue = weekly.reduce((sum, row) => sum + row.revenue, 0);
  const totalOrders = weekly.reduce((sum, row) => sum + row.orders, 0);

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Owner</p>
          <h1>Reports & Analytics</h1>
        </div>
        <div className="chip">Week Snapshot</div>
      </header>
      <section className="grid three">
        <div className="card">
          <h3>Weekly Revenue</h3>
          <div className="metric">{zarFormatter.format(totalRevenue)}</div>
          <p className="muted">+11.3% versus previous week</p>
        </div>
        <div className="card">
          <h3>Total Orders</h3>
          <div className="metric">{totalOrders}</div>
          <p className="muted">Average value {zarFormatter.format(totalRevenue / totalOrders)}</p>
        </div>
        <div className="card highlight">
          <h3>Top Insight</h3>
          <p>Friday and Saturday produce 38% of weekly revenue. Add one extra evening server.</p>
        </div>
      </section>

      <div className="card">
        <h3>Revenue by Day</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Orders</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {weekly.map((row) => (
              <tr key={row.day}>
                <td>{row.day}</td>
                <td>{row.orders}</td>
                <td>{zarFormatter.format(row.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
