import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, BatteryCharging, Bell, Bus, Car, CheckCircle2,
  ChevronDown, Clock3, Crosshair, Gauge, MapPin, Menu, Minus, Plus,
  RefreshCw, Search, ShieldAlert, Truck, Wrench, Zap, X
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import { CircleMarker, MapContainer, TileLayer, Tooltip as MapTooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

const API = "/api";

const demoVehicles = [
  { id: "v1", vehicle_number: "KA 04 EV 1111", model: "Tata Nexon EV", vehicle_type: "Car", status: "Critical alert", driver: "Farhan A.", soc: 18, soh: 91, temperature: 54, speed: 42, odometer: "42,180", route: "R-13", depot: "Whitefield", position: [12.9716, 77.5946], kind: "car" },
  { id: "v2", vehicle_number: "KA 08 EV 3257", model: "Mahindra Treo", vehicle_type: "Three-wheeler", status: "Critical alert", driver: "Rahul", soc: 33, soh: 86, temperature: 52, speed: 0, odometer: "26,596", route: "R-08", depot: "Yelahanka", position: [13.1007, 77.5963], kind: "three" },
  { id: "v3", vehicle_number: "KA 04 EV 4774", model: "Tata Ace EV", vehicle_type: "Van", status: "Critical alert", driver: "Chethana", soc: 47, soh: 88, temperature: 48, speed: 31, odometer: "31,204", route: "R-21", depot: "Peenya", position: [13.0285, 77.5197], kind: "van" },
  { id: "v4", vehicle_number: "KA 06 EV 6180", model: "Mahindra Treo", vehicle_type: "Three-wheeler", status: "Critical alert", driver: "Farhan A.", soc: 33, soh: 86, temperature: 52, speed: 0, odometer: "26,596", route: "R-13", depot: "Whitefield", position: [12.9698, 77.7500], kind: "three" },
  { id: "v5", vehicle_number: "KA 01 EV 2588", model: "Tata Nexon EV", vehicle_type: "Car", status: "Operational", driver: "Chethana", soc: 82, soh: 96, temperature: 34, speed: 38, odometer: "18,420", route: "R-02", depot: "Jayanagar", position: [12.9250, 77.5830], kind: "car" },
  { id: "v6", vehicle_number: "KA 03 EV 8234", model: "Tata Ace EV", vehicle_type: "Van", status: "Charging", driver: "Rahul", soc: 64, soh: 94, temperature: 31, speed: 0, odometer: "12,110", route: "R-05", depot: "Hebbal", position: [13.0358, 77.5970], kind: "van" },
  { id: "v7", vehicle_number: "KA 05 EV 9021", model: "Euler HiLoad", vehicle_type: "Three-wheeler", status: "Idle", driver: "Asha", soc: 71, soh: 92, temperature: 32, speed: 0, odometer: "9,802", route: "R-17", depot: "Koramangala", position: [12.9352, 77.6245], kind: "three" },
  { id: "v8", vehicle_number: "KA 02 EV 4321", model: "Tata Nexon EV", vehicle_type: "Car", status: "Maintenance", driver: "—", soc: 24, soh: 78, temperature: 39, speed: 0, odometer: "51,003", route: "—", depot: "Peenya", position: [13.0100, 77.5400], kind: "car" },
];

const alerts = [
  { vehicle: "KA 04 EV 1111", detail: "Coolant pump fault, pack temperature rising", time: "12 min ago" },
  { vehicle: "KA 08 EV 3257", detail: "Insulation resistance below safe limit", time: "41 min ago" },
  { vehicle: "KA 04 EV 4774", detail: "Cell voltage imbalance above 120 mV", time: "1 hr ago" },
  { vehicle: "KA 06 EV 6180", detail: "Pack at 52 °C under load", time: "2 hr ago" },
];

const trendData = [
  { month: "Jun", value: 0 }, { month: "Jul", value: 0 }, { month: "Aug", value: 0 },
  { month: "Sept", value: 0 }, { month: "Oct", value: 2 }, { month: "Nov", value: 1 },
];

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => { map.setView(center, 11); }, [center, map]);
  return null;
}

function App() {
  const [page, setPage] = useState("dashboard");
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [apiStatus, setApiStatus] = useState("loading");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [search, setSearch] = useState("");
  const [mapSearch, setMapSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(demoVehicles[3]);
  const [range, setRange] = useState("30D");
  const [mobileMenu, setMobileMenu] = useState(false);

  async function loadData() {
    setApiStatus("loading");
    try {
      const [v, d, m] = await Promise.all([
        fetch(`${API}/vehicles`).then(r => { if (!r.ok) throw new Error("Vehicles API"); return r.json(); }),
        fetch(`${API}/drivers`).then(r => { if (!r.ok) throw new Error("Drivers API"); return r.json(); }),
        fetch(`${API}/maintenance`).then(r => { if (!r.ok) throw new Error("Maintenance API"); return r.json(); }),
      ]);
      setVehicles(Array.isArray(v) ? v : []);
      setDrivers(Array.isArray(d) ? d : []);
      setMaintenance(Array.isArray(m) ? m : []);
      setApiStatus("connected");
      setLastUpdated(new Date());
    } catch {
      setApiStatus("offline");
    }
  }

  useEffect(() => { loadData(); }, []);

  const activeCount = vehicles.filter(v => (v.status || "").toLowerCase() === "active").length;
  const pendingCount = maintenance.filter(m => (m.status || "Pending").toLowerCase() !== "completed").length;
  const totalCost = maintenance.reduce((sum, m) => sum + (Number(m.cost) || 0), 0);
  const filteredMapVehicles = useMemo(() => demoVehicles.filter(v => {
    const typeMatch = filter === "ALL" || (filter === "TWO-WHEELERS" ? v.vehicle_type === "Two-wheeler" : filter === "THREE-WHEELERS" ? v.vehicle_type === "Three-wheeler" : v.vehicle_type.toUpperCase() === filter);
    const q = mapSearch.toLowerCase();
    return typeMatch && (!q || `${v.vehicle_number} ${v.model} ${v.driver}`.toLowerCase().includes(q));
  }), [filter, mapSearch]);

  const visibleVehicles = vehicles.filter(v => `${v.vehicle_number || ""} ${v.model || ""} ${v.driver || ""}`.toLowerCase().includes(search.toLowerCase()));
  const statusCounts = [
    { name: "Operational", count: 186, color: "#542638" },
    { name: "Charging", count: 32, color: "#6d8981" },
    { name: "Idle", count: 20, color: "#9baaa5" },
    { name: "Maintenance", count: 8, color: "#b18b64" },
    { name: "Critical alert", count: 4, color: "#853b50" },
  ];
  const formatDate = lastUpdated.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="ff-app">
      <aside className={`ff-sidebar ${mobileMenu ? "open" : ""}`}>
        <div className="ff-brand">
          <div className="ff-brand-mark"><Zap size={21} /></div>
          <div><strong>EV FASTFLEET</strong><span>INTELLIGENT OPERATIONS</span></div>
          <button className="ff-close-menu" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <div className="ff-nav-label">WORKSPACE</div>
        <button className={`ff-nav-item ${page === "dashboard" ? "active" : ""}`} onClick={() => { setPage("dashboard"); setMobileMenu(false); }}>
          <Activity size={17}/> Dashboard
        </button>
        <button className={`ff-nav-item ${page === "map" ? "active" : ""}`} onClick={() => { setPage("map"); setMobileMenu(false); }}>
          <MapPin size={17}/> Fleet Map <span className="ff-map-tag">MAP</span>
        </button>
        <div className="ff-sidebar-bottom">
          <div className="ff-help"><span className="ff-help-icon">?</span><div><b>Need a hand?</b><small>Fleet workspace</small></div></div>
          <div className="ff-user"><div className="ff-avatar">G</div><div><b>Fleet Admin</b><small>Administrator</small></div><ChevronDown size={14}/></div>
          <small className="ff-workspace-foot">EV FASTFLEET · WORKSPACE</small>
        </div>
      </aside>

      <main className="ff-main">
        <header className="ff-topbar">
          <button className="ff-menu-button" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu/></button>
          <div className="ff-mobile-title">EV FASTFLEET</div>
          <div className="ff-top-title"><strong>EV FASTFLEET</strong><span>Intelligent Operations for Electric Fleets.</span></div>
          <div className="ff-top-actions">
            <div className="ff-company">Metro Logistics Pvt. Ltd. <ChevronDown size={14}/></div>
            <label className="ff-search"><Search size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search registration, vehicle or driver..."/></label>
            <div className="ff-ranges">{["24H","7D","30D","90D"].map(r => <button key={r} className={range === r ? "selected" : ""} onClick={() => setRange(r)}>{r}</button>)}</div>
            <button className="ff-icon-button" aria-label="Notifications"><Bell size={18}/><i>4</i></button>
            <div className="ff-profile">AR</div>
          </div>
        </header>

        {page === "dashboard" ? (
          <section className="ff-dashboard">
            <div className="ff-section-heading">
              <div><small>01 / FLEET COMMAND</small><h1>Fleet command dashboard</h1><p>Your fleet at a glance, with operational intelligence.</p></div>
              <div className="ff-demo-meta"><span className="ff-demo-pill">DEMONSTRATION DATA</span><span>DEMO FLEET · 250 EVs · 6 DEPOTS</span></div>
            </div>

            <div className="ff-dashboard-grid">
              <section className="ff-command-card">
                <div className="ff-command-top"><span>FLEET OVERVIEW</span><span className="ff-demo-pill">ILLUSTRATIVE TELEMETRY</span></div>
                <div className="ff-operational-row">
                  <div className="ff-big-number">186</div>
                  <div className="ff-operational-copy"><h2>Operational <em>EVs</em></h2><p>74.4% of the fleet in service</p><small>▲ 3.2 pts vs previous period</small></div>
                  <div className="ff-total"><small>TOTAL FLEET</small><strong>250</strong><span>▲ 6 vehicles (+2.5%)</span></div>
                </div>
                <div className="ff-fleet-squares" aria-label="Fleet status visualisation">
                  {Array.from({ length: 250 }, (_, i) => <span key={i} className={i < 186 ? "operational" : i < 218 ? "charging" : i < 238 ? "idle" : i < 246 ? "maintenance" : "critical"} />)}
                </div>
                <div className="ff-legend">{statusCounts.map(s => <span key={s.name}><i style={{background:s.color}}/>{s.name} <b>{s.count}</b></span>)}</div>
                <p className="ff-square-note">Each square is one vehicle · red outline = critical alert</p>
                <div className="ff-mini-stats">
                  <div><small>CHARGING</small><strong className="sage">32</strong><span>+14.3% vs previous</span><div className="ff-spark sage-line">╱╲╱╲╱</div></div>
                  <div><small>IDLE</small><strong className="muted-green">20</strong><span>−9.1% vs previous</span><div className="ff-spark muted-line">╲╱──╲</div></div>
                  <div><small>MAINTENANCE</small><strong className="ochre">8</strong><span>−11.1% vs previous</span><div className="ff-spark ochre-line">╲──╱─</div></div>
                </div>
              </section>

              <div className="ff-right-stack">
                <section className="ff-alert-card">
                  <div className="ff-card-eyebrow"><span>CRITICAL ALERTS</span><small>▲ 33% VS 3</small></div>
                  <div className="ff-alert-total"><strong>4</strong><span>require action within 24 hours</span></div>
                  <div className="ff-alert-list">{alerts.map(a => <div className="ff-alert-row" key={a.vehicle}><i/><div><b>{a.vehicle}</b><p>{a.detail}</p></div><time>{a.time}</time></div>)}</div>
                </section>
                <section className="ff-insights-card">
                  <div className="ff-card-eyebrow"><span>AI FLEET INSIGHTS</span><small>PREDICTIVE</small></div>
                  <ul>
                    <li><b>KA 04 EV 1111</b> coolant pump failure likely within 5 days (91% confidence).</li>
                    <li>Shifting 6 night sessions off the 22:00 peak could save about ₹41,000 this month.</li>
                    <li>3W fleet SoH is falling 1.6× faster than the 2W fleet; review the fast-charge share.</li>
                  </ul>
                  <small className="ff-demo-disclaimer">Illustrative insights for demonstration only.</small>
                </section>
              </div>
            </div>

            <div className="ff-lower-grid">
              <section className="ff-data-card">
                <div className="ff-card-heading"><div><small>FLEET REGISTER</small><h3>Registered vehicles</h3><p>Live records from your FastAPI backend</p></div><span className="ff-count-pill">{vehicles.length} records</span></div>
                <div className="ff-table-wrap"><table><thead><tr><th>VEHICLE</th><th>MODEL</th><th>DRIVER</th><th>STATUS</th></tr></thead><tbody>
                  {visibleVehicles.slice(0,5).map(v => <tr key={v.id}><td><b>{v.vehicle_number}</b></td><td>{v.model}</td><td>{v.driver || "Unassigned"}</td><td><span className="ff-status">{v.status || "Active"}</span></td></tr>)}
                  {visibleVehicles.length === 0 && <tr><td colSpan="4" className="ff-empty">{vehicles.length ? "No matching vehicles." : "No vehicle records returned by the backend yet."}</td></tr>}
                </tbody></table></div>
              </section>
              <section className="ff-data-card ff-maintenance-card">
                <div className="ff-card-heading"><div><small>SERVICE SCHEDULE</small><h3>Upcoming maintenance</h3><p>Based on saved maintenance records</p></div><Wrench size={19}/></div>
                {maintenance.slice(0,4).map(m => <div className="ff-maint-row" key={m.id}><span><Wrench size={15}/></span><div><b>{m.maintenance_type || "Service"}</b><small>{m.description || "Scheduled maintenance"}</small></div><em>{m.status || "Pending"}</em></div>)}
                {!maintenance.length && <div className="ff-empty-maint">No maintenance records yet.</div>}
                <div className="ff-cost-line"><span>Total recorded maintenance cost</span><b>₹{totalCost.toLocaleString("en-IN")}</b></div>
              </section>
            </div>
            <div className={`ff-connection ${apiStatus}`}><span/>{apiStatus === "connected" ? `Backend connected · Updated ${formatDate}` : apiStatus === "loading" ? "Connecting to FastAPI..." : "Backend unavailable · Showing demo fleet visuals"}<button onClick={loadData}><RefreshCw size={13}/> Refresh data</button></div>
          </section>
        ) : (
          <section className="ff-map-page">
            <div className="ff-map-heading"><div><small>02</small><h1>Live fleet <em>map</em></h1><p>Demonstration locations across Bengaluru. No live GPS is connected.</p></div><div className="ff-demo-pill">DEMO LOCATIONS</div></div>
            <div className="ff-map-toolbar">
              <div className="ff-filter-list">{["ALL","TWO-WHEELERS","THREE-WHEELERS","CARS","VANS","BUSES"].map(f => <button key={f} className={filter===f?"active":""} onClick={() => setFilter(f)}>{f}</button>)}</div>
              <span>{filteredMapVehicles.length} OF 250 VEHICLES SHOWN</span>
              <label className="ff-map-search"><Search size={15}/><input value={mapSearch} onChange={e=>setMapSearch(e.target.value)} placeholder="Find vehicle or driver"/></label>
            </div>
            <div className="ff-map-layout">
              <div className="ff-map-canvas">
                <MapContainer center={[12.9716,77.5946]} zoom={11} scrollWheelZoom={true} zoomControl={false}>
                  <MapRecenter center={[12.9716,77.5946]}/>
                  <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                  {filteredMapVehicles.map(v => <CircleMarker key={v.id} center={v.position} radius={selected.id===v.id?9:6} pathOptions={{color:selected.id===v.id?"#542638":"#f8f4eb",weight:selected.id===v.id?3:2,fillColor:v.status==="Critical alert"?"#542638":v.status==="Charging"?"#6d8981":v.status==="Maintenance"?"#b18b64":"#82988c",fillOpacity:1}} eventHandlers={{click:()=>setSelected(v)}}><MapTooltip>{v.vehicle_number}</MapTooltip></CircleMarker>)}
                </MapContainer>
                <div className="ff-map-controls"><button onClick={()=>document.querySelector(".leaflet-control-zoom-in")?.click()}><Plus size={17}/></button><button onClick={()=>document.querySelector(".leaflet-control-zoom-out")?.click()}><Minus size={17}/></button><button onClick={()=>setSelected(demoVehicles[3])}><Crosshair size={16}/></button></div>
                <div className="ff-map-legend">{["Vehicles","Stations","Geofences","Trail","Operational","Charging","Idle","Maintenance","Critical alert"].map((l,i)=><span key={l} className={i>3?"legend-status":""}>{l}</span>)}</div>
              </div>
              <aside className="ff-selected-panel">
                <small>SELECTED VEHICLE</small><h3>{selected.vehicle_number}</h3><p><b>{selected.model}</b> · {selected.vehicle_type}</p><span className="ff-critical-badge"><i/> {selected.status}</span>
                <div className="ff-soc-label"><small>STATE OF CHARGE</small><strong>{selected.soc}<sup>%</sup></strong><span>· {Math.round(selected.soc*1.12)} km range</span></div>
                <div className="ff-battery-bars">{Array.from({length:10},(_,i)=><i key={i} className={i<Math.round(selected.soc/10)?"filled":""}/>)}</div>
                <div className="ff-vehicle-details">
                  <div><small>DRIVER</small><b>{selected.driver}</b></div><div><small>ROUTE</small><b>{selected.route}</b></div>
                  <div><small>SOH</small><b>{selected.soh}%</b></div><div><small>PACK TEMP</small><b className="temp">{selected.temperature}°C</b></div>
                  <div><small>SPEED</small><b>{selected.speed} km/h</b></div><div><small>ODOMETER</small><b>{selected.odometer}</b></div>
                  <div><small>HOME DEPOT</small><b>{selected.depot}</b></div><div><small>UPDATED</small><b>Demo data</b></div>
                </div>
                <div className="ff-panel-buttons"><button onClick={()=>setPage("dashboard")}>Battery view</button><button onClick={()=>alert("Dispatch actions will be connected in a later module.")}>Dispatch</button></div>
                <p className="ff-map-note">Illustrative vehicle telemetry. Actual BMS/GPS integration is not connected.</p>
              </aside>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
