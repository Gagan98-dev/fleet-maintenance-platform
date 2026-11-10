import { useEffect, useState } from "react";
import "../FleetAnalytics.css";
import { getJSON } from "../api";
import DemoDataPrompt from "../components/DemoDataPrompt";

const TABS = [
  { key: "temp", label: "TEMPERATURE", unit: "°C", invert: false },
  { key: "voltage_delta", label: "CELL VOLTAGE Δ", unit: " mV", invert: false },
  { key: "health", label: "CELL HEALTH", unit: "%", invert: true },
];

// t = 0 (good) -> yellow, t = 1 (bad) -> red
function heatColor(t) {
  const hue = 50 - 50 * Math.min(1, Math.max(0, t));
  return `hsl(${hue}, 78%, 52%)`;
}

function cellColors(cells, tab) {
  const values = cells.map((c) => c[tab.key]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  return values.map((value) => {
    const t = (value - min) / span;
    return heatColor(tab.invert ? 1 - t : t);
  });
}

function BatteryIntelligence() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedId, setSelectedId] = useState(null);
  const [packState, setPackState] = useState({ id: null, data: null, error: "" });
  const [tabKey, setTabKey] = useState("temp");

  // Fleet overview
  useEffect(() => {
    let cancelled = false;

    getJSON("/battery/overview")
      .then((data) => {
        if (cancelled) return;
        setOverview(data);
        setError("");
        setSelectedId((current) => current ?? data.vehicles[0]?.vehicle_id ?? null);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  // Pack detail for the selected vehicle
  useEffect(() => {
    if (selectedId == null) return;
    let cancelled = false;

    getJSON(`/battery/vehicles/${selectedId}`)
      .then((data) => {
        if (!cancelled) setPackState({ id: selectedId, data, error: "" });
      })
      .catch((err) => {
        if (!cancelled) setPackState({ id: selectedId, data: null, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const pack = packState.id === selectedId ? packState.data : null;
  const packError = packState.id === selectedId ? packState.error : "";
  const packLoading = selectedId != null && packState.id !== selectedId;
  const tab = TABS.find((t) => t.key === tabKey) || TABS[0];

  const heading = (
    <div className="page-heading">
      <span>03</span>
      <h1>Battery <i>intelligence centre</i></h1>
      <p>Pack-level condition, fleet-wide health and degradation.</p>
    </div>
  );

  if (error) {
    return (
      <div className="fleet-page">
        {heading}
        <div className="fleet-card"><p style={{ color: "#963f4a" }}>{error}</p></div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="fleet-page">
        {heading}
        <div className="fleet-card"><p>Loading battery data…</p></div>
      </div>
    );
  }

  if (overview.fleet.vehicle_count === 0) {
    return (
      <div className="fleet-page">
        {heading}
        <DemoDataPrompt onDone={() => setRefreshKey((k) => k + 1)} />
      </div>
    );
  }

  const { fleet, vehicles, health_distribution, temperature_spread, low_battery, degradation } = overview;
  const maxHealth = Math.max(...health_distribution.map((b) => b.count), 1);
  const maxTemp = Math.max(...temperature_spread.map((b) => b.count), 1);
  const colors = pack ? cellColors(pack.cells, tab) : [];

  return (
    <div className="fleet-page">

      {heading}

      <div className="battery-grid">

        {/* BATTERY INSPECTOR */}

        <div className="fleet-card battery-inspector">

          <h4>PACK INSPECTOR</h4>

          <select
            value={selectedId ?? ""}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            aria-label="Select vehicle"
            style={{ fontSize: 12, padding: 4, color: "#702a40" }}
          >
            {vehicles.map((v) => (
              <option key={v.vehicle_id} value={v.vehicle_id}>
                {v.vehicle_number}
              </option>
            ))}
          </select>

          <div className="battery-tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={t.key === tabKey ? "selected" : ""}
                onClick={() => setTabKey(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {packError && <p style={{ color: "#963f4a" }}>{packError}</p>}
          {packLoading && <p>Loading pack…</p>}

          {pack && (
            <>
              <div className="battery-heatmap">
                {pack.cells.map((cell, index) => (
                  <div
                    key={index}
                    className="battery-cell"
                    title={`Cell ${index + 1}: ${cell[tab.key]}${tab.unit}`}
                    style={{ backgroundColor: colors[index] }}
                  />
                ))}
              </div>

              <div className="battery-stats">
                <div><small>AVG PACK TEMP</small><strong>{pack.avg_temp} °C</strong></div>
                <div><small>HOTTEST CELL</small><strong>{pack.hottest_cell_temp} °C</strong></div>
                <div><small>CELL Δ</small><strong>{pack.cell_delta_mv} mV</strong></div>
                <div><small>SOH</small><strong>{pack.soh}%</strong></div>
                <div><small>CHARGE CYCLES</small><strong>{pack.charge_cycles}</strong></div>
                <div><small>INT. RESISTANCE</small><strong>{pack.internal_resistance} mΩ</strong></div>
              </div>
            </>
          )}
        </div>

        {/* BATTERY HEALTH */}

        <div className="fleet-card health-card">

          <h4>SOC VS SOH, EVERY VEHICLE</h4>

          <div className="scatter-chart">
            {vehicles.map((v) => {
              const selected = v.vehicle_id === selectedId;
              return (
                <span
                  key={v.vehicle_id}
                  title={`${v.vehicle_number} · SOC ${v.soc}% · SOH ${v.soh}%`}
                  onClick={() => setSelectedId(v.vehicle_id)}
                  style={{
                    left: `${Math.min(97, v.soc * 0.97)}%`,
                    bottom: `${Math.min(95, Math.max(0, ((v.soh - 70) / 30) * 100))}%`,
                    cursor: "pointer",
                    ...(selected && {
                      background: "#e83e2d",
                      width: 11,
                      height: 11,
                      zIndex: 1,
                    }),
                  }}
                />
              );
            })}
          </div>

          <h4>HEALTH DISTRIBUTION</h4>

          <div className="health-bars">
            {health_distribution.map((bucket) => (
              <div key={bucket.label}>
                <div
                  title={`${bucket.count} vehicles`}
                  style={{ height: `${(bucket.count / maxHealth) * 100}%` }}
                />
                <small>{bucket.label}</small>
              </div>
            ))}
          </div>

        </div>

        {/* LOW BATTERY VEHICLES */}

        <div className="fleet-card low-battery">

          <h4>LOW BATTERY · {low_battery.length} VEHICLES</h4>

          {low_battery.length === 0 && <small>No vehicles are low on charge.</small>}

          {low_battery.slice(0, 8).map((vehicle) => (
            <div
              className="low-battery-row"
              key={vehicle.vehicle_id}
              onClick={() => setSelectedId(vehicle.vehicle_id)}
              style={{ cursor: "pointer" }}
            >
              <div>
                <strong>▱ {vehicle.soc}%</strong>
                <small>{vehicle.vehicle_number} · {vehicle.driver || "Unassigned"}</small>
              </div>

              <span>{vehicle.temp}°C</span>
            </div>
          ))}

        </div>

      </div>

      {/* BOTTOM ANALYTICS */}

      <div className="battery-bottom">

        <div className="fleet-card degradation-card">

          <h4>SOH DEGRADATION BY CATEGORY, {degradation.months.length} MONTHS</h4>

          <div className="degradation-lines">
            {degradation.series.map((series) => {
              const latest = [...series.values].reverse().find((v) => v != null) ?? 0;
              return (
                <div key={series.category}>
                  <span>{series.category} · {latest}%</span>
                  <div style={{ width: `${latest}%` }} />
                </div>
              );
            })}
          </div>

          <p>{degradation.months.join(" ─ ")}</p>

        </div>

        <div className="fleet-card average-card">

          <h4>FLEET AVERAGES</h4>

          <div className="gauge">
            <strong>{fleet.avg_soc}%</strong>
            <small>AVERAGE SOC</small>
          </div>

          <div className="gauge second-gauge">
            <strong>{fleet.avg_soh}%</strong>
            <small>AVERAGE SOH</small>
          </div>

        </div>

        <div className="fleet-card temperature-card">

          <h4>PACK TEMPERATURE SPREAD</h4>

          {temperature_spread.map((bucket) => (
            <div className="temperature-bar" key={bucket.label}>
              <div
                title={`${bucket.count} vehicles`}
                style={{ height: `${(bucket.count / maxTemp) * 120}px` }}
              />
              <small>{bucket.label}</small>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default BatteryIntelligence;
