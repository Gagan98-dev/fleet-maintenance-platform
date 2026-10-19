
import { useEffect, useState } from 'react'
import './App.css'

const API = 'http://127.0.0.1:8000'

function App() {
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [maintenance, setMaintenance] = useState([])
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      const endpoints = [
        { name: 'vehicles', path: '/vehicles' },
        { name: 'drivers', path: '/drivers' },
        { name: 'maintenance', path: '/maintenance' },
      ]

      const results = await Promise.all(
        endpoints.map(async ({ name, path }) => {
          try {
            const response = await fetch(`${API}${path}`)
            if (!response.ok) throw new Error(`${name} request failed`)
            const data = await response.json()
            if (!Array.isArray(data)) throw new Error(`${name} response is not a list`)
            return { name, data, error: '' }
          } catch {
            return {
              name,
              data: [],
              error: `Could not load ${name}. Check that the backend is running.`,
            }
          }
        })
      )

      if (cancelled) return

      const byName = Object.fromEntries(results.map((item) => [item.name, item]))

      setVehicles(byName.vehicles.data)
      setDrivers(byName.drivers.data)
      setMaintenance(byName.maintenance.data)
      setErrors(results.map((item) => item.error).filter(Boolean))
      setLoading(false)
    }

    loadDashboard()

    return () => {
      cancelled = true
    }
  }, [])

  const activeVehicles = vehicles.filter(
    (vehicle) => (vehicle.status || '').toLowerCase() === 'active'
  ).length

  const inactiveVehicles = vehicles.filter(
    (vehicle) => (vehicle.status || '').toLowerCase() === 'inactive'
  ).length

  const activeDrivers = drivers.filter(
    (driver) => (driver.status || '').toLowerCase() === 'active'
  ).length

  const assignedVehicleNumbers = new Set(
    drivers.flatMap((driver) =>
      Array.isArray(driver.vehicles) ? driver.vehicles : []
    )
  )

  const assignedVehicleIds = new Set(
    vehicles
      .filter((vehicle) => assignedVehicleNumbers.has(vehicle.vehicle_number))
      .map((vehicle) => vehicle.id)
  )

  const activeAssignments = vehicles.filter(
    (vehicle) =>
      vehicle.driver ||
      assignedVehicleIds.has(vehicle.id)
  ).length

  const completedMaintenance = maintenance.filter(
    (record) => (record.status || '').toLowerCase() === 'completed'
  ).length

  const pendingMaintenance = maintenance.filter(
    (record) => (record.status || '').toLowerCase() === 'pending'
  ).length

  const vehicleById = Object.fromEntries(
    vehicles.map((vehicle) => [vehicle.id, vehicle])
  )

  const getVehicleNumber = (record) =>
    vehicleById[record.vehicle_id]?.vehicle_number || `Vehicle ID ${record.vehicle_id}`

  const getDate = (value) => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString('en-CA')
  }

  const monthLabels = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
  const maintenanceByMonth = monthLabels.map((month, index) => {
    const monthNumber = index + 5
    const count = maintenance.filter((record) => {
      if (!record.maintenance_date) return false
      const date = new Date(record.maintenance_date)
      return (
        date.getFullYear() === 2026 &&
        date.getMonth() + 1 === monthNumber
      )
    })

    return {
      month,
      completed: count.filter(
        (record) => (record.status || '').toLowerCase() === 'completed'
      ).length,
      pending: count.filter(
        (record) => (record.status || '').toLowerCase() === 'pending'
      ).length,
    }
  })

  const maxMonthlyCount = Math.max(
    1,
    ...maintenanceByMonth.map((item) => item.completed + item.pending)
  )

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">🚚</span>
          <div>
            <h2>FastFleet</h2>
            <small>Fleet Maintenance &amp; Analytics</small>
          </div>
        </div>

        <nav>
          <a className="active" href="#dashboard">▦ Dashboard</a>
          <a href="#vehicles">▣ Vehicles</a>
          <a href="#drivers">♟ Drivers</a>
          <a href="#assignments">🔗 Assignments</a>
          <a href="#maintenance">🔧 Maintenance</a>
          <a href="#reports">▥ Reports</a>
        </nav>

        <div className="sidebar-user">
          <span className="avatar">G</span>
          <div>
            Gagan
            <small>Admin</small>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <input
            className="search"
            placeholder="⌕   Search vehicles, drivers, or maintenance..."
            aria-label="Search vehicles, drivers, or maintenance"
          />
          <div className="top-user">
            <span className="notification">♧ <sup>{pendingMaintenance}</sup></span>
            <span className="avatar">G</span>
            Gagan⌄
          </div>
        </header>

        <section className="content" id="dashboard">
          {errors.map((error) => (
            <p role="alert" key={error}>{error}</p>
          ))}

          <div className="page-heading">
            <div>
              <h1>Dashboard</h1>
              <p>Overview of your fleet, drivers and maintenance status.</p>
            </div>
            <span className="date-button">
              ▦ &nbsp; {new Date().toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          <div className="stats-grid">
            <StatCard icon="🚘" number={loading ? '…' : vehicles.length} title="Total Vehicles" note="Fleet vehicles" color="blue" />
            <StatCard icon="♟" number={loading ? '…' : drivers.length} title="Total Drivers" note={`${activeDrivers} active drivers`} color="green" />
            <StatCard icon="🔧" number={loading ? '…' : maintenance.length} title="Maintenance Records" note={`${pendingMaintenance} pending`} color="orange" />
            <StatCard icon="⬡" number={loading ? '…' : activeAssignments} title="Active Assignments" note="Assigned vehicles" color="purple" />
          </div>

          <div className="charts-grid">
            <section className="panel">
              <h3>Vehicle Status</h3>
              <div className="vehicle-chart-area">
                <div
                  className="donut"
                  style={{
                    background: vehicles.length
                      ? `conic-gradient(#22c55e 0 ${(activeVehicles / vehicles.length) * 100}%, #3b82f6 ${(activeVehicles / vehicles.length) * 100}% 100%)`
                      : '#e2e8f0',
                  }}
                >
                  <div>
                    <strong>{loading ? '…' : vehicles.length}</strong>
                    <span>Total</span>
                  </div>
                </div>
                <div className="legend">
                  <p><i className="dot green-dot" /> Active <b>{activeVehicles}</b></p>
                  <p><i className="dot blue-dot" /> Inactive <b>{inactiveVehicles}</b></p>
                </div>
              </div>
            </section>

            <section className="panel">
              <h3>Maintenance Overview</h3>
              <div className="bar-chart">
                {maintenanceByMonth.map((item) => (
                  <div className="bar-column" key={item.month}>
                    <div className="bar-pair">
                      <div
                        className="bar"
                        style={{
                          height: `${Math.max(3, (item.completed / maxMonthlyCount) * 85)}px`,
                        }}
                        title={`Completed: ${item.completed}`}
                      />
                      <div
                        className="bar pending-bar"
                        style={{
                          height: `${Math.max(3, (item.pending / maxMonthlyCount) * 85)}px`,
                          visibility: item.pending ? 'visible' : 'hidden',
                        }}
                        title={`Pending: ${item.pending}`}
                      />
                    </div>
                    <span>{item.month}</span>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <span>🔵 Completed</span>
                <span>🟠 Pending</span>
              </div>
            </section>
          </div>

          <div className="tables-grid">
            <section className="panel table-panel" id="vehicles">
              <div className="panel-heading">
                <h3>Recent Vehicles</h3>
                <a href="#vehicles">View All →</a>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Vehicle No.</th>
                      <th>Model</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Driver</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id}>
                        <td>{vehicle.vehicle_number}</td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.vehicle_type}</td>
                        <td>
                          <span className={`badge ${(vehicle.status || '').toLowerCase()}`}>
                            {vehicle.status || 'Unknown'}
                          </span>
                        </td>
                        <td>{vehicle.driver || '-'}</td>
                      </tr>
                    ))}
                    {!loading && vehicles.length === 0 && (
                      <tr><td colSpan="5">No vehicles found.</td></tr>
                    )}
                    {loading && (
                      <tr><td colSpan="5">Loading vehicles…</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel table-panel" id="maintenance">
              <div className="panel-heading">
                <h3>Upcoming Maintenance</h3>
                <a href="#maintenance">View All →</a>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Vehicle No.</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenance.map((record) => (
                      <tr key={record.id}>
                        <td>{getVehicleNumber(record)}</td>
                        <td>{record.maintenance_type}</td>
                        <td>{record.description || '-'}</td>
                        <td>{getDate(record.maintenance_date)}</td>
                        <td>
                          <span className={`badge ${(record.status || '').toLowerCase()}`}>
                            {record.status || 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {!loading && maintenance.length === 0 && (
                      <tr><td colSpan="5">No maintenance records found.</td></tr>
                    )}
                    {loading && (
                      <tr><td colSpan="5">Loading maintenance…</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="quick-actions">
            <QuickAction icon="🚘" title="Add Vehicle" text="Register a new vehicle to the fleet" color="blue" />
            <QuickAction icon="♟" title="Add Driver" text="Add a new driver to the system" color="green" />
            <QuickAction icon="🔧" title="Add Maintenance" text="Schedule a maintenance record" color="purple" />
            <QuickAction icon="🔗" title="Assign Driver" text="Assign a driver to a vehicle" color="red" />
          </div>
        </section>
      </main>
    </div>
  )
}

function StatCard({ icon, number, title, note, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div>
        <strong>{number}</strong>
        <p>{title}</p>
        <small>{note}</small>
      </div>
    </div>
  )
}

function QuickAction({ icon, title, text, color }) {
  return (
    <button
      className={`quick-action ${color}`}
      onClick={() => alert(`${title} will be implemented in the next stage.`)}
    >
      <span className="quick-icon">{icon}</span>
      <span className="quick-text">
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
      <span className="arrow">→</span>
    </button>
  )
}

export default App
