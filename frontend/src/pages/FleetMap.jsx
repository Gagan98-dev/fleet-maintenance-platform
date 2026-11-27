
import { useEffect, useMemo } from "react";
import { Search, Plus, Minus, Crosshair } from "lucide-react";

import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip as MapTooltip,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const demoVehicles = [
  { position: [12.9716, 77.5946], soc: 78, soh: 91, temperature: 34, speed: 42, odometer: "42,180", route: "R-13", depot: "Whitefield" },
  { position: [13.1007, 77.5963], soc: 65, soh: 86, temperature: 32, speed: 0, odometer: "26,596", route: "R-08", depot: "Yelahanka" },
  { position: [13.0285, 77.5197], soc: 47, soh: 88, temperature: 36, speed: 31, odometer: "31,204", route: "R-21", depot: "Peenya" },
  { position: [12.9698, 77.7500], soc: 83, soh: 94, temperature: 31, speed: 0, odometer: "18,420", route: "R-02", depot: "Whitefield" },
  { position: [12.9250, 77.5830], soc: 72, soh: 96, temperature: 34, speed: 38, odometer: "18,420", route: "R-05", depot: "Jayanagar" },
  { position: [13.0358, 77.5970], soc: 64, soh: 94, temperature: 31, speed: 0, odometer: "12,110", route: "R-05", depot: "Hebbal" },
  { position: [12.9352, 77.6245], soc: 71, soh: 92, temperature: 32, speed: 0, odometer: "9,802", route: "R-17", depot: "Koramangala" },
  { position: [13.0100, 77.5400], soc: 54, soh: 90, temperature: 35, speed: 0, odometer: "51,003", route: "R-11", depot: "Peenya" },
];

function MapRecenter({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) map.setView(center, 11);
  }, [center, map]);

  return null;
}

function FleetMap({
  vehicles,
  filter,
  setFilter,
  mapSearch,
  setMapSearch,
  selected,
  setSelected,
  setPage,
}) {
  const mapVehicles = useMemo(() => {
    return vehicles.map((v, i) => {
      const sample = demoVehicles[i % demoVehicles.length];

      return {
        ...sample,
        id: v.id,
        vehicle_number: v.vehicle_number || "Unknown vehicle",
        model: v.model || "Unknown model",
        vehicle_type: v.vehicle_type || "Vehicle",
        status: v.status || "Active",
        driver:
          typeof v.driver === "object"
            ? v.driver?.name || "Unassigned"
            : v.driver || "Unassigned",
      };
    });
  }, [vehicles]);

  const filteredMapVehicles = useMemo(() => {
    return mapVehicles.filter(v => {
      const type = (v.vehicle_type || "").toLowerCase();

      const typeMatch =
        filter === "ALL" ||
        (filter === "TWO-WHEELERS" && type.includes("two")) ||
        (filter === "THREE-WHEELERS" && type.includes("three")) ||
        (filter === "CARS" && type.includes("car")) ||
        (filter === "VANS" && type.includes("van")) ||
        (filter === "BUSES" && type.includes("bus"));

      const query = mapSearch.toLowerCase();

      const searchMatch =
        `${v.vehicle_number} ${v.model} ${v.driver}`
          .toLowerCase()
          .includes(query);

      return typeMatch && searchMatch;
    });
  }, [mapVehicles, filter, mapSearch]);

  const selectedMapVehicle =
    filteredMapVehicles.find(v => v.id === selected?.id) ||
    filteredMapVehicles[0] ||
    null;

  return (
    <section className="ff-map-page">
      <div className="ff-map-heading">
        <div>
          <small>02</small>
          <h1>Fleet Map <em>overview</em></h1>
          <p>
            Backend vehicle records with illustrative Bengaluru locations.
            No live GPS is connected.
          </p>
        </div>
        <div className="ff-demo-pill">DEMO LOCATIONS</div>
      </div>

      <div className="ff-map-toolbar">
        <div className="ff-filter-list">
          {["ALL", "TWO-WHEELERS", "THREE-WHEELERS", "CARS", "VANS", "BUSES"].map(f => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <span>
          {filteredMapVehicles.length} OF {mapVehicles.length} VEHICLES SHOWN
        </span>

        <label className="ff-map-search">
          <Search size={15} />
          <input
            value={mapSearch}
            onChange={e => setMapSearch(e.target.value)}
            placeholder="Find vehicle or driver"
          />
        </label>
      </div>

      <div className="ff-map-layout">
        <div className="ff-map-canvas">
          <MapContainer
            center={[12.9716, 77.5946]}
            zoom={11}
            scrollWheelZoom={true}
            zoomControl={false}
          >
            <MapRecenter
              center={selectedMapVehicle?.position || [12.9716, 77.5946]}
            />

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredMapVehicles.map(v => (
              <CircleMarker
                key={v.id}
                center={v.position}
                radius={selectedMapVehicle?.id === v.id ? 9 : 6}
                pathOptions={{
                  color: selectedMapVehicle?.id === v.id ? "#542638" : "#f8f4eb",
                  weight: selectedMapVehicle?.id === v.id ? 3 : 2,
                  fillColor:
                    (v.status || "").toLowerCase().includes("maint")
                      ? "#b18b64"
                      : (v.status || "").toLowerCase().includes("charg")
                        ? "#6d8981"
                        : "#82988c",
                  fillOpacity: 1,
                }}
                eventHandlers={{
                  click: () => setSelected(v),
                }}
              >
                <MapTooltip>{v.vehicle_number}</MapTooltip>
              </CircleMarker>
            ))}
          </MapContainer>

          <div className="ff-map-controls">
            <button onClick={() => document.querySelector(".leaflet-control-zoom-in")?.click()}>
              <Plus size={17} />
            </button>
            <button onClick={() => document.querySelector(".leaflet-control-zoom-out")?.click()}>
              <Minus size={17} />
            </button>
            <button onClick={() => setSelected(filteredMapVehicles[0] || null)}>
              <Crosshair size={16} />
            </button>
          </div>

          <div className="ff-map-legend">
            {["Vehicles", "Demo locations", "Operational", "Charging", "Idle", "Maintenance"].map(l => (
              <span key={l} className="legend-status">{l}</span>
            ))}
          </div>
        </div>

        <aside className="ff-selected-panel">
          {selectedMapVehicle ? (
            <>
              <small>SELECTED BACKEND VEHICLE</small>
              <h3>{selectedMapVehicle.vehicle_number}</h3>
              <p>
                <b>{selectedMapVehicle.model}</b> · {selectedMapVehicle.vehicle_type}
              </p>

              <span className="ff-critical-badge">
                <i /> {selectedMapVehicle.status}
              </span>

              <div className="ff-soc-label">
                <small>DEMO STATE OF CHARGE</small>
                <strong>{selectedMapVehicle.soc}<sup>%</sup></strong>
                <span>Illustrative value only</span>
              </div>

              <div className="ff-battery-bars">
                {Array.from({ length: 10 }, (_, i) => (
                  <i
                    key={i}
                    className={i < Math.round(selectedMapVehicle.soc / 10) ? "filled" : ""}
                  />
                ))}
              </div>

              <div className="ff-vehicle-details">
                <div><small>DRIVER</small><b>{selectedMapVehicle.driver}</b></div>
                <div><small>ROUTE</small><b>{selectedMapVehicle.route}</b></div>
                <div><small>DEMO SOH</small><b>{selectedMapVehicle.soh}%</b></div>
                <div><small>DEMO PACK TEMP</small><b className="temp">{selectedMapVehicle.temperature}°C</b></div>
                <div><small>DEMO SPEED</small><b>{selectedMapVehicle.speed} km/h</b></div>
                <div><small>DEMO ODOMETER</small><b>{selectedMapVehicle.odometer}</b></div>
                <div><small>DEMO DEPOT</small><b>{selectedMapVehicle.depot}</b></div>
                <div><small>UPDATED</small><b>Sample data</b></div>
              </div>

              <div className="ff-panel-buttons">
                <button onClick={() => setPage("dashboard")}>Dashboard</button>
                <button onClick={() => alert("Dispatch actions will be connected in a later module.")}>
                  Dispatch
                </button>
              </div>

              <p className="ff-map-note">
                Vehicle identity and driver are from your backend.
                Coordinates and telemetry are illustrative. Actual GPS/BMS
                integration is not connected.
              </p>
            </>
          ) : (
            <div className="ff-empty">
              {mapVehicles.length === 0
                ? "No vehicles are registered in the backend yet."
                : "No vehicles match this filter or search."}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

export default FleetMap;
