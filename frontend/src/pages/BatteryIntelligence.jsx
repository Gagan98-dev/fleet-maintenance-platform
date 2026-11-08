import "../FleetAnalytics.css";

const batteryCells = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
];

const lowBattery = [
  ["KA 02 EV 2036", "Deepak R.", "6%", "34°C"],
  ["KA 03 EV 8733", "Mohan V.", "7%", "33°C"],
  ["KA 06 EV 7845", "Anita M.", "11%", "37°C"],
  ["KA 07 EV 6883", "Anita M.", "12%", "32°C"],
  ["KA 08 EV 3923", "Suresh P.", "14%", "34°C"],
  ["KA 05 EV 1148", "Anita M.", "16%", "34°C"],
  ["KA 01 EV 5995", "Mohan V.", "16%", "30°C"],
  ["KA 05 EV 2813", "Mohan V.", "17%", "27°C"]
];

function BatteryIntelligence() {
  return (
    <div className="fleet-page">

      <div className="page-heading">
        <span>03</span>
        <h1>Battery <i>intelligence centre</i></h1>
        <p>Pack-level condition, fleet-wide health and degradation.</p>
      </div>

      <div className="battery-grid">

        {/* BATTERY INSPECTOR */}

        <div className="fleet-card battery-inspector">

          <h4>PACK INSPECTOR</h4>

          <h3>KA 06 EV 6180</h3>

          <div className="battery-tabs">
            <button className="selected">TEMPERATURE</button>
            <button>CELL VOLTAGE Δ</button>
            <button>CELL HEALTH</button>
          </div>

          <div className="battery-heatmap">
            {batteryCells.map((cell, index) => (
              <div
                key={index}
                className="battery-cell"
                style={{
                  backgroundColor:
                    index % 9 === 0 ? "#e8a323" :
                    index % 7 === 0 ? "#ed7625" :
                    index % 5 === 0 ? "#e83e2d" :
                    "#e5b72c"
                }}
              />
            ))}
          </div>

          <div className="battery-stats">

            <div>
              <small>AVG PACK TEMP</small>
              <strong>49.1 °C</strong>
            </div>

            <div>
              <small>HOTTEST CELL</small>
              <strong>56.1 °C</strong>
            </div>

            <div>
              <small>CELL Δ</small>
              <strong>86 mV</strong>
            </div>

            <div>
              <small>SOH</small>
              <strong>86%</strong>
            </div>

            <div>
              <small>CHARGE CYCLES</small>
              <strong>256</strong>
            </div>

            <div>
              <small>INT. RESISTANCE</small>
              <strong>1.53 mΩ</strong>
            </div>

          </div>
        </div>

        {/* BATTERY HEALTH */}

        <div className="fleet-card health-card">

          <h4>SOC VS SOH, EVERY VEHICLE</h4>

          <div className="scatter-chart">
            {Array.from({ length: 75 }).map((_, i) => (
              <span
                key={i}
                style={{
                  left: `${10 + (i * 17 % 85)}%`,
                  bottom: `${10 + (i * 29 % 80)}%`
                }}
              />
            ))}
          </div>

          <h4>HEALTH DISTRIBUTION</h4>

          <div className="health-bars">
            {[3, 17, 72, 85, 68].map((value, i) => (
              <div key={i}>
                <div style={{ height: `${value}%` }} />
                <small>{["<80", "80-84", "85-89", "90-94", "95+"][i]}</small>
              </div>
            ))}
          </div>

        </div>

        {/* LOW BATTERY VEHICLES */}

        <div className="fleet-card low-battery">

          <h4>LOW BATTERY · 9 VEHICLES</h4>

          {lowBattery.map((vehicle, index) => (
            <div className="low-battery-row" key={index}>

              <div>
                <strong>▱ {vehicle[2]}</strong>
                <small>{vehicle[0]} · {vehicle[1]}</small>
              </div>

              <span>{vehicle[3]}</span>

            </div>
          ))}

        </div>

      </div>

      {/* BOTTOM ANALYTICS */}

      <div className="battery-bottom">

        <div className="fleet-card degradation-card">

          <h4>SOH DEGRADATION BY CATEGORY, 18 MONTHS</h4>

          <div className="degradation-lines">
            {[96, 92, 88, 84].map((value, i) => (
              <div key={i}>
                <span>{value}%</span>
                <div style={{ width: `${value}%` }} />
              </div>
            ))}
          </div>

          <p>May 25 ─ Jul 25 ─ Sept 25 ─ Nov 25 ─ Jan 26 ─ Mar 26</p>

        </div>

        <div className="fleet-card average-card">

          <h4>FLEET AVERAGES</h4>

          <div className="gauge">
            <strong>59.9%</strong>
            <small>AVERAGE SOC</small>
          </div>

          <div className="gauge second-gauge">
            <strong>90.9%</strong>
            <small>AVERAGE SOH</small>
          </div>

        </div>

        <div className="fleet-card temperature-card">

          <h4>PACK TEMPERATURE SPREAD</h4>

          {[65, 101, 70, 10, 2].map((value, i) => (
            <div className="temperature-bar" key={i}>
              <div style={{ height: `${value * 2}px` }} />
              <small>{["25-30", "30-35", "35-40", "40-45", "45+"][i]}</small>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default BatteryIntelligence;