
import React from 'react';
import './FleetModules.css';

function FleetUtilisation() {
  // Sample frontend data for demonstration
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
    <div className="fleet-module">

      <div className="module-heading">
        <div>
          <h2>Fleet Utilisation</h2>
          <p>Monitor vehicle usage and fleet performance</p>
        </div>
        <span className="demo-label">Demo Data</span>
      </div>

      {/* Summary cards */}
      <div className="utilisation-cards">

        <div className="util-card">
          <p>Total Vehicles</p>
          <h2>{totalVehicles}</h2>
          <span>Registered fleet</span>
        </div>

        <div className="util-card">
          <p>Active Vehicles</p>
          <h2 className="green-text">{activeVehicles}</h2>
          <span>Currently active in sample data</span>
        </div>

        <div className="util-card">
          <p>Inactive Vehicles</p>
          <h2 className="orange-text">{inactiveVehicles}</h2>
          <span>Not currently active in sample data</span>
        </div>

        <div className="util-card">
          <p>Fleet Utilisation</p>
          <h2>{utilisation}%</h2>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${utilisation}%` }}
            />
          </div>
        </div>

      </div>

      {/* Category distribution */}
      <section className="util-panel">
        <h3>Vehicle Category Distribution</h3>

        {fleetData.map((item) => (
          <div className="category-row" key={item.category}>
            <div className="category-info">
              <span>{item.category}</span>
              <strong>{item.total} vehicles</strong>
            </div>

            <div className="progress-track">
              <div
                className="category-fill"
                style={{
                  width: `${(item.total / totalVehicles) * 100}%`
                }}
              />
            </div>
          </div>
        ))}
      </section>

      {/* Weekly trend */}
      <section className="util-panel">
        <h3>Weekly Utilisation Trend</h3>

        <div className="weekly-chart">
          {weeklyData.map((item) => (
            <div className="chart-column" key={item.day}>
              <strong>{item.value}%</strong>
              <div className="chart-bar-area">
                <div
                  className="chart-bar"
                  style={{ height: `${item.value}%` }}
                />
              </div>
              <span>{item.day}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Performance table */}
      <section className="util-panel">
        <h3>Vehicle Performance</h3>

        <div className="table-wrapper">
          <table className="fleet-table">
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

    </div>
  );
}

export default FleetUtilisation;
