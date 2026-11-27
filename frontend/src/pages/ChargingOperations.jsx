
import "./ChargingOperations.css";

// Each session now has all 6 values required by the table.
const sessions = [
  ["KA 01 EV 1333", "Alpha DC-1", "3", "24→45%", "68%", "37 min"],
  ["KA 04 EV 1444", "Alpha DC-1", "3", "20→36%", "52%", "36 min"],
  ["KA 07 EV 1555", "Alpha DC-1", "3", "8→18%", "34%", "48 min"],
  ["KA 04 EV 1777", "Alpha DC-1", "3", "10→23%", "46%", "38 min"],
  ["KA 05 EV 3146", "Alpha DC-1", "3", "23→54%", "72%", "24 min"],
  ["KA 07 EV 3220", "Bravo DC", "3", "16→24%", "39%", "51 min"],
  ["KA 01 EV 3331", "Bravo DC", "3", "37→47%", "61%", "29 min"],
  ["KA 09 EV 3627", "Bravo DC", "3", "29→63%", "84%", "11 min"]
];

const stations = [
  ["Alpha DC-1", "DC 60 kW", "3/8 free"],
  ["Bravo DC", "DC 120 kW", "2/6 free"],
  ["Central AC", "AC 22 kW", "2/12 free"],
  ["Delta AC", "AC 22 kW", "6/10 free"],
  ["Echo DC", "DC 60 kW", "1/6 free"],
  ["Foxtrot AC", "AC 11 kW", "6/8 free"],
  ["Midtown Public", "DC 120 kW", "2/4 free"],
  ["Ring Rd Public", "DC 60 kW", "4/6 free"]
];

const history = [
  ["KA 05 EV 6476", "Alpha DC-1", "13:00", "14", "₹134"],
  ["KA 06 EV 6513", "Delta AC", "12:07", "19", "₹182"],
  ["KA 07 EV 6550", "Midtown Public", "11:14", "24", "₹230"],
  ["KA 08 EV 6587", "Bravo DC", "10:21", "29", "₹278"],
  ["KA 09 EV 6624", "Echo DC", "09:28", "34", "₹326"],
  ["KA 01 EV 6661", "Ring Rd Public", "08:35", "39", "₹374"]
];

function ChargingOperations() {
  return (
    <div className="fleet-page charging-page">

      <div className="page-heading">
        <span>04</span>
        <h1>Charging <i>operations</i></h1>
        <p>Sessions, stations and spend.</p>
      </div>

      {/* TOP SUMMARY */}
      <div className="charging-summary">
        <div>
          <small>IN PROGRESS NOW</small>
          <strong>32 <span>sessions · 26 ports free</span></strong>
        </div>

        <div>
          <small>ENERGY CONSUMED</small>
          <strong>1,02,600 <span>kWh</span></strong>
        </div>

        <div>
          <small>CHARGING COST</small>
          <strong>₹9,72,000</strong>
        </div>

        <div>
          <small>AVG SESSION DURATION</small>
          <strong>47 <span>min</span></strong>
        </div>
      </div>

      {/* SESSIONS AND STATION AVAILABILITY */}
      <div className="charging-main">

        <div className="fleet-card sessions-card">
          <h4>SESSIONS IN PROGRESS</h4>

          <div className="charging-table-wrap">
            <table className="charging-table sessions-table">
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
                {sessions.map((row, index) => (
                  <tr key={index}>
                    {row.map((item, cellIndex) => (
                      <td key={cellIndex}>
                        {cellIndex === 4 ? (
                          <span className="charging-progress">{item}</span>
                        ) : item}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="fleet-card station-card">
          <h4>STATION AVAILABILITY</h4>

          <div className="station-list">
            {stations.map((station, index) => (
              <div className="station-row" key={index}>

                <div className="station-info">
                  <strong>{station[0]}</strong>
                  <small>{station[1]}</small>
                </div>

                <div className="station-slots">
                  {Array.from({ length: 8 }).map((_, slotIndex) => (
                    <span
                      key={slotIndex}
                      className={slotIndex < index + 2 ? "occupied" : ""}
                    />
                  ))}
                </div>

                <strong className="station-free">{station[2]}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TIMELINE AND HISTORY */}
      <div className="charging-bottom">

        <div className="fleet-card timeline-card">
          <h4>CHARGING ACTIVITY TIMELINE, LAST 24 H</h4>

          <div className="timeline-list">
            {stations.map((station, index) => (
              <div className="timeline-row" key={index}>
                <span className="timeline-name">{station[0]}</span>

                <div className="timeline-track">
                  <div
                    style={{
                      width: `${25 + index * 8}%`,
                      marginLeft: `${index * 5}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="timeline-hours">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>00:00</span>
          </div>
        </div>

        <div className="fleet-card history-card">
          <h4>SESSION HISTORY</h4>

          <div className="charging-table-wrap">
            <table className="charging-table history-table">
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
                {history.map((row, index) => (
                  <tr key={index}>
                    {row.map((item, cellIndex) => (
                      <td key={cellIndex}>{item}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ChargingOperations;
