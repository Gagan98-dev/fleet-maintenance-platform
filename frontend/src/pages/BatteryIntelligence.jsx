
import "./BatteryIntelligence.css";
const batteryCells = Array.from({ length: 96 }, (_, index) => index);

// Vehicles with low battery levels.
const lowBattery = [
  ["KA 02 EV 2036", "Deepak R.", "6%", "34°C"],
  ["KA 03 EV 8733", "Mohan V.", "7%", "33°C"],
  ["KA 06 EV 7845", "Anita M.", "11%", "37°C"],
  ["KA 07 EV 6883", "Anita M.", "12%", "32°C"],
  ["KA 08 EV 3923", "Suresh P.", "14%", "34°C"],
  ["KA 05 EV 1148", "Anita M.", "16%", "34°C"],
  ["KA 01 EV 5995", "Mohan V.", "16%", "30°C"],
  ["KA 05 EV 2813", "Mohan V.", "17%", "27°C"],
];

// Battery health distribution.
const healthDistribution = [
  { label: "<80", value: 3 },
  { label: "80-84", value: 17 },
  { label: "85-89", value: 72 },
  { label: "90-94", value: 85 },
  { label: "95+", value: 68 },
];

// SOH degradation data.
const degradationData = [
  { label: "96%", value: 96 },
  { label: "92%", value: 92 },
  { label: "88%", value: 88 },
  { label: "84%", value: 84 },
];

// Pack temperature distribution.
const temperatureData = [
  { label: "25-30", value: 65 },
  { label: "30-35", value: 101 },
  { label: "35-40", value: 70 },
  { label: "40-45", value: 10 },
  { label: "45+", value: 2 },
];

function BatteryIntelligence() {
  return (
    <div className="fleet-page">

      {/* PAGE HEADING */}
      <div className="page-heading">
        <span>03</span>

        <h1>
          Battery <i>intelligence centre</i>
        </h1>

        <p>
          Pack-level condition, fleet-wide health and degradation.
        </p>
      </div>

      {/* TOP ANALYTICS SECTION */}
      <div className="battery-grid">

        {/* BATTERY PACK INSPECTOR */}
        <section className="fleet-card battery-inspector">

          <h4>PACK INSPECTOR</h4>

          <h3>KA 06 EV 6180</h3>

          <div className="battery-tabs">
            <button className="selected">TEMPERATURE</button>
            <button>CELL VOLTAGE Δ</button>
            <button>CELL HEALTH</button>
          </div>

          {/* Battery cell heatmap */}
          <div className="battery-heatmap">
            {batteryCells.map((cell) => (
              <div
                key={cell}
                className="battery-cell"
                style={{
                  backgroundColor:
                    cell % 9 === 0
                      ? "#e8a323"
                      : cell % 7 === 0
                        ? "#ed7625"
                        : cell % 5 === 0
                          ? "#e83e2d"
                          : "#e5b72c",
                }}
              />
            ))}
          </div>

          {/* Battery statistics */}
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
        </section>

        {/* BATTERY HEALTH ANALYTICS */}
        <section className="fleet-card health-card">

          <h4>SOC VS SOH, EVERY VEHICLE</h4>

          {/* Illustrative scatter chart */}
          <div className="scatter-chart">
            {Array.from({ length: 75 }, (_, index) => (
              <span
                key={index}
                style={{
                  left: `${10 + (index * 17 % 85)}%`,
                  bottom: `${10 + (index * 29 % 80)}%`,
                }}
              />
            ))}
          </div>

          <h4>HEALTH DISTRIBUTION</h4>

          {/* Health distribution chart */}
          <div className="health-bars">
            {healthDistribution.map((item) => (
              <div key={item.label}>
                <div
                  style={{
                    height: `${item.value}%`,
                  }}
                />
                <small>{item.label}</small>
              </div>
            ))}
          </div>

        </section>

        {/* LOW BATTERY VEHICLES */}
        <section className="fleet-card low-battery">

          <h4>LOW BATTERY · 9 VEHICLES</h4>

          {lowBattery.map((vehicle, index) => (
            <div className="low-battery-row" key={index}>

              <div>
                <strong>▱ {vehicle[2]}</strong>
                <small>
                  {vehicle[0]} · {vehicle[1]}
                </small>
              </div>

              <span>{vehicle[3]}</span>

            </div>
          ))}

        </section>

      </div>

      {/* BOTTOM ANALYTICS SECTION */}
      <div className="battery-bottom">

        {/* SOH DEGRADATION CHART */}
        <section className="fleet-card degradation-card">

          <h4>SOH DEGRADATION BY CATEGORY, 18 MONTHS</h4>

          <div
            className="bi-degradation-chart"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              marginTop: "30px",
            }}
          >

            {degradationData.map((item) => (
              <div
                className="bi-degradation-row"
                key={item.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px minmax(0, 1fr)",
                  alignItems: "center",
                  gap: "12px",
                }}
              >

                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#542638",
                  }}
                >
                  {item.label}
                </span>

                {/* Background track */}
                <div
                  style={{
                    width: "100%",
                    height: "10px",
                    backgroundColor: "#e8e1d6",
                    borderRadius: "20px",
                    overflow: "hidden",
                  }}
                >

                  {/* Filled progress bar */}
                  <div
                    style={{
                      width: `${item.value}%`,
                      height: "100%",
                      backgroundColor: "#77958c",
                      borderRadius: "20px",
                    }}
                  />

                </div>

              </div>
            ))}

          </div>

          {/* Timeline labels */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "8px",
              borderTop: "1px solid #ddd2c1",
              paddingTop: "13px",
              marginTop: "28px",
              fontSize: "11px",
              color: "#81776d",
            }}
          >
            <span>May 25</span>
            <span>Jul 25</span>
            <span>Sep 25</span>
            <span>Nov 25</span>
            <span>Jan 26</span>
            <span>Mar 26</span>
          </div>

        </section>

        {/* FLEET AVERAGES */}
        <section className="fleet-card average-card">

          <h4>FLEET AVERAGES</h4>

          {/* Average SOC gauge */}
          <div className="gauge">
            <strong>59.9%</strong>
            <small>AVERAGE SOC</small>
          </div>

          {/* Average SOH gauge */}
          <div className="gauge second-gauge">
            <strong>90.9%</strong>
            <small>AVERAGE SOH</small>
          </div>

        </section>

        {/* PACK TEMPERATURE SPREAD */}
        <section
          className="fleet-card temperature-card"
          style={{
            display: "block",
            minWidth: 0,
          }}
        >

          <h4>PACK TEMPERATURE SPREAD</h4>

          {/* Temperature chart */}
          <div
            className="bi-temperature-chart"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              alignItems: "end",
              gap: "12px",
              height: "190px",
              padding: "15px 5px 0",
              borderBottom: "1px solid #d8cdbb",
            }}
          >

            {temperatureData.map((item) => (
              <div
                key={item.label}
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  minWidth: 0,
                }}
              >

                {/* Bar area */}
                <div
                  style={{
                    height: "150px",
                    width: "100%",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                  }}
                >

                  <div
                    style={{
                      width: "28px",
                      maxWidth: "75%",
                      height: `${item.value}px`,
                      minHeight: "3px",
                      backgroundColor: "#713044",
                      borderRadius: "3px 3px 0 0",
                    }}
                  />

                </div>

                {/* Temperature category */}
                <small
                  style={{
                    fontSize: "10px",
                    marginTop: "9px",
                    whiteSpace: "nowrap",
                    color: "#81776d",
                  }}
                >
                  {item.label}
                </small>

              </div>
            ))}

          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: "10px",
              color: "#81776d",
              marginTop: "12px",
            }}
          >
            TEMPERATURE RANGE (°C)
          </p>

        </section>

      </div>

    </div>
  );
}

export default BatteryIntelligence;
