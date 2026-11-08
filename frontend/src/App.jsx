import { useEffect, useState } from 'react'
import './App.css'
import BatteryIntelligence from "./pages/BatteryIntelligence";
import ChargingOperations from "./pages/ChargingOperations";


const API = 'http://127.0.0.1:8000'

function App() {
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [maintenance, setMaintenance] = useState([])

  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(true)

  const [activeSection, setActiveSection] = useState('dashboard')

  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [savingVehicle, setSavingVehicle] = useState(false)
  const [vehicleMessage, setVehicleMessage] = useState('')
  const [vehicleError, setVehicleError] = useState('')

  const [showDriverForm, setShowDriverForm] = useState(false)
  const [editingDriver, setEditingDriver] = useState(null)
  const [savingDriver, setSavingDriver] = useState(false)
  const [driverMessage, setDriverMessage] = useState('')
  const [driverError, setDriverError] = useState('')

  const [showAssignForm, setShowAssignForm] = useState(false)
  const [assignVehicleId, setAssignVehicleId] = useState('')
  const [assignDriverId, setAssignDriverId] = useState('')
  const [assignMessage, setAssignMessage] = useState('')
  const [assignError, setAssignError] = useState('')
  const [savingAssignment, setSavingAssignment] = useState(false)

  // Maintenance form state
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false)
  const [savingMaintenance, setSavingMaintenance] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState('')
  const [maintenanceError, setMaintenanceError] = useState('')

  const emptyVehicleForm = {
    vehicle_number: '',
    model: '',
    vehicle_type: 'Truck',
    status: 'Active',
  }

  const emptyDriverForm = {
    name: '',
    phone: '',
    license_number: '',
    status: 'Active',
  }

  const emptyMaintenanceForm = {
    vehicle_id: '',
    maintenance_type: '',
    description: '',
    cost: '',
    maintenance_date: '',
    status: 'Scheduled',
  }

  const [vehicleForm, setVehicleForm] = useState(emptyVehicleForm)
  const [driverForm, setDriverForm] = useState(emptyDriverForm)
  const [maintenanceForm, setMaintenanceForm] = useState(emptyMaintenanceForm)

  async function loadData(showLoading = true) {
    // Skip the synchronous loading update during the first page render.
    if (showLoading) setLoading(true)

    const endpoints = [
      { name: 'vehicles', path: '/vehicles' },
      { name: 'drivers', path: '/drivers' },
      { name: 'maintenance', path: '/maintenance' },
    ]

    const results = await Promise.all(
      endpoints.map(async ({ name, path }) => {
        try {
          const response = await fetch(`${API}${path}`)
          if (!response.ok) throw new Error()

          const data = await response.json()
          if (!Array.isArray(data)) throw new Error()

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

    const data = Object.fromEntries(
      results.map((item) => [item.name, item.data])
    )

    setVehicles(data.vehicles)
    setDrivers(data.drivers)
    setMaintenance(data.maintenance)
    setErrors(results.map((item) => item.error).filter(Boolean))
    setLoading(false)
  }

 useEffect(() => {
    const timer = setTimeout(() => {
        loadData(false);
    }, 0);

    return () => clearTimeout(timer);
}, []);

  

  const pendingMaintenance = maintenance.filter(
    (m) => ['pending', 'scheduled'].includes(
      (m.status || '').toLowerCase()
    )
  ).length

 

  const vehicleById = Object.fromEntries(
    vehicles.map((v) => [v.id, v])
  )

  function getVehicleNumber(record) {
    return vehicleById[record.vehicle_id]?.vehicle_number
      || `Vehicle ID ${record.vehicle_id}`
  }

  function getDate(value) {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString('en-IN')
  }

  function openAddVehicle() {
    setEditingVehicle(null)
    setVehicleForm({ ...emptyVehicleForm })
    setVehicleError('')
    setVehicleMessage('')
    setShowVehicleForm(true)
    setActiveSection('vehicles')
  }

  function openEditVehicle(vehicle) {
    setEditingVehicle(vehicle)
    setVehicleForm({
      vehicle_number: vehicle.vehicle_number || '',
      model: vehicle.model || '',
      vehicle_type: vehicle.vehicle_type || 'Truck',
      status: vehicle.status || 'Active',
    })
    setVehicleError('')
    setVehicleMessage('')
    setShowVehicleForm(true)
    setActiveSection('vehicles')
  }

  async function saveVehicle(event) {
    event.preventDefault()
    setVehicleError('')
    setVehicleMessage('')

    const payload = {
      vehicle_number: vehicleForm.vehicle_number.trim(),
      model: vehicleForm.model.trim(),
      vehicle_type: vehicleForm.vehicle_type.trim() || null,
      status: vehicleForm.status,
    }

    if (!payload.vehicle_number || !payload.model) {
      setVehicleError('Vehicle number and model are required.')
      return
    }

    setSavingVehicle(true)

    try {
      const url = editingVehicle
        ? `${API}/vehicles/${editingVehicle.id}`
        : `${API}/vehicles`

      const response = await fetch(url, {
        method: editingVehicle ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          typeof result.detail === 'string'
            ? result.detail
            : 'Could not save vehicle. Check the entered details.'
        )
      }

      await loadData()
      setShowVehicleForm(false)
      setEditingVehicle(null)
      setVehicleMessage(
        editingVehicle
          ? 'Vehicle updated successfully.'
          : 'Vehicle added successfully.'
      )
    } catch (error) {
      setVehicleError(error.message || 'Could not connect to the backend.')
    } finally {
      setSavingVehicle(false)
    }
  }

  async function deleteVehicle(vehicle) {
    const confirmed = window.confirm(
      `Delete vehicle ${vehicle.vehicle_number}? This cannot be undone.`
    )

    if (!confirmed) return

    setVehicleError('')
    setVehicleMessage('')

    try {
      const response = await fetch(`${API}/vehicles/${vehicle.id}`, {
        method: 'DELETE',
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          typeof result.detail === 'string'
            ? result.detail
            : 'Could not delete vehicle.'
        )
      }

      await loadData()
      setVehicleMessage(`Vehicle ${vehicle.vehicle_number} deleted successfully.`)
    } catch (error) {
      setVehicleError(error.message || 'Could not connect to the backend.')
    }
  }

  function openAddDriver() {
    setEditingDriver(null)
    setDriverForm({ ...emptyDriverForm })
    setDriverError('')
    setDriverMessage('')
    setShowDriverForm(true)
    setActiveSection('drivers')
  }

  function openEditDriver(driver) {
    setEditingDriver(driver)
    setDriverForm({
      name: driver.name || '',
      phone: driver.phone || '',
      license_number: driver.license_number || '',
      status: driver.status || 'Active',
    })
    setDriverError('')
    setDriverMessage('')
    setShowDriverForm(true)
    setActiveSection('drivers')
  }

  async function saveDriver(event) {
    event.preventDefault()
    setDriverError('')
    setDriverMessage('')

    const payload = {
      name: driverForm.name.trim(),
      phone: driverForm.phone.trim(),
      license_number: driverForm.license_number.trim(),
      status: driverForm.status,
    }

    if (!payload.name || !payload.phone || !payload.license_number) {
      setDriverError('Please fill in all required fields.')
      return
    }

    setSavingDriver(true)

    try {
      const url = editingDriver
        ? `${API}/drivers/${editingDriver.id}`
        : `${API}/drivers`

      const response = await fetch(url, {
        method: editingDriver ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          typeof result.detail === 'string'
            ? result.detail
            : 'Could not save driver. Check the entered details.'
        )
      }

      await loadData()
      setShowDriverForm(false)
      setEditingDriver(null)
      setDriverMessage(
        editingDriver
          ? 'Driver updated successfully.'
          : 'Driver added successfully.'
      )
    } catch (error) {
      setDriverError(error.message || 'Could not connect to the backend.')
    } finally {
      setSavingDriver(false)
    }
  }

  async function deleteDriver(driver) {
    const assigned = vehicles.some(
      (vehicle) => vehicle.driver === driver.name
    )

    if (assigned) {
      setDriverError(
        'This driver is assigned to a vehicle. Please reassign the vehicle before deleting this driver.'
      )
      return
    }

    if (!window.confirm(`Delete driver ${driver.name}? This cannot be undone.`)) {
      return
    }

    setDriverError('')
    setDriverMessage('')

    try {
      const response = await fetch(`${API}/drivers/${driver.id}`, {
        method: 'DELETE',
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          typeof result.detail === 'string'
            ? result.detail
            : 'Could not delete driver.'
        )
      }

      await loadData()
      setDriverMessage(`Driver ${driver.name} deleted successfully.`)
    } catch (error) {
      setDriverError(error.message || 'Could not connect to the backend.')
    }
  }

  function openAssignForm() {
    setAssignVehicleId('')
    setAssignDriverId('')
    setAssignError('')
    setAssignMessage('')
    setShowAssignForm(true)
    setActiveSection('assignments')
  }

  async function saveAssignment(event) {
    event.preventDefault()
    setAssignError('')
    setAssignMessage('')

    if (!assignVehicleId || !assignDriverId) {
      setAssignError('Please select both a vehicle and a driver.')
      return
    }

    setSavingAssignment(true)

    try {
      const response = await fetch(
        `${API}/vehicles/${assignVehicleId}/assign`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            driver_id: Number(assignDriverId),
          }),
        }
      )

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          typeof result.detail === 'string'
            ? result.detail
            : 'Could not assign driver to vehicle.'
        )
      }

      await loadData()
      setAssignMessage('Driver assigned successfully.')
      setShowAssignForm(false)
    } catch (error) {
      setAssignError(error.message || 'Could not connect to the backend.')
    } finally {
      setSavingAssignment(false)
    }
  }

  // Open the Maintenance page and form
  function openAddMaintenance() {
    setMaintenanceForm({ ...emptyMaintenanceForm })
    setMaintenanceError('')
    setMaintenanceMessage('')
    setShowMaintenanceForm(true)
    setActiveSection('maintenance')
  }

  // Save a maintenance record to the existing backend
  async function saveMaintenance(event) {
    event.preventDefault()
    setMaintenanceError('')
    setMaintenanceMessage('')

    if (!maintenanceForm.vehicle_id) {
      setMaintenanceError('Please select a vehicle.')
      return
    }

    if (!maintenanceForm.maintenance_type.trim()) {
      setMaintenanceError('Please enter the maintenance type.')
      return
    }

    if (!maintenanceForm.maintenance_date) {
      setMaintenanceError('Please select the maintenance date and time.')
      return
    }

    if (maintenanceForm.cost === '' || Number(maintenanceForm.cost) < 0) {
      setMaintenanceError('Please enter a valid cost.')
      return
    }

    setSavingMaintenance(true)

    try {
      const response = await fetch(`${API}/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_id: Number(maintenanceForm.vehicle_id),
          maintenance_type: maintenanceForm.maintenance_type.trim(),
          description: maintenanceForm.description.trim(),
          cost: Number(maintenanceForm.cost),
          maintenance_date: new Date(
            maintenanceForm.maintenance_date
          ).toISOString(),
          status: maintenanceForm.status,
        }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          typeof result.detail === 'string'
            ? result.detail
            : 'Could not save maintenance record.'
        )
      }

      await loadData()
      setShowMaintenanceForm(false)
      setMaintenanceForm({ ...emptyMaintenanceForm })
      setMaintenanceMessage('Maintenance record added successfully.')
    } catch (error) {
      setMaintenanceError(
        error.message || 'Could not connect to the backend.'
      )
    } finally {
      setSavingMaintenance(false)
    }
  }

  const monthLabels = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']

  const maintenanceByMonth = monthLabels.map((month, index) => {
    const monthNumber = index + 5

    const records = maintenance.filter((record) => {
      if (!record.maintenance_date) return false
      const date = new Date(record.maintenance_date)

      return date.getFullYear() === 2026
        && date.getMonth() + 1 === monthNumber
    })

    return {
      month,
      completed: records.filter(
        (r) => (r.status || '').toLowerCase() === 'completed'
      ).length,
      pending: records.filter(
        (r) => ['pending', 'scheduled'].includes(
          (r.status || '').toLowerCase()
        )
      ).length,
    }
  })

  
  // Demonstration telemetry matching the supplied dashboard reference.
  // These are sample values, not live vehicle/battery readings from the API.
  const demoFleetStatuses = [
    ...Array(186).fill('operational'),
    ...Array(32).fill('charging'),
    ...Array(20).fill('idle'),
    ...Array(8).fill('maintenance'),
    ...Array(4).fill('critical'),
  ]

  const demoAlerts = [
    { vehicle: 'KA 04 EV 1111', message: 'Coolant pump fault, pack temperature rising', time: '12 min ago' },
    { vehicle: 'KA 08 EV 3257', message: 'Insulation resistance below safe limit', time: '41 min ago' },
    { vehicle: 'KA 04 EV 4774', message: 'Cell voltage imbalance above 120 mV', time: '1 hr ago' },
    { vehicle: 'KA 06 EV 6180', message: 'Pack at 52°C under load', time: '2 hr ago' },
  ]

  return (
    <div className="app">
      <style>{`
        .primary-button,.secondary-button,.danger-button {
          border:0;border-radius:8px;padding:10px 14px;
          font:inherit;font-weight:600;cursor:pointer
        }
        .primary-button {background:#542536;color:white}
        .primary-button:disabled {opacity:.65;cursor:wait}
        .secondary-button {background:#eee8dc;color:#542536}
        .danger-button {background:#f5e1df;color:#963f4a;margin-left:6px}
        .vehicle-form-panel {margin-bottom:20px}
        .vehicle-form {
          display:grid;grid-template-columns:repeat(2,minmax(0,1fr));
          gap:16px;padding-top:12px
        }
        .vehicle-form label {
          display:flex;flex-direction:column;gap:7px;
          color:#334155;font-size:13px;font-weight:600
        }
        .vehicle-form input,.vehicle-form select,.vehicle-form textarea {
          width:100%;min-width:0;box-sizing:border-box;padding:11px 12px;
          border:1px solid #cbd5e1;border-radius:8px;
          background:white;color:#0f172a;font:inherit
        }
        .vehicle-form textarea {
          min-height:85px;resize:vertical
        }
        .vehicle-form-actions {
          grid-column:1/-1;display:flex;align-items:center;gap:12px;
          flex-wrap:wrap
        }
        .form-hint {color:#64748b;font-size:12px}
        .vehicle-actions {white-space:nowrap}
        .success-message {
          padding:10px 12px;border-radius:8px;
          background:#dcfce7;color:#166534
        }
        .error-message {
          padding:10px 12px;border-radius:8px;
          background:#fee2e2;color:#991b1b
        }
        @media(max-width:650px) {
          .vehicle-form {grid-template-columns:1fr}
        }
      `}</style>

      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">ϟ</span>
          <div>
            <h2>EV FASTFLEET</h2>
            <small>INTELLIGENT OPERATIONS</small>
          </div>
        </div>

        <nav>
          <a
            className={activeSection === 'dashboard' ? 'active' : ''}
            href="#dashboard"
            onClick={() => setActiveSection('dashboard')}
          >
            ▦ Dashboard
          </a>
          <a
            className={activeSection === 'vehicles' ? 'active' : ''}
            href="#vehicle-management"
            onClick={() => {
              setActiveSection('vehicles')
              setVehicleMessage('')
              setVehicleError('')
            }}
          >
            ▣ Vehicles
          </a>
          <a
            className={activeSection === 'drivers' ? 'active' : ''}
            href="#driver-management"
            onClick={() => {
              setActiveSection('drivers')
              setDriverMessage('')
              setDriverError('')
            }}
          >
            ♟ Drivers
          </a>
          <a
            className={activeSection === 'assignments' ? 'active' : ''}
            href="#assignments"
            onClick={() => setActiveSection('assignments')}
          >
            🔗 Assignments
          </a>
          <a
            className={activeSection === 'maintenance' ? 'active' : ''}
            href="#maintenance"
            onClick={() => {
              setActiveSection('maintenance')
              setMaintenanceMessage('')
              setMaintenanceError('')
            }}
          >
            🔧 Maintenance
          </a>
          <a
            className={activeSection === 'battery' ? 'active' : ''}
            href="#battery-intelligence"
            onClick={() => setActiveSection('battery')}
          >
            🔋 Battery Intelligence
          </a>
          <a
            className={activeSection === 'charging' ? 'active' : ''}
            href="#charging-operations"
            onClick={() => setActiveSection('charging')}
          >
            ⚡ Charging Operations
          </a>
          <a
            href="#reports"
            onClick={() => setActiveSection('dashboard')}
          >
            ▥ Reports
          </a>
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
          <div className="topbar-brand">
            <strong>EV FASTFLEET</strong>
            <small>Intelligent Operations for Electric Fleets.</small>
          </div>

          <div className="topbar-controls">
            <select className="company-select" defaultValue="Metro Logistics Pvt. Ltd." aria-label="Company">
              <option>Metro Logistics Pvt. Ltd.</option>
            </select>

            <input
              className="search"
              placeholder="⌕  Search registration, vehicle or driver..."
              aria-label="Search registration, vehicle or driver"
            />

            <div className="time-filters" aria-label="Dashboard time range">
              <button type="button">24H</button>
              <button type="button">7D</button>
              <button type="button" className="selected">30D</button>
              <button type="button">90D</button>
            </div>

            <button className="notification-button" type="button" aria-label="Notifications">
              ♧ <sup>{pendingMaintenance}</sup>
            </button>
            <span className="avatar" title="Fleet administrator">AR</span>
          </div>
        </header>

        {activeSection === 'dashboard' && (
          <section className="content fleet-dashboard" id="dashboard">
            {errors.map((error) => (
              <p role="alert" className="error-message" key={error}>{error}</p>
            ))}

            <div className="dashboard-breadcrumb">01 / FLEET COMMAND</div>

            <div className="fleet-title-row">
              <div>
                <h1>Fleet command dashboard</h1>
                <p>Your fleet at a glance, with operational intelligence.</p>
              </div>
              <div className="demo-label">
                <span>DEMONSTRATION DATA</span>
                <small>DEMO FLEET · 250 EVs · 6 DEPOTS</small>
              </div>
            </div>

            <div className="fleet-dashboard-grid">
              <section className="panel fleet-overview">
                <div className="section-topline">
                  <span>FLEET OVERVIEW</span>
                  <span className="outline-label">ILLUSTRATIVE TELEMETRY</span>
                </div>

                <div className="operational-summary">
                  <div className="operational-number">186</div>
                  <div className="operational-description">
                    <h2>Operational <i>EVs</i></h2>
                    <p>74.4% of the fleet in service</p>
                    <small>▲ 3.2 pts vs previous period</small>
                  </div>
                  <div className="total-fleet">
                    <span>TOTAL FLEET</span>
                    <strong>250</strong>
                    <small>▲ 6 vehicles (+2.5%)</small>
                  </div>
                </div>

                <div className="vehicle-square-grid" aria-label="Illustrative status grid of 250 vehicles">
                  {demoFleetStatuses.map((status, index) => (
                    <div
                      key={index}
                      className={`vehicle-square ${status}`}
                      title={`Demo vehicle ${index + 1}: ${status}`}
                    />
                  ))}
                </div>

                <div className="fleet-legend">
                  <span><i className="legend-square operational" /> Operational 186</span>
                  <span><i className="legend-square charging" /> Charging 32</span>
                  <span><i className="legend-square idle" /> Idle 20</span>
                  <span><i className="legend-square maintenance" /> Maintenance 8</span>
                  <span><i className="legend-square critical" /> Critical alert 4</span>
                </div>

                <p className="grid-note">Each square represents one demo vehicle · Red outline indicates a critical alert.</p>

                <div className="fleet-bottom-stats">
                  <div><strong>{loading ? '…' : vehicles.length}</strong><span>Registered vehicles</span></div>
                  <div><strong>{loading ? '…' : drivers.length}</strong><span>Registered drivers</span></div>
                  <div><strong>{loading ? '…' : maintenance.length}</strong><span>Maintenance records</span></div>
                </div>
              </section>

              <div className="fleet-right-column">
                <section className="panel critical-panel">
                  <div className="section-topline">
                    <span>CRITICAL ALERTS</span>
                    <small>DEMO TELEMETRY</small>
                  </div>
                  <div className="alert-summary">
                    <strong>4</strong>
                    <span>require action within 24 hours</span>
                  </div>
                  {demoAlerts.map((alert, index) => (
                    <div className="critical-alert" key={index}>
                      <span className="alert-dot" />
                      <div className="alert-message">
                        <strong>{alert.vehicle}</strong>
                        <p>{alert.message}</p>
                      </div>
                      <small>{alert.time}</small>
                    </div>
                  ))}
                </section>

                <section className="panel insights-panel">
                  <div className="section-topline">
                    <span>AI FLEET INSIGHTS</span>
                    <small>ILLUSTRATIVE</small>
                  </div>
                  <ul>
                    <li><strong>KA 04 EV 1111</strong> coolant pump failure likely within 5 days (91% confidence).</li>
                    <li>Shifting 6 night sessions off the 22:00 peak could save about ₹41,000 this month.</li>
                    <li>3W fleet SoH is falling 1.6× faster than the 2W fleet; review the fast-charge share.</li>
                  </ul>
                  <p className="illustrative-note">Illustrative insights for demonstration only; not generated by a live prediction model.</p>
                </section>
              </div>
            </div>

            <div className="tables-grid dashboard-data-tables">
              <section className="panel table-panel">
                <div className="panel-heading">
                  <h3>Recent Vehicles</h3>
                  <a href="#vehicle-management" onClick={() => setActiveSection('vehicles')}>View All →</a>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead><tr><th>Vehicle No.</th><th>Model</th><th>Status</th><th>Driver</th></tr></thead>
                    <tbody>
                      {vehicles.slice(0, 5).map((vehicle) => (
                        <tr key={vehicle.id}>
                          <td>{vehicle.vehicle_number}</td>
                          <td>{vehicle.model}</td>
                          <td><span className={`badge ${(vehicle.status || '').toLowerCase()}`}>{vehicle.status || 'Unknown'}</span></td>
                          <td>{vehicle.driver || '—'}</td>
                        </tr>
                      ))}
                      {loading && <tr><td colSpan="4">Loading vehicles…</td></tr>}
                      {!loading && vehicles.length === 0 && <tr><td colSpan="4">No vehicles found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="panel table-panel">
                <div className="panel-heading">
                  <h3>Upcoming Maintenance</h3>
                  <a href="#maintenance" onClick={() => setActiveSection('maintenance')}>View All →</a>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead><tr><th>Vehicle</th><th>Maintenance</th><th>Date</th><th>Status</th></tr></thead>
                    <tbody>
                      {maintenance.slice(0, 5).map((record) => (
                        <tr key={record.id}>
                          <td>{getVehicleNumber(record)}</td>
                          <td>{record.maintenance_type || '—'}</td>
                          <td>{getDate(record.maintenance_date)}</td>
                          <td>{record.status || 'Unknown'}</td>
                        </tr>
                      ))}
                      {loading && <tr><td colSpan="4">Loading maintenance…</td></tr>}
                      {!loading && maintenance.length === 0 && <tr><td colSpan="4">No maintenance records found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <div className="dashboard-quick-actions">
              <button type="button" onClick={openAddVehicle}>+ Add Vehicle</button>
              <button type="button" onClick={openAddDriver}>+ Add Driver</button>
              <button type="button" onClick={openAddMaintenance}>+ Add Maintenance</button>
              <button type="button" onClick={openAssignForm}>+ Assign Driver</button>
            </div>
          </section>
        )}

        {activeSection === 'vehicles' && (
          <section className="content" id="vehicle-management">
            <div className="page-heading">
              <div>
                <h1>Vehicle Management</h1>
                <p>Add, update, view, and remove vehicles in your fleet.</p>
              </div>
              <button className="primary-button" onClick={openAddVehicle}>
                + Add Vehicle
              </button>
            </div>

            {vehicleMessage && (
              <p role="status" className="success-message">{vehicleMessage}</p>
            )}
            {vehicleError && (
              <p role="alert" className="error-message">{vehicleError}</p>
            )}

            {showVehicleForm && (
              <section className="panel vehicle-form-panel">
                <div className="panel-heading">
                  <h3>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => {
                      setShowVehicleForm(false)
                      setVehicleError('')
                    }}
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={saveVehicle} className="vehicle-form">
                  <label>
                    Vehicle Number *
                    <input
                      value={vehicleForm.vehicle_number}
                      maxLength={20}
                      required
                      placeholder="e.g. KA05CD5678"
                      onChange={(event) => setVehicleForm({
                        ...vehicleForm,
                        vehicle_number: event.target.value,
                      })}
                    />
                  </label>

                  <label>
                    Model *
                    <input
                      value={vehicleForm.model}
                      maxLength={100}
                      required
                      placeholder="e.g. Ashok Leyland"
                      onChange={(event) => setVehicleForm({
                        ...vehicleForm,
                        model: event.target.value,
                      })}
                    />
                  </label>

                  <label>
                    Vehicle Type
                    <select
                      value={vehicleForm.vehicle_type}
                      onChange={(event) => setVehicleForm({
                        ...vehicleForm,
                        vehicle_type: event.target.value,
                      })}
                    >
                      <option value="Truck">Truck</option>
                      <option value="Van">Van</option>
                      <option value="Car">Car</option>
                      <option value="Bus">Bus</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>

                  <label>
                    Status
                    <select
                      value={vehicleForm.status}
                      onChange={(event) => setVehicleForm({
                        ...vehicleForm,
                        status: event.target.value,
                      })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </label>

                  <div className="vehicle-form-actions">
                    <button className="primary-button" type="submit" disabled={savingVehicle}>
                      {savingVehicle ? 'Saving…' : editingVehicle ? 'Save Changes' : 'Add Vehicle'}
                    </button>
                    <span className="form-hint">* Required fields</span>
                  </div>
                </form>
              </section>
            )}

            <section className="panel table-panel">
              <div className="panel-heading">
                <h3>All Vehicles ({vehicles.length})</h3>
                <button className="secondary-button" onClick={loadData}>
                  Refresh
                </button>
              </div>

              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Vehicle No.</th><th>Model</th><th>Type</th>
                      <th>Status</th><th>Driver</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id}>
                        <td>{vehicle.vehicle_number}</td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.vehicle_type || '—'}</td>
                        <td>
                          <span className={`badge ${(vehicle.status || '').toLowerCase()}`}>
                            {vehicle.status || 'Unknown'}
                          </span>
                        </td>
                        <td>{vehicle.driver || '—'}</td>
                        <td className="vehicle-actions">
                          <button
                            className="secondary-button"
                            onClick={() => openEditVehicle(vehicle)}
                          >
                            Edit
                          </button>
                          <button
                            className="danger-button"
                            onClick={() => deleteVehicle(vehicle)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {loading && (
                      <tr><td colSpan="6">Loading vehicles…</td></tr>
                    )}
                    {!loading && vehicles.length === 0 && (
                      <tr><td colSpan="6">No vehicles found. Click “Add Vehicle” to register one.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        )}

        {activeSection === 'drivers' && (
          <section className="content" id="driver-management">
            <div className="page-heading">
              <div>
                <h1>Driver Management</h1>
                <p>Add, update and manage your fleet drivers.</p>
              </div>
              <button className="primary-button" onClick={openAddDriver}>
                + Add Driver
              </button>
            </div>

            {driverMessage && (
              <p role="status" className="success-message">{driverMessage}</p>
            )}
            {driverError && (
              <p role="alert" className="error-message">{driverError}</p>
            )}

            {showDriverForm && (
              <section className="panel vehicle-form-panel">
                <div className="panel-heading">
                  <h3>{editingDriver ? 'Edit Driver' : 'Add New Driver'}</h3>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => setShowDriverForm(false)}
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={saveDriver} className="vehicle-form">
                  <label>
                    Driver Name *
                    <input
                      required
                      maxLength={100}
                      value={driverForm.name}
                      placeholder="Enter driver name"
                      onChange={(event) => setDriverForm({
                        ...driverForm, name: event.target.value,
                      })}
                    />
                  </label>

                  <label>
                    Phone Number *
                    <input
                      required
                      maxLength={15}
                      value={driverForm.phone}
                      placeholder="Enter phone number"
                      onChange={(event) => setDriverForm({
                        ...driverForm, phone: event.target.value,
                      })}
                    />
                  </label>

                  <label>
                    License Number *
                    <input
                      required
                      maxLength={30}
                      value={driverForm.license_number}
                      placeholder="Enter license number"
                      onChange={(event) => setDriverForm({
                        ...driverForm, license_number: event.target.value,
                      })}
                    />
                  </label>

                  <label>
                    Status
                    <select
                      value={driverForm.status}
                      onChange={(event) => setDriverForm({
                        ...driverForm, status: event.target.value,
                      })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </label>

                  <div className="vehicle-form-actions">
                    <button
                      className="primary-button"
                      type="submit"
                      disabled={savingDriver}
                    >
                      {savingDriver
                        ? 'Saving…'
                        : editingDriver ? 'Save Changes' : 'Add Driver'}
                    </button>
                    <span className="form-hint">* Required fields</span>
                  </div>
                </form>
              </section>
            )}

            <section className="panel table-panel">
              <div className="panel-heading">
                <h3>All Drivers ({drivers.length})</h3>
                <button className="secondary-button" onClick={loadData}>
                  Refresh
                </button>
              </div>

              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th><th>Phone</th><th>License Number</th>
                      <th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map((driver) => (
                      <tr key={driver.id}>
                        <td>{driver.name}</td>
                        <td>{driver.phone}</td>
                        <td>{driver.license_number}</td>
                        <td>
                          <span className={`badge ${(driver.status || '').toLowerCase()}`}>
                            {driver.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="vehicle-actions">
                          <button
                            className="secondary-button"
                            onClick={() => openEditDriver(driver)}
                          >
                            Edit
                          </button>
                          <button
                            className="danger-button"
                            onClick={() => deleteDriver(driver)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {loading && (
                      <tr><td colSpan="5">Loading drivers…</td></tr>
                    )}
                    {!loading && drivers.length === 0 && (
                      <tr><td colSpan="5">No drivers found. Add your first driver.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        )}

        {activeSection === 'assignments' && (
          <section className="content" id="assignments">
            <div className="page-heading">
              <div>
                <h1>Driver Assignments</h1>
                <p>Assign an available driver to a vehicle.</p>
              </div>
              <button className="primary-button" onClick={openAssignForm}>
                + Assign Driver
              </button>
            </div>

            {assignMessage && (
              <p role="status" className="success-message">{assignMessage}</p>
            )}
            {assignError && (
              <p role="alert" className="error-message">{assignError}</p>
            )}

            {showAssignForm && (
              <section className="panel vehicle-form-panel">
                <div className="panel-heading">
                  <h3>Assign Driver to Vehicle</h3>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => setShowAssignForm(false)}
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={saveAssignment} className="vehicle-form">
                  <label>
                    Vehicle *
                    <select
                      required
                      value={assignVehicleId}
                      onChange={(event) => setAssignVehicleId(event.target.value)}
                    >
                      <option value="">Select a vehicle</option>
                      {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.vehicle_number} — {vehicle.model}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Active Driver *
                    <select
                      required
                      value={assignDriverId}
                      onChange={(event) => setAssignDriverId(event.target.value)}
                    >
                      <option value="">Select a driver</option>
                      {drivers
                        .filter((driver) =>
                          (driver.status || '').toLowerCase() === 'active'
                        )
                        .map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name} — {driver.license_number}
                          </option>
                        ))}
                    </select>
                  </label>

                  <div className="vehicle-form-actions">
                    <button
                      className="primary-button"
                      type="submit"
                      disabled={savingAssignment}
                    >
                      {savingAssignment ? 'Assigning…' : 'Confirm Assignment'}
                    </button>
                  </div>
                </form>
              </section>
            )}

            <section className="panel table-panel">
              <div className="panel-heading">
                <h3>Current Vehicle Assignments</h3>
                <button className="secondary-button" onClick={loadData}>
                  Refresh
                </button>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Vehicle Number</th><th>Model</th>
                      <th>Assigned Driver</th><th>Vehicle Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id}>
                        <td>{vehicle.vehicle_number}</td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.driver || 'Unassigned'}</td>
                        <td>{vehicle.status || 'Unknown'}</td>
                      </tr>
                    ))}
                    {!loading && vehicles.length === 0 && (
                      <tr><td colSpan="4">No vehicles found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        )}

        {/* Maintenance Management */}
        {activeSection === 'maintenance' && (
          <section className="content" id="maintenance">
            <div className="page-heading">
              <div>
                <h1>Maintenance Management</h1>
                <p>Schedule, track and manage vehicle maintenance records.</p>
              </div>
              <button
                className="primary-button"
                onClick={openAddMaintenance}
              >
                + Add Maintenance
              </button>
            </div>

            {maintenanceMessage && (
              <p role="status" className="success-message">
                {maintenanceMessage}
              </p>
            )}

            {maintenanceError && (
              <p role="alert" className="error-message">
                {maintenanceError}
              </p>
            )}

            {showMaintenanceForm && (
              <section className="panel vehicle-form-panel">
                <div className="panel-heading">
                  <h3>Add Maintenance Record</h3>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => {
                      setShowMaintenanceForm(false)
                      setMaintenanceError('')
                    }}
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={saveMaintenance} className="vehicle-form">
                  <label>
                    Vehicle *
                    <select
                      required
                      value={maintenanceForm.vehicle_id}
                      onChange={(event) => setMaintenanceForm({
                        ...maintenanceForm,
                        vehicle_id: event.target.value,
                      })}
                    >
                      <option value="">Select a vehicle</option>
                      {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.vehicle_number} — {vehicle.model}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Maintenance Type *
                    <input
                      required
                      maxLength={100}
                      placeholder="e.g. Oil Change"
                      value={maintenanceForm.maintenance_type}
                      onChange={(event) => setMaintenanceForm({
                        ...maintenanceForm,
                        maintenance_type: event.target.value,
                      })}
                    />
                  </label>

                  <label>
                    Description
                    <textarea
                      placeholder="Describe the maintenance work"
                      value={maintenanceForm.description}
                      onChange={(event) => setMaintenanceForm({
                        ...maintenanceForm,
                        description: event.target.value,
                      })}
                    />
                  </label>

                  <label>
                    Cost (₹) *
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 1500"
                      value={maintenanceForm.cost}
                      onChange={(event) => setMaintenanceForm({
                        ...maintenanceForm,
                        cost: event.target.value,
                      })}
                    />
                  </label>

                  <label>
                    Maintenance Date and Time *
                    <input
                      required
                      type="datetime-local"
                      value={maintenanceForm.maintenance_date}
                      onChange={(event) => setMaintenanceForm({
                        ...maintenanceForm,
                        maintenance_date: event.target.value,
                      })}
                    />
                  </label>

                  <label>
                    Status
                    <select
                      value={maintenanceForm.status}
                      onChange={(event) => setMaintenanceForm({
                        ...maintenanceForm,
                        status: event.target.value,
                      })}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </label>

                  <div className="vehicle-form-actions">
                    <button
                      className="primary-button"
                      type="submit"
                      disabled={savingMaintenance}
                    >
                      {savingMaintenance ? 'Saving…' : 'Save Maintenance'}
                    </button>
                    <span className="form-hint">* Required fields</span>
                  </div>
                </form>
              </section>
            )}

            <section className="panel table-panel">
              <div className="panel-heading">
                <h3>All Maintenance Records ({maintenance.length})</h3>
                <button className="secondary-button" onClick={loadData}>
                  Refresh
                </button>
              </div>

              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Vehicle No.</th>
                      <th>Maintenance Type</th>
                      <th>Description</th>
                      <th>Cost</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenance.map((record) => (
                      <tr key={record.id}>
                        <td>{getVehicleNumber(record)}</td>
                        <td>{record.maintenance_type || '—'}</td>
                        <td>{record.description || '—'}</td>
                        <td>
                          {record.cost != null
                            ? `₹${Number(record.cost).toLocaleString('en-IN')}`
                            : '—'}
                        </td>
                        <td>{getDate(record.maintenance_date)}</td>
                        <td>
                          <span className={`badge ${(record.status || '').toLowerCase()}`}>
                            {record.status || 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {loading && (
                      <tr>
                        <td colSpan="6">Loading maintenance records…</td>
                      </tr>
                    )}

                    {!loading && maintenance.length === 0 && (
                      <tr>
                        <td colSpan="6">
                          No maintenance records found. Click “Add Maintenance” to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        )}
        {/* Battery Intelligence page */}
        {activeSection === 'battery' && <BatteryIntelligence />}

        {/* Charging Operations page */}
        {activeSection === 'charging' && <ChargingOperations />}

      </main>
    </div>
  )
}




export default App
 