
import { useEffect, useState } from "react";

import {
  Activity,
  BatteryCharging,
  Bell,
  BarChart3,
  ChevronDown,
  MapPin,
  Menu,
  Search,
  Wrench,
  Zap,
  X,
} from "lucide-react";

import "./App.css";

import Dashboard from "./pages/Dashboard";
import FleetMap from "./pages/FleetMap";
import BatteryIntelligence from "./pages/BatteryIntelligence";
import ChargingOperations from "./pages/ChargingOperations";
import EnergyPerformance from "./pages/EnergyPerformance";
import MaintenanceRisk from "./pages/MaintenanceRisk";
import FleetUtilisation from "./pages/FleetUtilisation";
import RecentOperations from "./pages/RecentOperations";

const API = "/api";

function App() {
  const [page, setPage] = useState("dashboard");
  const [vehicles, setVehicles] = useState([]);
  const [, setDrivers] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [apiStatus, setApiStatus] = useState("loading");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [search, setSearch] = useState("");
  const [mapSearch, setMapSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [range, setRange] = useState("30D");
  const [mobileMenu, setMobileMenu] = useState(false);

  async function loadData() {
    try {
      const [v, d, m] = await Promise.all([
        fetch(`${API}/vehicles`).then(r => {
          if (!r.ok) throw new Error("Vehicles API");
          return r.json();
        }),
        fetch(`${API}/drivers`).then(r => {
          if (!r.ok) throw new Error("Drivers API");
          return r.json();
        }),
        fetch(`${API}/maintenance`).then(r => {
          if (!r.ok) throw new Error("Maintenance API");
          return r.json();
        }),
      ]);

      setVehicles(Array.isArray(v) ? v : []);
      setDrivers(Array.isArray(d) ? d : []);
      setMaintenance(Array.isArray(m) ? m : []);
      setApiStatus("connected");
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Backend connection error:", error);
      setApiStatus("offline");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Backend data is loaded asynchronously.
    loadData();
  }, []);

  const activeCount = vehicles.filter(
    v => (v.status || "").toLowerCase() === "active"
  ).length;

  const pendingCount = maintenance.filter(
    m => (m.status || "Pending").toLowerCase() !== "completed"
  ).length;

  const totalCost = maintenance.reduce(
    (sum, m) => sum + (Number(m.cost) || 0),
    0
  );

  const visibleVehicles = vehicles.filter(v =>
    `${v.vehicle_number || ""} ${v.model || ""} ${v.driver || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const formatDate = lastUpdated.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="ff-app">
      <aside className={`ff-sidebar ${mobileMenu ? "open" : ""}`}>
        <div className="ff-brand">
          <div className="ff-brand-mark">
            <Zap size={21} />
          </div>

          <div>
            <strong>EV FASTFLEET</strong>
            <span>INTELLIGENT OPERATIONS</span>
          </div>

          <button
            className="ff-close-menu"
            onClick={() => setMobileMenu(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="ff-nav-label">WORKSPACE</div>

        <button
          className={`ff-nav-item ${page === "dashboard" ? "active" : ""}`}
          onClick={() => {
            setPage("dashboard");
            setMobileMenu(false);
          }}
        >
          <Activity size={17} /> Dashboard
        </button>

        <button
          className={`ff-nav-item ${page === "map" ? "active" : ""}`}
          onClick={() => {
            setPage("map");
            setMobileMenu(false);
          }}
        >
          <MapPin size={17} /> Fleet Map
          <span className="ff-map-tag">MAP</span>
        </button>

        <button
          className={`ff-nav-item ${page === "battery" ? "active" : ""}`}
          onClick={() => {
            setPage("battery");
            setMobileMenu(false);
          }}
        >
          <BatteryCharging size={17} /> Battery Intelligence
        </button>

        <button
          className={`ff-nav-item ${page === "charging" ? "active" : ""}`}
          onClick={() => {
            setPage("charging");
            setMobileMenu(false);
          }}
        >
          <Zap size={17} /> Charging Operations
        </button>

        <button
          className={`ff-nav-item ${page === "energy" ? "active" : ""}`}
          onClick={() => {
            setPage("energy");
            setMobileMenu(false);
          }}
        >
          <Activity size={17} /> Energy Performance
        </button>

        <button
          className={`ff-nav-item ${page === "maintenance" ? "active" : ""}`}
          onClick={() => {
            setPage("maintenance");
            setMobileMenu(false);
          }}
        >
          <Wrench size={17} /> Maintenance & Risk
        </button>

        <button
          className={`ff-nav-item ${page === "utilisation" ? "active" : ""}`}
          onClick={() => {
            setPage("utilisation");
            setMobileMenu(false);
          }}
        >
          <BarChart3 size={17} /> Fleet Utilisation
        </button>

        <button
          className={`ff-nav-item ${page === "operations" ? "active" : ""}`}
          onClick={() => {
            setPage("operations");
            setMobileMenu(false);
          }}
        >
          <Activity size={17} /> Recent Operations
        </button>

        <div className="ff-sidebar-bottom">
          <div className="ff-help">
            <span className="ff-help-icon">?</span>
            <div>
              <b>Need a hand?</b>
              <small>Fleet workspace</small>
            </div>
          </div>

          <div className="ff-user">
            <div className="ff-avatar">G</div>
            <div>
              <b>Fleet Admin</b>
              <small>Administrator</small>
            </div>
            <ChevronDown size={14} />
          </div>

          <small className="ff-workspace-foot">
            EV FASTFLEET · WORKSPACE
          </small>
        </div>
      </aside>

      <main className="ff-main">
        <header className="ff-topbar">
          <button
            className="ff-menu-button"
            onClick={() => setMobileMenu(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>

          <div className="ff-mobile-title">EV FASTFLEET</div>

          <div className="ff-top-title">
            <strong>EV FASTFLEET</strong>
            <span>Intelligent Operations for Electric Fleets.</span>
          </div>

          <div className="ff-top-actions">
            <div className="ff-company">
              Metro Logistics Pvt. Ltd. <ChevronDown size={14} />
            </div>

            <label className="ff-search">
              <Search size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search registration, vehicle or driver..."
              />
            </label>

            <div className="ff-ranges">
              {["24H", "7D", "30D", "90D"].map(r => (
                <button
                  key={r}
                  className={range === r ? "selected" : ""}
                  onClick={() => setRange(r)}
                >
                  {r}
                </button>
              ))}
            </div>

            <button className="ff-icon-button" aria-label="Notifications">
              <Bell size={18} />
              <i>4</i>
            </button>

            <div className="ff-profile">AR</div>
          </div>
        </header>

        {page === "dashboard" ? (
          <Dashboard
            vehicles={vehicles}
            activeCount={activeCount}
            maintenance={maintenance}
            pendingCount={pendingCount}
            totalCost={totalCost}
            visibleVehicles={visibleVehicles}
            apiStatus={apiStatus}
            formatDate={formatDate}
            loadData={loadData}
          />
        ) : page === "map" ? (
          <FleetMap
            vehicles={vehicles}
            filter={filter}
            setFilter={setFilter}
            mapSearch={mapSearch}
            setMapSearch={setMapSearch}
            selected={selected}
            setSelected={setSelected}
            setPage={setPage}
          />
        ) : page === "battery" ? (
          <BatteryIntelligence />
        ) : page === "charging" ? (
          <ChargingOperations />
        ) : page === "energy" ? (
          <EnergyPerformance />
        ) : page === "maintenance" ? (
          <MaintenanceRisk />
        ) : page === "utilisation" ? (
          <FleetUtilisation />
        ) : page === "operations" ? (
          <RecentOperations />
        ) : (
          <MaintenanceRisk />
        )}
      </main>
    </div>
  );
}

export default App;
