
const alerts = [
  {
    vehicle: "Sample vehicle 1",
    detail: "Illustrative alert for demonstration",
    time: "Demo",
  },
  {
    vehicle: "Sample vehicle 2",
    detail: "Illustrative alert for demonstration",
    time: "Demo",
  },
];

function Dashboard({
  vehicles,
  activeCount,
  maintenance,
  pendingCount,
  totalCost,
  visibleVehicles,
  apiStatus,
  formatDate,
  loadData,
}) {
  const statusCounts = [
    { name: "Operational", count: activeCount, color: "#542638" },
    { name: "Charging", count: 0, color: "#6d8981" },
    { name: "Idle", count: 0, color: "#9baaa5" },
    { name: "Maintenance", count: pendingCount, color: "#b18b64" },
    { name: "Critical alert", count: 0, color: "#853b50" },
  ];

  return (
    <section className="ff-dashboard">
      <div className="ff-section-heading">
        <div>
          <small>01 / FLEET COMMAND</small>
          <h1>Fleet command dashboard</h1>
          <p>Your fleet at a glance, with operational intelligence.</p>
        </div>

        <div className="ff-demo-meta">
          <span className="ff-demo-pill">DEMONSTRATION DATA</span>
          <span>BACKEND VEHICLES · {vehicles.length} RECORDS</span>
        </div>
      </div>

      <div className="ff-dashboard-grid">
        <section className="ff-command-card">
          <div className="ff-command-top">
            <span>FLEET OVERVIEW</span>
            <span className="ff-demo-pill">ILLUSTRATIVE TELEMETRY</span>
          </div>

          <div className="ff-operational-row">
            <div className="ff-big-number">{activeCount}</div>

            <div className="ff-operational-copy">
              <h2>Operational <em>EVs</em></h2>
              <p>
                {vehicles.length
                  ? Math.round((activeCount / vehicles.length) * 100)
                  : 0}
                % of registered vehicles active
              </p>
              <small>Based on backend vehicle status</small>
            </div>

            <div className="ff-total">
              <small>TOTAL FLEET</small>
              <strong>{vehicles.length}</strong>
              <span>Registered vehicles</span>
            </div>
          </div>

          <div
            className="ff-fleet-squares"
            aria-label="Fleet status visualisation"
          >
            {vehicles.map((v) => (
              <span
                key={v.id}
                className={
                  (v.status || "").toLowerCase() === "active"
                    ? "operational"
                    : (v.status || "").toLowerCase().includes("maint")
                      ? "maintenance"
                      : "charging"
                }
              />
            ))}
          </div>

          <div className="ff-legend">
            {statusCounts.map((s) => (
              <span key={s.name}>
                <i style={{ background: s.color }} />
                {s.name} <b>{s.count}</b>
              </span>
            ))}
          </div>

          <p className="ff-square-note">
            Each square represents one registered backend vehicle.
          </p>

          <div className="ff-mini-stats">
            <div>
              <small>CHARGING</small>
              <strong className="sage">—</strong>
              <span>Telemetry not connected</span>
            </div>

            <div>
              <small>IDLE</small>
              <strong className="muted-green">—</strong>
              <span>Telemetry not connected</span>
            </div>

            <div>
              <small>MAINTENANCE</small>
              <strong className="ochre">{pendingCount}</strong>
              <span>Pending records</span>
            </div>
          </div>
        </section>

        <div className="ff-right-stack">
          <section className="ff-alert-card">
            <div className="ff-card-eyebrow">
              <span>CRITICAL ALERTS</span>
              <small>DEMO</small>
            </div>

            <div className="ff-alert-total">
              <strong>—</strong>
              <span>Live alert integration not connected</span>
            </div>

            <div className="ff-alert-list">
              {alerts.map((a, i) => (
                <div className="ff-alert-row" key={i}>
                  <i />
                  <div>
                    <b>{a.vehicle}</b>
                    <p>{a.detail}</p>
                  </div>
                  <time>{a.time}</time>
                </div>
              ))}
            </div>
          </section>

          <section className="ff-insights-card">
            <div className="ff-card-eyebrow">
              <span>AI FLEET INSIGHTS</span>
              <small>PLANNED</small>
            </div>

            <ul>
              <li>
                Battery health analysis can be added after EV telemetry
                integration.
              </li>
              <li>
                Maintenance history can support future predictive maintenance
                models.
              </li>
              <li>Charging and energy analytics are planned enhancements.</li>
            </ul>

            <small className="ff-demo-disclaimer">
              These are proposed capabilities, not active AI predictions.
            </small>
          </section>
        </div>
      </div>

      <div className="ff-lower-grid">
        <section className="ff-data-card">
          <div className="ff-card-heading">
            <div>
              <small>FLEET REGISTER</small>
              <h3>Registered vehicles</h3>
              <p>Live records from your FastAPI backend</p>
            </div>

            <span className="ff-count-pill">{vehicles.length} records</span>
          </div>

          <div className="ff-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>VEHICLE</th>
                  <th>MODEL</th>
                  <th>DRIVER</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {visibleVehicles.slice(0, 5).map((v) => (
                  <tr key={v.id}>
                    <td><b>{v.vehicle_number}</b></td>
                    <td>{v.model}</td>
                    <td>{v.driver || "Unassigned"}</td>
                    <td>
                      <span className="ff-status">
                        {v.status || "Active"}
                      </span>
                    </td>
                  </tr>
                ))}

                {visibleVehicles.length === 0 && (
                  <tr>
                    <td colSpan="4" className="ff-empty">
                      {vehicles.length
                        ? "No matching vehicles."
                        : "No vehicle records returned by the backend yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ff-data-card ff-maintenance-card">
          <div className="ff-card-heading">
            <div>
              <small>SERVICE SCHEDULE</small>
              <h3>Upcoming maintenance</h3>
              <p>Based on saved maintenance records</p>
            </div>
          </div>

          {maintenance.slice(0, 4).map((m) => (
            <div className="ff-maint-row" key={m.id}>
              <span>W</span>
              <div>
                <b>{m.maintenance_type || "Service"}</b>
                <small>{m.description || "Scheduled maintenance"}</small>
              </div>
              <em>{m.status || "Pending"}</em>
            </div>
          ))}

          {!maintenance.length && (
            <div className="ff-empty-maint">
              No maintenance records yet.
            </div>
          )}

          <div className="ff-cost-line">
            <span>Total recorded maintenance cost</span>
            <b>₹{totalCost.toLocaleString("en-IN")}</b>
          </div>
        </section>
      </div>

      <div className={`ff-connection ${apiStatus}`}>
        <span />
        {apiStatus === "connected"
          ? `Backend connected · Updated ${formatDate}`
          : apiStatus === "loading"
            ? "Connecting to FastAPI..."
            : "Backend unavailable"}

        <button onClick={loadData}>
          Refresh data
        </button>
      </div>
    </section>
  );
}

export default Dashboard;
