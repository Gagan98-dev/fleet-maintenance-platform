
import { useState } from "react";
import {
  Wrench, AlertTriangle, CalendarClock, CheckCircle2,
  Activity, Search, Clock3, ArrowUpRight, ShieldCheck,
  CircleAlert, Gauge
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip
} from "recharts";
import "./MaintenanceRisk.css";

const maintenance = [
  { id: "EV-001", vehicle: "Tata Nexon EV", service: "Brake inspection", date: "28 Nov 2026", priority: "High", status: "Upcoming", risk: "Medium" },
  { id: "EV-002", vehicle: "MG ZS EV", service: "Battery cooling check", date: "25 Nov 2026", priority: "Critical", status: "Overdue", risk: "High" },
  { id: "EV-003", vehicle: "Tata Tigor EV", service: "Tyre rotation", date: "30 Nov 2026", priority: "Low", status: "Upcoming", risk: "Low" },
  { id: "EV-004", vehicle: "Hyundai Kona", service: "Motor diagnostics", date: "22 Nov 2026", priority: "Critical", status: "Overdue", risk: "High" },
  { id: "EV-005", vehicle: "Mahindra XUV400", service: "General inspection", date: "03 Dec 2026", priority: "Medium", status: "Scheduled", risk: "Low" },
];

const history = [
  { vehicle: "EV-001", task: "Battery health inspection", date: "18 Nov 2026", technician: "Service Team A", result: "Completed" },
  { vehicle: "EV-003", task: "Tyre pressure check", date: "16 Nov 2026", technician: "Service Team B", result: "Completed" },
  { vehicle: "EV-005", task: "Motor performance test", date: "14 Nov 2026", technician: "Service Team A", result: "Completed" },
];

const trend = [
  { month: "Jun", completed: 12, pending: 5 },
  { month: "Jul", completed: 16, pending: 4 },
  { month: "Aug", completed: 14, pending: 7 },
  { month: "Sep", completed: 19, pending: 5 },
  { month: "Oct", completed: 21, pending: 3 },
  { month: "Nov", completed: 17, pending: 6 },
];

function MetricCard({ icon: Icon, label, value, note, tone }) {
  return (
    <div className="mr-metric">
      <div className={`mr-metric-icon ${tone}`}><Icon size={19} /></div>
      <div className="mr-metric-label">{label}</div>
      <div className="mr-metric-value">{value}</div>
      <div className="mr-metric-note">{note}</div>
    </div>
  );
}

export default function MaintenanceRisk() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = maintenance.filter((item) => {
    const matchesFilter = filter === "All" || item.status === filter;
    const matchesSearch = `${item.id} ${item.vehicle} ${item.service}`.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="mr-page">
      <header className="mr-header">
        <div>
          <div className="mr-eyebrow">06 / FLEET RELIABILITY</div>
          <h1>Maintenance <em>&</em> Risk</h1>
          <p>Stay ahead of service schedules and keep every vehicle fleet-ready.</p>
        </div>
        <div className="mr-header-tag"><Activity size={15} /> DEMO MONITORING DATA</div>
      </header>

      <section className="mr-metrics">
        <MetricCard icon={Wrench} label="TOTAL MAINTENANCE" value="24" note="Across the fleet" tone="sage" />
        <MetricCard icon={CalendarClock} label="UPCOMING SERVICES" value="08" note="Next 7 days" tone="tan" />
        <MetricCard icon={AlertTriangle} label="OVERDUE SERVICES" value="03" note="Requires attention" tone="red" />
        <MetricCard icon={ShieldCheck} label="FLEET HEALTH" value="92%" note="Overall health score" tone="burgundy" />
      </section>

      <section className="mr-main-grid">
        <div className="mr-panel mr-chart-panel">
          <div className="mr-panel-heading">
            <div>
              <div className="mr-section-label">SERVICE ACTIVITY</div>
              <h2>Maintenance overview</h2>
            </div>
            <span className="mr-period">LAST 6 MONTHS</span>
          </div>
          <div className="mr-chart-legend">
            <span><i className="mr-dot completed" /> Completed</span>
            <span><i className="mr-dot pending" /> Pending</span>
          </div>
          <div className="mr-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="mrCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#66847e" stopOpacity={0.24} />
                    <stop offset="100%" stopColor="#66847e" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="mrPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ac845e" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#ac845e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e8e0d4" strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#81776d", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#81776d", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#fbf8f1", border: "1px solid #d8cfc0", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="#66847e" fill="url(#mrCompleted)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="pending" name="Pending" stroke="#ac845e" fill="url(#mrPending)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mr-chart-foot">Service activity recorded across the fleet · Demonstration data</div>
        </div>

        <div className="mr-panel mr-alert-panel">
          <div className="mr-panel-heading">
            <div>
              <div className="mr-section-label">ATTENTION REQUIRED</div>
              <h2>Vehicle risk alerts</h2>
            </div>
            <span className="mr-alert-count">03</span>
          </div>
          <div className="mr-alert-item">
            <div className="mr-alert-symbol high"><CircleAlert size={17} /></div>
            <div className="mr-alert-copy">
              <strong>Battery cooling check</strong>
              <span>EV-002 · Service overdue</span>
            </div>
            <span className="mr-risk high-text">HIGH</span>
          </div>
          <div className="mr-alert-item">
            <div className="mr-alert-symbol high"><AlertTriangle size={17} /></div>
            <div className="mr-alert-copy">
              <strong>Motor diagnostics</strong>
              <span>EV-004 · Service overdue</span>
            </div>
            <span className="mr-risk high-text">HIGH</span>
          </div>
          <div className="mr-alert-item">
            <div className="mr-alert-symbol medium"><Gauge size={17} /></div>
            <div className="mr-alert-copy">
              <strong>Brake inspection due</strong>
              <span>EV-001 · Upcoming service</span>
            </div>
            <span className="mr-risk medium-text">MEDIUM</span>
          </div>
          <div className="mr-alert-note">
            <ShieldCheck size={16} />
            <span>Prioritise high-risk vehicles before the next dispatch cycle.</span>
          </div>
        </div>
      </section>

      <section className="mr-panel mr-schedule-panel">
        <div className="mr-panel-heading mr-schedule-heading">
          <div>
            <div className="mr-section-label">WORKSHOP PLANNER</div>
            <h2>Maintenance schedule</h2>
            <p>Track upcoming, overdue and scheduled service tasks.</p>
          </div>
          <div className="mr-search">
            <Search size={15} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vehicle or service..." />
          </div>
        </div>

        <div className="mr-filters">
          {["All", "Upcoming", "Overdue", "Scheduled"].map((item) => (
            <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="mr-table-wrap">
          <table className="mr-table">
            <thead>
              <tr><th>VEHICLE</th><th>SERVICE TASK</th><th>DUE DATE</th><th>PRIORITY</th><th>STATUS</th><th>RISK</th></tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.id}</strong><span className="mr-sub-cell">{item.vehicle}</span></td>
                  <td>{item.service}</td>
                  <td>{item.date}</td>
                  <td><span className={`mr-priority ${item.priority.toLowerCase()}`}>{item.priority}</span></td>
                  <td><span className={`mr-status ${item.status.toLowerCase()}`}>{item.status}</span></td>
                  <td><span className={`mr-risk ${item.risk.toLowerCase()}-text`}>{item.risk}</span></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="6" className="mr-empty">No maintenance records match your search.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="mr-table-foot">Showing {filtered.length} of {maintenance.length} demonstration records</div>
      </section>

      <section className="mr-panel mr-history-panel">
        <div className="mr-panel-heading">
          <div>
            <div className="mr-section-label">RECENT RECORDS</div>
            <h2>Maintenance history</h2>
          </div>
          <span className="mr-history-caption"><Clock3 size={14} /> LATEST COMPLETED TASKS</span>
        </div>
        <div className="mr-history-list">
          {history.map((item) => (
            <div className="mr-history-row" key={item.vehicle}>
              <div className="mr-history-check"><CheckCircle2 size={17} /></div>
              <div className="mr-history-main"><strong>{item.task}</strong><span>{item.vehicle} · {item.technician}</span></div>
              <span className="mr-history-date">{item.date}</span>
              <span className="mr-history-done">Completed <ArrowUpRight size={13} /></span>
            </div>
          ))}
        </div>
      </section>

      <footer className="mr-footer">
        <span>FASTFLEET / MAINTENANCE INTELLIGENCE</span>
        <span>Illustrative data · Backend integration planned</span>
      </footer>
    </main>
  );
}
