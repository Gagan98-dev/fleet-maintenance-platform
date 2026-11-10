import { useEffect, useState } from "react";
import "../FleetAnalytics.css";
import { getJSON } from "../api";
import DemoDataPrompt from "../components/DemoDataPrompt";

const REFRESH_MS = 30000;

const number = (n) => Number(n ?? 0).toLocaleString("en-IN");
const rupees = (n) => `₹${number(n)}`;
const clock = (iso) =>
  iso
    ? new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : "—";

function ChargingOperations() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Load now, then keep sessions fresh while the page is open
  useEffect(() => {
    let cancelled = false;

    function load() {
      getJSON("/charging/overview")
        .then((result) => {
          if (cancelled) return;
          setData(result);
          setError("");
        })
        .catch((err) => {
          if (!cancelled) setError(err.message);
        });
    }

    load();
    const timer = setInterval(load, REFRESH_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [refreshKey]);

  const heading = (
    <div className="page-heading">
      <span>04</span>
      <h1>Charging <i>operations</i></h1>
      <p>Sessions, stations and spend.</p>
    </div>
  );

  if (!data) {
    return (
      <div className="fleet-page">
        {heading}
        <div className="fleet-card">
          {error
            ? <p style={{ color: "#963f4a" }}>{error}</p>
            : <p>Loading charging data…</p>}
        </div>
      </div>
    );
  }

  const { summary, sessions, stations, history, timeline } = data;

  if (stations.length === 0) {
    return (
      <div className="fleet-page">
        {heading}
        <DemoDataPrompt onDone={() => setRefreshKey((k) => k + 1)} />
      </div>
    );
  }

  return (

    <div className="fleet-page">

      {heading}

      {error && (
        <div className="fleet-card" style={{ marginBottom: 15 }}>
          <small style={{ color: "#963f4a" }}>
            Could not refresh: {error}. Showing the last loaded data.
          </small>
        </div>
      )}

      {/* TOP SUMMARY */}

      <div className="charging-summary">

        <div>
          <small>IN PROGRESS NOW</small>
          <strong>{summary.in_progress} <span>sessions · {summary.free_ports} ports free</span></strong>
        </div>

        <div>
          <small>ENERGY CONSUMED</small>
          <strong>{number(summary.energy_kwh)} <span>kWh</span></strong>
        </div>

        <div>
          <small>CHARGING COST</small>
          <strong>{rupees(summary.cost)}</strong>
        </div>

        <div>
          <small>AVG SESSION DURATION</small>
          <strong>{summary.avg_session_minutes} <span>min</span></strong>
        </div>

      </div>

      {/* MAIN SECTION */}

      <div className="charging-main">

        {/* SESSIONS TABLE */}

        <div className="fleet-card sessions-card">

          <h4>SESSIONS IN PROGRESS</h4>

          <table>
            <thead>
              <tr>
                <th>VEHICLE</th>
                <th>STATION</th>
                <th>kW</th>
                <th>SOC</th>
                <th>PROGRESS</th>
                <th>ETA</th>
              </tr>
            </thead>

            <tbody>
              {sessions.length === 0 && (
                <tr><td colSpan={6}>No active sessions.</td></tr>
              )}

              {sessions.map((s) => {
                const total = s.target_soc - s.start_soc;
                const progress = total > 0
                  ? Math.round(Math.min(100, Math.max(0, ((s.current_soc - s.start_soc) / total) * 100)))
                  : 100;

                return (
                  <tr key={s.id}>
                    <td>{s.vehicle_number}</td>
                    <td>{s.station}</td>
                    <td>{s.power_kw}</td>
                    <td>{s.start_soc}→{s.current_soc}%</td>
                    <td><span className="progress-text">{progress}%</span></td>
                    <td>{s.eta_minutes != null ? `${s.eta_minutes} min` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

        </div>

        {/* STATION AVAILABILITY */}

        <div className="fleet-card station-card">

          <h4>STATION AVAILABILITY</h4>

          {stations.map((station) => (

            <div className="station-row" key={station.id}>

              <div>
                <strong>{station.name}</strong>
                <small>{station.charger_type} {station.power_kw} kW</small>
              </div>

              <div className="station-slots">
                {Array.from({ length: station.total_ports }).map((_, i) => (
                  <span
                    key={i}
                    className={i < station.occupied_ports ? "occupied" : ""}
                  />
                ))}
              </div>

              <strong>{station.free_ports}/{station.total_ports} free</strong>

            </div>

          ))}

        </div>

      </div>

      {/* BOTTOM SECTION */}

      <div className="charging-bottom">

        {/* ACTIVITY TIMELINE */}

        <div className="fleet-card timeline-card">

          <h4>CHARGING ACTIVITY TIMELINE, LAST 24 H</h4>

          {timeline.map((row) => (

            <div className="timeline-row" key={row.station}>

              <span>{row.station}</span>

              <div className="timeline-track">
                {row.segments.map((seg, i) => (
                  <div
                    key={i}
                    style={{ left: `${seg.left}%`, width: `${seg.width}%` }}
                  />
                ))}
              </div>

            </div>

          ))}

          <div className="timeline-hours">
            <span>-24h</span>
            <span>-18h</span>
            <span>-12h</span>
            <span>-6h</span>
            <span>now</span>
          </div>

        </div>

        {/* SESSION HISTORY */}

        <div className="fleet-card history-card">

          <h4>SESSION HISTORY</h4>

          <table>
            <thead>
              <tr>
                <th>VEHICLE</th>
                <th>STATION</th>
                <th>TIME</th>
                <th>kWh</th>
                <th>COST</th>
              </tr>
            </thead>

            <tbody>
              {history.length === 0 && (
                <tr><td colSpan={5}>No completed sessions yet.</td></tr>
              )}

              {history.map((h) => (
                <tr key={h.id}>
                  <td>{h.vehicle_number}</td>
                  <td>{h.station}</td>
                  <td>{clock(h.ended_at)}</td>
                  <td>{h.energy_kwh}</td>
                  <td>{rupees(h.cost)}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}

export default ChargingOperations;
