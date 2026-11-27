
import './FleetUtilisation.css';

function FleetUtilisation() {
  const fleetData = [
    { category: 'Two Wheelers', total: 50, active: 40, km: 62, efficiency: 30 },
    { category: 'Three Wheelers', total: 35, active: 28, km: 88, efficiency: 60 },
    { category: 'Cars', total: 25, active: 20, km: 96, efficiency: 150 },
    { category: 'Vans', total: 20, active: 15, km: 118, efficiency: 170 },
    { category: 'Buses', total: 10, active: 7, km: 170, efficiency: 320 },
  ];

  const totalVehicles = fleetData.reduce(
    (sum, item) => sum + item.total, 0
  );

  const activeVehicles = fleetData.reduce(
    (sum, item) => sum + item.active, 0
  );

  const inactiveVehicles = totalVehicles - activeVehicles;

  const utilisation = totalVehicles
    ? Math.round((activeVehicles / totalVehicles) * 100)
    : 0;

  const weeklyData = [
    { day: 'Mon', value: 62 },
    { day: 'Tue', value: 68 },
    { day: 'Wed', value: 65 },
    { day: 'Thu', value: 74 },
    { day: 'Fri', value: 78 },
    { day: 'Sat', value: 82 },
    { day: 'Sun', value: 75 },
  ];

  return (
    <div className="fleet-utilisation-page">

      <div className="fu-heading">
        <div>
          <span className="fu-eyebrow">FLEET ANALYTICS / 07</span>
          <h2>Fleet Utilisation</h2>
          <p>Monitor vehicle usage and overall fleet performance.</p>
        </div>
        <span className="fu-demo-label">DEMO DATA</span>
      </div>

      <div className="fu-summary-grid">

        <div className="fu-card">
          <span className="fu-card-label">TOTAL VEHICLES</span>
          <h3>{totalVehicles}</h3>
          <p>Registered fleet</p>
        </div>

        <div className="fu-card">
          <span className="fu-card-label">ACTIVE VEHICLES</span>
          <h3 className="fu-green">{activeVehicles}</h3>
          <p>Currently active in sample data</p>
        </div>

        <div className="fu-card">
          <span className="fu-card-label">INACTIVE VEHICLES</span>
          <h3 className="fu-orange">{inactiveVehicles}</h3>
          <p>Currently not in operation</p>
        </div>

        <div className="fu-card">
          <span className="fu-card-label">FLEET UTILISATION</span>
          <h3>{utilisation}%</h3>
          <div className="fu-progress-track">
            <div
              className="fu-progress-fill"
              style={{ width: `${utilisation}%` }}
            />
          </div>
          <p>Active fleet percentage</p>
        </div>

      </div>

      <section className="fu-panel">
        <div className="fu-panel-heading">
          <div>
            <span className="fu-section-label">FLEET BREAKDOWN</span>
            <h3>Vehicle Category Distribution</h3>
          </div>
          <span className="fu-total-label">{totalVehicles} vehicles</span>
        </div>

        <div className="fu-category-list">
          {fleetData.map((item) => (
            <div className="fu-category-row" key={item.category}>
              <div className="fu-category-info">
                <span>{item.category}</span>
                <strong>{item.total} vehicles</strong>
              </div>

              <div className="fu-progress-track">
                <div
                  className="fu-category-fill"
                  style={{
                    width: `${(item.total / totalVehicles) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="fu-panel">
        <div className="fu-panel-heading">
          <div>
            <span className="fu-section-label">WEEKLY OVERVIEW</span>
            <h3>Weekly Utilisation Trend</h3>
          </div>
          <span className="fu-total-label">Last 7 days</span>
        </div>

        <div className="fu-chart">
          {weeklyData.map((item) => (
            <div className="fu-chart-column" key={item.day}>
              <strong>{item.value}%</strong>
              <div className="fu-chart-bar-area">
                <div
                  className="fu-chart-bar"
                  style={{ height: `${item.value}%` }}
                />
              </div>
              <span>{item.day}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="fu-panel">
        <div className="fu-panel-heading">
          <div>
            <span className="fu-section-label">PERFORMANCE DETAILS</span>
            <h3>Vehicle Performance</h3>
          </div>
          <span className="fu-total-label">By category</span>
        </div>

        <div className="fu-table-wrapper">
          <table className="fu-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total</th>
                <th>Active</th>
                <th>Avg. km/day</th>
                <th>Efficiency (Wh/km)</th>
              </tr>
            </thead>

            <tbody>
              {fleetData.map((item) => (
                <tr key={item.category}>
                  <td>{item.category}</td>
                  <td>{item.total}</td>
                  <td>{item.active}</td>
                  <td>{item.km}</td>
                  <td>{item.efficiency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="fu-footnote">
        Note: Values shown are sample demonstration data and are not live fleet readings.
      </p>

    </div>
  );
}

export default FleetUtilisation;
