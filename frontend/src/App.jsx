
import { useState } from "react";
import "./App.css";

const initialVehicles = [
  { id: "KA 04 EV 1111", type: "Electric Car", status: "Active", battery: 85, component: "Coolant pump", risk: 92, due: "5 days", action: "Replace pump, inspect hoses" },
  { id: "KA 08 EV 3287", type: "Electric Car", status: "Active", battery: 78, component: "HV insulation", risk: 87, due: "7 days", action: "Inspect insulation" },
  { id: "KA 04 EV 4774", type: "Electric Car", status: "Active", battery: 92, component: "Cell group 7", risk: 82, due: "10 days", action: "Balance battery pack" },
  { id: "KA 06 EV 3488", type: "Electric Van", status: "In Service", battery: 65, component: "Charge port", risk: 76, due: "12 days", action: "Inspect connector" },
  { id: "KA 07 EV 7549", type: "Electric Car", status: "Active", battery: 71, component: "Brake pads", risk: 44, due: "3 weeks", action: "Schedule service" },
  { id: "KA 08 EV 8511", type: "Electric Van", status: "Active", battery: 88, component: "12 V battery", risk: 31, due: "4 weeks", action: "Test battery" },
];

const initialDrivers = [
  { id: 1, name: "Arun Kumar", license: "KA-2024-001234", assignedVehicle: "KA 04 EV 1111", status: "Available" },
  { id: 2, name: "Sneha Rao", license: "KA-2023-005678", assignedVehicle: "KA 08 EV 3287", status: "On Trip" },
  { id: 3, name: "Rahul Shetty", license: "KA-2022-009876", assignedVehicle: "KA 04 EV 4774", status: "Available" },
  { id: 4, name: "Ananya Das", license: "KA-2024-004321", assignedVehicle: "Not Assigned", status: "On Leave" },
];

const initialMaintenance = [
  { id: 1, vehicle: "KA 04 EV 1111", type: "Coolant Pump Service", date: "2026-11-15", status: "Scheduled" },
  { id: 2, vehicle: "KA 08 EV 3287", type: "Battery Inspection", date: "2026-11-14", status: "In Progress" },
  { id: 3, vehicle: "KA 04 EV 4774", type: "General Inspection", date: "2026-11-10", status: "Completed" },
];

const alerts = [
  { vehicle: "KA 04 EV 1111", type: "Fault", message: "Coolant pump temperature rising", time: "10 min ago" },
  { vehicle: "KA 08 EV 3287", type: "Fault", message: "Insulation resistance needs inspection", time: "41 min ago" },
  { vehicle: "KA 04 EV 4774", type: "Battery", message: "Cell voltage imbalance detected", time: "1 hr ago" },
  { vehicle: "KA 06 EV 3488", type: "Battery", message: "Battery health needs inspection", time: "3 hr ago" },
  { vehicle: "KA 07 EV 7549", type: "Maintenance", message: "Service is due soon", time: "Yesterday" },
];

const chartData = {
  Daily: [48, 58, 43, 62, 55, 68, 52, 72, 61, 75, 65, 59],
  Weekly: [55, 65, 48, 72, 61, 78, 56, 70, 64, 83, 72, 68],
  Monthly: [62, 55, 70, 66, 78, 60, 73, 84, 67, 76, 88, 72],
};

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [period, setPeriod] = useState("Daily");
  const [filter, setFilter] = useState("All");

  const [vehicleList, setVehicleList] = useState(initialVehicles);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [vehicleStatus, setVehicleStatus] = useState("All");
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    id: "",
    type: "Electric Car",
    status: "Active",
    battery: "100",
  });

  const [driverList, setDriverList] = useState(initialDrivers);
  const [driverSearch, setDriverSearch] = useState("");
  const [driverStatus, setDriverStatus] = useState("All");
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: "",
    license: "",
    assignedVehicle: "Not Assigned",
    status: "Available",
  });

  const [maintenanceList, setMaintenanceList] = useState(initialMaintenance);
  const [maintenanceSearch, setMaintenanceSearch] = useState("");
  const [maintenanceStatus, setMaintenanceStatus] = useState("All");
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [newMaintenance, setNewMaintenance] = useState({
    vehicle: "",
    type: "",
    date: "",
    status: "Scheduled",
  });

  const visibleVehicles = vehicleList.filter((vehicle) => {
    const matchesSearch =
      vehicle.id.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      (vehicle.type || "").toLowerCase().includes(vehicleSearch.toLowerCase());

    const matchesStatus =
      vehicleStatus === "All" ||
      (vehicle.status || "Active") === vehicleStatus;

    return matchesSearch && matchesStatus;
  });

  const visibleDrivers = driverList.filter((driver) => {
    const search = driverSearch.toLowerCase();

    const matchesSearch =
      driver.name.toLowerCase().includes(search) ||
      driver.license.toLowerCase().includes(search) ||
      driver.assignedVehicle.toLowerCase().includes(search);

    const matchesStatus =
      driverStatus === "All" || driver.status === driverStatus;

    return matchesSearch && matchesStatus;
  });

  const visibleMaintenance = maintenanceList.filter((item) => {
    const search = maintenanceSearch.toLowerCase();

    const matchesSearch =
      item.vehicle.toLowerCase().includes(search) ||
      item.type.toLowerCase().includes(search);

    const matchesStatus =
      maintenanceStatus === "All" || item.status === maintenanceStatus;

    return matchesSearch && matchesStatus;
  });

  const visibleAlerts = alerts.filter(
    (alert) => filter === "All" || alert.type === filter
  );

  function handleAddVehicle(event) {
    event.preventDefault();

    const registration = newVehicle.id.trim().toUpperCase();

    if (!registration) return;

    const exists = vehicleList.some(
      (vehicle) => vehicle.id.toUpperCase() === registration
    );

    if (exists) {
      window.alert("This vehicle registration number already exists.");
      return;
    }

    setVehicleList((current) => [
      ...current,
      {
        id: registration,
        type: newVehicle.type,
        status: newVehicle.status,
        battery: Number(newVehicle.battery),
        component: "No issue reported",
        risk: 0,
        due: "Not scheduled",
        action: "No action required",
      },
    ]);

    setNewVehicle({
      id: "",
      type: "Electric Car",
      status: "Active",
      battery: "100",
    });

    setShowVehicleForm(false);
  }

  function handleAddDriver(event) {
    event.preventDefault();

    const name = newDriver.name.trim();
    const license = newDriver.license.trim().toUpperCase();

    if (!name || !license) return;

    const exists = driverList.some(
      (driver) => driver.license.toUpperCase() === license
    );

    if (exists) {
      window.alert("This license number is already registered.");
      return;
    }

    setDriverList((current) => [
      ...current,
      { ...newDriver, id: Date.now(), name, license },
    ]);

    setNewDriver({
      name: "",
      license: "",
      assignedVehicle: "Not Assigned",
      status: "Available",
    });

    setShowDriverForm(false);
  }

  function handleAddMaintenance(event) {
    event.preventDefault();

    if (!newMaintenance.vehicle || !newMaintenance.type || !newMaintenance.date) {
      return;
    }

    setMaintenanceList((current) => [
      ...current,
      { ...newMaintenance, id: Date.now() },
    ]);

    setNewMaintenance({
      vehicle: "",
      type: "",
      date: "",
      status: "Scheduled",
    });

    setShowMaintenanceForm(false);
  }

  return (
    <div className="app">

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">F</div>
          <div>
            <h2>FastFleet</h2>
            <span>FLEET INTELLIGENCE</span>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>

        {["Overview", "Vehicles", "Drivers", "Maintenance", "Analytics"].map(
          (item) => (
            <button
              key={item}
              className={`nav-item ${activePage === item ? "active" : ""}`}
              onClick={() => setActivePage(item)}
            >
              <span>
                {{
                  Overview: "▦",
                  Vehicles: "▣",
                  Drivers: "♙",
                  Maintenance: "⚙",
                  Analytics: "▥",
                }[item]}
              </span>
              {item}
            </button>
          )
        )}

        <div className="sidebar-bottom">
          <div className="profile-avatar">HF</div>
          <div>
            <strong>Fleet Admin</strong>
            <span>Administrator</span>
          </div>
        </div>
      </aside>

      <main className="main">

        {/* Topbar is hidden only on Overview */}
        {activePage !== "Overview" && (
          <header className="topbar">
            <div>
              <p>FLEET MANAGEMENT / {activePage.toUpperCase()}</p>
              <h1>{activePage}</h1>
            </div>

            <div className="top-actions">
              <span className="live-dot">● System Live</span>
              <button className="icon-button" title="Notifications">♧</button>
              <div className="top-avatar">FA</div>
            </div>
          </header>
        )}

        {/* OVERVIEW PAGE */}

        {activePage === "Overview" ? (

          <>

            <section className="section">
              <div className="section-heading">
                <div>
                  <h2>Energy Performance</h2>
                  <p>Consumption, spend and category mix</p>
                </div>
              </div>

              <div className="energy-grid">

                <div className="panel chart-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>ENERGY CONSUMPTION</h3>
                      <p>Vehicle category and energy usage</p>
                    </div>

                    <div className="tabs">
                      {["Daily", "Weekly", "Monthly"].map((item) => (
                        <button
                          key={item}
                          className={period === item ? "selected" : ""}
                          onClick={() => setPeriod(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="chart">
                    <div className="y-labels">
                      <span>6000</span>
                      <span>4500</span>
                      <span>3000</span>
                      <span>1500</span>
                      <span>0</span>
                    </div>

                    <div className="bars">
                      {chartData[period].map((height, index) => (
                        <div className="bar-column" key={index}>
                          <div
                            className="stacked-bar"
                            style={{ height: `${height}%` }}
                          >
                            <div className="bar-bus" />
                            <div className="bar-car" />
                            <div className="bar-truck" />
                            <div className="bar-other" />
                          </div>
                          <span>{index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="legend">
                    <span><i className="teal" />Two-wheeler</span>
                    <span><i className="brown" />Three-wheeler</span>
                    <span><i className="purple" />Car</span>
                    <span><i className="gold" />Van / Bus</span>
                  </div>
                </div>

                <div className="panel category-panel">
                  <h3>ENERGY BY CATEGORY</h3>
                  <p>Share of energy consumption</p>

                  <div className="donut-area">
                    <div className="donut">
                      <div className="donut-hole">Energy<br />Mix</div>
                    </div>
                  </div>

                  {[
                    ["Two-wheeler", "12%", "teal"],
                    ["Three-wheeler", "24%", "brown"],
                    ["Car", "32%", "purple"],
                    ["Van", "20%", "gold"],
                    ["Bus", "12%", "dark"],
                  ].map(([name, value, color]) => (
                    <div className="category-row" key={name}>
                      <span><i className={color} />{name}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>

              </div>

              <div className="kpi-grid">
                <div className="panel kpi">
                  <p>TOTAL DISTANCE</p>
                  <strong>3,562 <small>KM</small></strong>
                  <span>Across all active vehicles</span>
                </div>

                <div className="panel kpi">
                  <p>ENERGY CONSUMED</p>
                  <strong>25,001 <small>KWH</small></strong>
                  <span>Total recorded consumption</span>
                </div>

                <div className="panel kpi">
                  <p>ENERGY COST</p>
                  <strong>₹96,017</strong>
                  <span>Total estimated expenditure</span>
                </div>
              </div>
            </section>

            <section className="section maintenance-section">
              <div className="section-heading">
                <div>
                  <h2>Maintenance and Risk Monitoring</h2>
                  <p>Predictive risk, schedules and fault alerts</p>
                </div>
              </div>

              <div className="maintenance-grid">

                <div className="panel risk-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>PREDICTIVE RISK MONITORING</h3>
                      <p>Vehicle component health and risk scores</p>
                    </div>
                    <span className="small-badge">DEMO MONITORING</span>
                  </div>

                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>VEHICLE</th>
                          <th>COMPONENT</th>
                          <th>RISK</th>
                          <th>DUE</th>
                          <th>RECOMMENDED ACTION</th>
                        </tr>
                      </thead>

                      <tbody>
                        {vehicleList.map((vehicle) => (
                          <tr key={vehicle.id}>
                            <td>{vehicle.id}</td>
                            <td>{vehicle.component}</td>
                            <td>
                              <div className="risk-value">
                                <div className="risk-track">
                                  <div
                                    className={`risk-fill ${vehicle.risk >= 75 ? "high" : "low"}`}
                                    style={{ width: `${vehicle.risk}%` }}
                                  />
                                </div>
                                {vehicle.risk}
                              </div>
                            </td>
                            <td>{vehicle.due}</td>
                            <td>{vehicle.action}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h3 className="subheading">RECENT MAINTENANCE RECORDS</h3>

                  {maintenanceList.slice(0, 3).map((item) => (
                    <div className="alert-item" key={item.id}>
                      <div>
                        <strong>{item.vehicle} · {item.type}</strong>
                        <p>{item.date} · {item.status}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="panel alerts-panel">
                  <h3>MAINTENANCE STATUS</h3>

                  <div className="status-grid">
                    <div><strong>{vehicleList.length}</strong><span>Vehicles</span></div>
                    <div><strong>{driverList.length}</strong><span>Drivers</span></div>
                    <div><strong>{maintenanceList.length}</strong><span>Records</span></div>
                    <div>
                      <strong>{maintenanceList.filter((m) => m.status === "Scheduled").length}</strong>
                      <span>Scheduled</span>
                    </div>
                    <div>
                      <strong className="danger">
                        {vehicleList.filter((v) => v.risk >= 75).length}
                      </strong>
                      <span>High Risk</span>
                    </div>
                  </div>

                  <h3 className="subheading">SERVICE SCHEDULE</h3>

                  <div className="schedule-chart">
                    {[55, 32, 48, 76, 41, 60, 29, 48, 65, 35, 54, 44].map(
                      (height, index) => (
                        <div key={index} style={{ height: `${height}%` }} />
                      )
                    )}
                  </div>

                  <h3 className="subheading">ALERT FEED</h3>

                  <div className="filter-tabs">
                    {["All", "Fault", "Battery", "Maintenance"].map((item) => (
                      <button
                        key={item}
                        className={filter === item ? "filter-active" : ""}
                        onClick={() => setFilter(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div className="alert-list">
                    {visibleAlerts.length ? (
                      visibleAlerts.map((alert, index) => (
                        <div className="alert-item" key={index}>
                          <span className="alert-dot" />
                          <div>
                            <strong>{alert.vehicle} · {alert.type}</strong>
                            <p>{alert.message}</p>
                            <small>{alert.time}</small>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No alerts in this category.</p>
                    )}
                  </div>
                </div>

              </div>
            </section>

            <footer>
              FastFleet · Fleet Maintenance and Operational Analytics
            </footer>
          </>

        ) : activePage === "Vehicles" ? (

          /* VEHICLES PAGE */

          <section className="vehicles-page">
            <div className="vehicles-heading">
              <div>
                <h2>Vehicle Management</h2>
                <p>View, search and manage the vehicles in your fleet.</p>
              </div>

              <button
                className="add-vehicle-button"
                onClick={() => setShowVehicleForm((show) => !show)}
              >
                {showVehicleForm ? "Cancel" : "+ Add Vehicle"}
              </button>
            </div>

            {showVehicleForm && (
              <form className="panel vehicle-form" onSubmit={handleAddVehicle}>
                <h3>Add a New Vehicle</h3>

                <div className="vehicle-form-grid">
                  <label>
                    Registration Number
                    <input
                      type="text"
                      placeholder="e.g. KA 05 EV 1234"
                      value={newVehicle.id}
                      onChange={(event) =>
                        setNewVehicle({ ...newVehicle, id: event.target.value })
                      }
                      required
                    />
                  </label>

                  <label>
                    Vehicle Type
                    <select
                      value={newVehicle.type}
                      onChange={(event) =>
                        setNewVehicle({ ...newVehicle, type: event.target.value })
                      }
                    >
                      <option>Electric Car</option>
                      <option>Two-wheeler</option>
                      <option>Three-wheeler</option>
                      <option>Van</option>
                      <option>Bus</option>
                      <option>Truck</option>
                    </select>
                  </label>

                  <label>
                    Status
                    <select
                      value={newVehicle.status}
                      onChange={(event) =>
                        setNewVehicle({ ...newVehicle, status: event.target.value })
                      }
                    >
                      <option>Active</option>
                      <option>In Service</option>
                      <option>Inactive</option>
                    </select>
                  </label>

                  <label>
                    Battery Level (%)
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newVehicle.battery}
                      onChange={(event) =>
                        setNewVehicle({ ...newVehicle, battery: event.target.value })
                      }
                      required
                    />
                  </label>
                </div>

                <button className="add-vehicle-button" type="submit">
                  Save Vehicle
                </button>
              </form>
            )}

            <div className="vehicle-summary-grid">
              <div className="panel vehicle-summary-card">
                <span>Total Vehicles</span>
                <strong>{vehicleList.length}</strong>
              </div>
              <div className="panel vehicle-summary-card">
                <span>Active</span>
                <strong>{vehicleList.filter((v) => v.status === "Active").length}</strong>
              </div>
              <div className="panel vehicle-summary-card">
                <span>In Service</span>
                <strong>{vehicleList.filter((v) => v.status === "In Service").length}</strong>
              </div>
            </div>

            <div className="panel vehicle-list-panel">
              <div className="vehicle-list-toolbar">
                <div>
                  <h3>All Vehicles</h3>
                  <p>{visibleVehicles.length} vehicle(s) shown</p>
                </div>

                <div className="vehicle-controls">
                  <input
                    type="search"
                    placeholder="Search registration or type..."
                    value={vehicleSearch}
                    onChange={(event) => setVehicleSearch(event.target.value)}
                  />

                  <select
                    value={vehicleStatus}
                    onChange={(event) => setVehicleStatus(event.target.value)}
                  >
                    <option>All</option>
                    <option>Active</option>
                    <option>In Service</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="table-scroll">
                <table className="vehicles-table">
                  <thead>
                    <tr>
                      <th>REGISTRATION</th>
                      <th>VEHICLE TYPE</th>
                      <th>STATUS</th>
                      <th>BATTERY</th>
                      <th>RISK SCORE</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleVehicles.length > 0 ? (
                      visibleVehicles.map((vehicle) => (
                        <tr key={vehicle.id}>
                          <td><strong>{vehicle.id}</strong></td>
                          <td>{vehicle.type}</td>
                          <td>
                            <span className={`vehicle-status ${vehicle.status.toLowerCase().replace(" ", "-")}`}>
                              {vehicle.status}
                            </span>
                          </td>
                          <td>{vehicle.battery}%</td>
                          <td>{vehicle.risk}%</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-vehicles">
                          No vehicles match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="vehicle-demo-note">
              Demo note: vehicle entries are currently stored in React state.
              They are not yet saved to PostgreSQL.
            </p>
          </section>

        ) : activePage === "Drivers" ? (

          /* DRIVERS PAGE */

          <section className="drivers-page">
            <div className="drivers-heading">
              <div>
                <h2>Driver Management</h2>
                <p>Manage driver details, assignments and availability.</p>
              </div>

              <button
                className="add-vehicle-button"
                onClick={() => setShowDriverForm((show) => !show)}
              >
                {showDriverForm ? "Close Form" : "+ Add Driver"}
              </button>
            </div>

            {showDriverForm && (
              <form className="panel vehicle-form" onSubmit={handleAddDriver}>
                <h3>Add New Driver</h3>

                <div className="vehicle-form-grid">
                  <label>
                    Driver Name
                    <input
                      type="text"
                      placeholder="Enter driver name"
                      value={newDriver.name}
                      onChange={(event) =>
                        setNewDriver({ ...newDriver, name: event.target.value })
                      }
                      required
                    />
                  </label>

                  <label>
                    Driving License Number
                    <input
                      type="text"
                      placeholder="Enter license number"
                      value={newDriver.license}
                      onChange={(event) =>
                        setNewDriver({ ...newDriver, license: event.target.value })
                      }
                      required
                    />
                  </label>

                  <label>
                    Assigned Vehicle
                    <select
                      value={newDriver.assignedVehicle}
                      onChange={(event) =>
                        setNewDriver({ ...newDriver, assignedVehicle: event.target.value })
                      }
                    >
                      <option>Not Assigned</option>
                      {vehicleList.map((vehicle) => (
                        <option key={vehicle.id}>{vehicle.id}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Availability
                    <select
                      value={newDriver.status}
                      onChange={(event) =>
                        setNewDriver({ ...newDriver, status: event.target.value })
                      }
                    >
                      <option>Available</option>
                      <option>On Trip</option>
                      <option>On Leave</option>
                    </select>
                  </label>
                </div>

                <button className="add-vehicle-button" type="submit">
                  Save Driver
                </button>
              </form>
            )}

            <div className="vehicle-summary-grid">
              <div className="panel vehicle-summary-card">
                <span>Total Drivers</span>
                <strong>{driverList.length}</strong>
              </div>
              <div className="panel vehicle-summary-card">
                <span>Available</span>
                <strong>{driverList.filter((d) => d.status === "Available").length}</strong>
              </div>
              <div className="panel vehicle-summary-card">
                <span>On Trip</span>
                <strong>{driverList.filter((d) => d.status === "On Trip").length}</strong>
              </div>
            </div>

            <div className="panel vehicle-list-panel">
              <div className="vehicle-list-toolbar">
                <div>
                  <h3>All Drivers</h3>
                  <p>{visibleDrivers.length} driver(s) shown</p>
                </div>

                <div className="vehicle-controls">
                  <input
                    type="search"
                    placeholder="Search name, license or vehicle..."
                    value={driverSearch}
                    onChange={(event) => setDriverSearch(event.target.value)}
                  />

                  <select
                    value={driverStatus}
                    onChange={(event) => setDriverStatus(event.target.value)}
                  >
                    <option>All</option>
                    <option>Available</option>
                    <option>On Trip</option>
                    <option>On Leave</option>
                  </select>
                </div>
              </div>

              <div className="table-scroll">
                <table className="vehicles-table">
                  <thead>
                    <tr>
                      <th>DRIVER NAME</th>
                      <th>LICENSE NUMBER</th>
                      <th>ASSIGNED VEHICLE</th>
                      <th>AVAILABILITY</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleDrivers.length > 0 ? (
                      visibleDrivers.map((driver) => (
                        <tr key={driver.id}>
                          <td><strong>{driver.name}</strong></td>
                          <td>{driver.license}</td>
                          <td>{driver.assignedVehicle}</td>
                          <td>
                            <span className={`vehicle-status ${driver.status.toLowerCase().replace(" ", "-")}`}>
                              {driver.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="no-vehicles">
                          No drivers match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="vehicle-demo-note">
              Demo note: driver entries are currently stored in React state.
              They are not yet saved to PostgreSQL.
            </p>
          </section>

        ) : activePage === "Maintenance" ? (

          /* MAINTENANCE PAGE */

          <section className="maintenance-page">
            <div className="vehicles-heading">
              <div>
                <h2>Maintenance Management</h2>
                <p>Schedule and monitor vehicle maintenance activities.</p>
              </div>

              <button
                className="add-vehicle-button"
                onClick={() => setShowMaintenanceForm((show) => !show)}
              >
                {showMaintenanceForm ? "Cancel" : "+ Add Record"}
              </button>
            </div>

            {showMaintenanceForm && (
              <form className="panel vehicle-form" onSubmit={handleAddMaintenance}>
                <h3>Add Maintenance Record</h3>

                <div className="vehicle-form-grid">
                  <label>
                    Vehicle
                    <select
                      value={newMaintenance.vehicle}
                      onChange={(event) =>
                        setNewMaintenance({ ...newMaintenance, vehicle: event.target.value })
                      }
                      required
                    >
                      <option value="">Select Vehicle</option>
                      {vehicleList.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.id}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Maintenance Type
                    <input
                      type="text"
                      placeholder="e.g. Battery Inspection"
                      value={newMaintenance.type}
                      onChange={(event) =>
                        setNewMaintenance({ ...newMaintenance, type: event.target.value })
                      }
                      required
                    />
                  </label>

                  <label>
                    Service Date
                    <input
                      type="date"
                      value={newMaintenance.date}
                      onChange={(event) =>
                        setNewMaintenance({ ...newMaintenance, date: event.target.value })
                      }
                      required
                    />
                  </label>

                  <label>
                    Status
                    <select
                      value={newMaintenance.status}
                      onChange={(event) =>
                        setNewMaintenance({ ...newMaintenance, status: event.target.value })
                      }
                    >
                      <option>Scheduled</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </label>
                </div>

                <button className="add-vehicle-button" type="submit">
                  Save Record
                </button>
              </form>
            )}

            <div className="vehicle-summary-grid">
              <div className="panel vehicle-summary-card">
                <span>Total Records</span>
                <strong>{maintenanceList.length}</strong>
              </div>
              <div className="panel vehicle-summary-card">
                <span>Scheduled</span>
                <strong>{maintenanceList.filter((m) => m.status === "Scheduled").length}</strong>
              </div>
              <div className="panel vehicle-summary-card">
                <span>Completed</span>
                <strong>{maintenanceList.filter((m) => m.status === "Completed").length}</strong>
              </div>
            </div>

            <div className="panel vehicle-list-panel">
              <div className="vehicle-list-toolbar">
                <div>
                  <h3>Maintenance Records</h3>
                  <p>{visibleMaintenance.length} record(s) shown</p>
                </div>

                <div className="vehicle-controls">
                  <input
                    type="search"
                    placeholder="Search vehicle or service..."
                    value={maintenanceSearch}
                    onChange={(event) => setMaintenanceSearch(event.target.value)}
                  />

                  <select
                    value={maintenanceStatus}
                    onChange={(event) => setMaintenanceStatus(event.target.value)}
                  >
                    <option>All</option>
                    <option>Scheduled</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div className="table-scroll">
                <table className="vehicles-table">
                  <thead>
                    <tr>
                      <th>VEHICLE</th>
                      <th>MAINTENANCE TYPE</th>
                      <th>DATE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleMaintenance.length > 0 ? (
                      visibleMaintenance.map((item) => (
                        <tr key={item.id}>
                          <td><strong>{item.vehicle}</strong></td>
                          <td>{item.type}</td>
                          <td>{item.date}</td>
                          <td>
                            <span className={`vehicle-status ${item.status.toLowerCase().replace(" ", "-")}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="no-vehicles">
                          No maintenance records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="vehicle-demo-note">
              Demo note: maintenance records are stored in browser React state.
              They are not yet saved to PostgreSQL.
            </p>
          </section>

        ) : activePage === "Analytics" ? (

          /* ANALYTICS PAGE */

          <section className="analytics-page">

            <div className="analytics-heading">
              <h2>Fleet Analytics</h2>
              <p>Monitor fleet performance and operational insights.</p>
            </div>

            <div className="analytics-summary">

              <div className="panel analytics-card">
                <span>Total Vehicles</span>
                <strong>{vehicleList.length}</strong>
                <small>Registered vehicles</small>
              </div>

              <div className="panel analytics-card">
                <span>Active Vehicles</span>
                <strong>
                  {vehicleList.filter((v) => v.status === "Active").length}
                </strong>
                <small>Currently active</small>
              </div>

              <div className="panel analytics-card">
                <span>Total Drivers</span>
                <strong>{driverList.length}</strong>
                <small>Registered drivers</small>
              </div>

              <div className="panel analytics-card">
                <span>Maintenance Records</span>
                <strong>{maintenanceList.length}</strong>
                <small>Total service records</small>
              </div>

            </div>

            <div className="panel analytics-panel">

              <div className="analytics-panel-heading">
                <div>
                  <h3>Vehicle Risk Analysis</h3>
                  <p>Component risk scores of registered vehicles.</p>
                </div>
              </div>

              <div className="analytics-risk-list">

                {vehicleList.map((vehicle) => {
                  const risk = Math.min(
                    100,
                    Math.max(0, Number(vehicle.risk) || 0)
                  );

                  return (
                    <div className="analytics-risk-item" key={vehicle.id}>
                      <div className="analytics-risk-info">
                        <strong>{vehicle.id}</strong>
                        <span>{risk}% Risk</span>
                      </div>

                      <div className="analytics-risk-track">
                        <div
                          className={`analytics-risk-fill ${
                            risk >= 75 ? "high" : risk >= 40 ? "medium" : "low"
                          }`}
                          style={{ width: `${risk}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>

            <div className="analytics-two-column">

              <div className="panel analytics-panel">
                <h3>Maintenance Overview</h3>
                <p>Current maintenance record status.</p>

                <div className="analytics-status-list">
                  {["Scheduled", "In Progress", "Completed"].map((status) => {
                    const count = maintenanceList.filter(
                      (item) => item.status === status
                    ).length;

                    return (
                      <div className="analytics-status-item" key={status}>
                        <span>{status}</span>
                        <strong>{count}</strong>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="panel analytics-panel">
                <h3>Driver Availability</h3>
                <p>Current driver availability status.</p>

                <div className="analytics-status-list">
                  {["Available", "On Trip", "On Leave"].map((status) => {
                    const count = driverList.filter(
                      (driver) => driver.status === status
                    ).length;

                    return (
                      <div className="analytics-status-item" key={status}>
                        <span>{status}</span>
                        <strong>{count}</strong>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="panel analytics-panel">
              <div className="analytics-panel-heading">
                <div>
                  <h3>Energy Consumption Trend</h3>
                  <p>Monthly energy performance overview.</p>
                </div>
              </div>

              <div className="analytics-energy-chart">
                {chartData.Monthly.map((value, index) => (
                  <div className="analytics-energy-column" key={index}>
                    <div className="analytics-energy-bar-area">
                      <div
                        className="analytics-energy-bar"
                        style={{ height: `${value}%` }}
                      />
                    </div>
                    <span>Month {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="analytics-demo-note">
              Demo note: Analytics currently uses sample data and browser
              React state. It is not connected to live vehicle sensors
              or PostgreSQL yet.
            </p>

          </section>

        ) : (

          <section className="panel page-placeholder">
            <h2>{activePage}</h2>
            <p>Welcome to the {activePage} management page.</p>
          </section>

        )}

      </main>
    </div>
  );
}

export default App;
