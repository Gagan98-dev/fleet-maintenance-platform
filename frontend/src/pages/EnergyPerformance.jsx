import { useMemo, useState } from "react";
import {
  ResponsiveContainer, ComposedChart, BarChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import {
  Zap, IndianRupee, Gauge, TrendingDown, CalendarDays
} from "lucide-react";
import "./EnergyPerformance.css";

const periods = {
  Daily: [
    { label: "Mon", two: 420, three: 650, cars: 820, vans: 570, buses: 900, cost: 28 },
    { label: "Tue", two: 460, three: 690, cars: 860, vans: 600, buses: 940, cost: 31 },
    { label: "Wed", two: 440, three: 670, cars: 840, vans: 590, buses: 920, cost: 29 },
    { label: "Thu", two: 490, three: 720, cars: 900, vans: 630, buses: 980, cost: 33 },
    { label: "Fri", two: 510, three: 740, cars: 930, vans: 650, buses: 1020, cost: 35 },
    { label: "Sat", two: 390, three: 590, cars: 760, vans: 520, buses: 850, cost: 26 },
    { label: "Sun", two: 350, three: 540, cars: 700, vans: 480, buses: 790, cost: 23 }
  ],
  Weekly: [
    { label: "Week 1", two: 2800, three: 4300, cars: 5500, vans: 3700, buses: 5900, cost: 185 },
    { label: "Week 2", two: 2950, three: 4450, cars: 5700, vans: 3850, buses: 6100, cost: 192 },
    { label: "Week 3", two: 2700, three: 4100, cars: 5300, vans: 3600, buses: 5650, cost: 178 },
    { label: "Week 4", two: 3100, three: 4650, cars: 6000, vans: 4050, buses: 6400, cost: 205 }
  ],
  Monthly: [
    { label: "May", two: 11200, three: 16800, cars: 22000, vans: 14800, buses: 23600, cost: 720 },
    { label: "Jun", two: 11800, three: 17400, cars: 22800, vans: 15300, buses: 24200, cost: 745 },
    { label: "Jul", two: 12100, three: 18100, cars: 23500, vans: 15900, buses: 25100, cost: 770 },
    { label: "Aug", two: 11600, three: 17700, cars: 23100, vans: 15600, buses: 24700, cost: 758 },
    { label: "Sep", two: 12500, three: 18600, cars: 24200, vans: 16400, buses: 25900, cost: 795 },
    { label: "Oct", two: 13200, three: 19400, cars: 25100, vans: 17100, buses: 27000, cost: 830 }
  ]
};

const efficiency = [
  { vehicle: "Two-wheelers", value: 42.8 },
  { vehicle: "Three-wheelers", value: 10.6 },
  { vehicle: "Cars", value: 6.4 },
  { vehicle: "Vans", value: 4.2 },
  { vehicle: "Buses", value: 1.1 }
];

const categoryColors = {
  two: "#542333",
  three: "#66847E",
  cars: "#AC845E",
  vans: "#92A3A0",
  buses: "#B7A18A"
};

const formatNumber = value => Number(value).toLocaleString("en-IN");

function Metric({ icon: Icon, label, value, unit, note }) {
  return (
    <article className="ep-metric">
      <div className="ep-metric-top">
        <span>{label}</span>
        <Icon size={18} />
      </div>
      <div className="ep-metric-value">{value}<small>{unit}</small></div>
      <div className="ep-metric-note">{note}</div>
    </article>
  );
}

export default function EnergyPerformance() {
  const [period, setPeriod] = useState("Daily");
  const chartData = periods[period];

  const totalEnergy = useMemo(
    () => chartData.reduce((sum, item) =>
      sum + item.two + item.three + item.cars + item.vans + item.buses, 0),
    [chartData]
  );

  const averageCost = Math.round(
    chartData.reduce((sum, item) => sum + item.cost, 0) / chartData.length
  );

  return (
    <section className="ep-page">
      <div className="ep-heading">
        <div>
          <div className="ep-eyebrow">05 / OPERATIONAL ANALYTICS</div>
          <h1>Energy <em>performance</em></h1>
          <p>Understand fleet energy consumption, charging expenditure and vehicle efficiency.</p>
        </div>
        <div className="ep-demo-label">DEMONSTRATION DATA</div>
      </div>

      <div className="ep-period-row">
        <span><CalendarDays size={16} /> ANALYSIS PERIOD</span>
        <div className="ep-period-tabs">
          {Object.keys(periods).map(item => (
            <button
              key={item}
              className={period === item ? "active" : ""}
              onClick={() => setPeriod(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="ep-metrics">
        <Metric
          icon={Zap}
          label="Total energy consumed"
          value={formatNumber(totalEnergy)}
          unit=" kWh"
          note={`Across ${chartData.length} ${period.toLowerCase()} periods`}
        />
        <Metric
          icon={IndianRupee}
          label="Average charging cost"
          value={`₹${averageCost}`}
          unit="K"
          note="Average per selected period"
        />
        <Metric
          icon={Gauge}
          label="Fleet energy efficiency"
          value="8.6"
          unit=" km/kWh"
          note="Illustrative fleet average"
        />
        <Metric
          icon={TrendingDown}
          label="Energy optimisation"
          value="7.4"
          unit="%"
          note="Illustrative improvement opportunity"
        />
      </div>

      <div className="ep-chart-grid">
        <article className="ep-panel ep-main-chart">
          <div className="ep-panel-heading">
            <div>
              <span className="ep-kicker">ENERGY & EXPENDITURE</span>
              <h2>Energy by vehicle category</h2>
              <p>Consumption compared with charging cost</p>
            </div>
            <span className="ep-unit">kWh / ₹ thousand</span>
          </div>

          <div className="ep-chart">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 12, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid stroke="#E8E0D4" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#81776D", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="energy" tick={{ fill: "#81776D", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="cost" orientation="right" tick={{ fill: "#81776D", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#FBF8F1", border: "1px solid #D8CFC0", borderRadius: 10, color: "#302923" }}
                  formatter={(value, name) => [
                    name === "Charging cost" ? `₹${value}K` : `${formatNumber(value)} kWh`,
                    name
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                <Bar yAxisId="energy" dataKey="two" name="Two-wheelers" stackId="energy" fill={categoryColors.two} />
                <Bar yAxisId="energy" dataKey="three" name="Three-wheelers" stackId="energy" fill={categoryColors.three} />
                <Bar yAxisId="energy" dataKey="cars" name="Cars" stackId="energy" fill={categoryColors.cars} />
                <Bar yAxisId="energy" dataKey="vans" name="Vans" stackId="energy" fill={categoryColors.vans} />
                <Bar yAxisId="energy" dataKey="buses" name="Buses" stackId="energy" fill={categoryColors.buses} />
                <Line yAxisId="cost" type="monotone" dataKey="cost" name="Charging cost" stroke="#302923" strokeWidth={2.5} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="ep-chart-foot">Select Daily, Weekly or Monthly to compare the demonstration dataset.</div>
        </article>

        <article className="ep-panel ep-efficiency-panel">
          <div className="ep-panel-heading">
            <div>
              <span className="ep-kicker">VEHICLE EFFICIENCY</span>
              <h2>Efficiency by category</h2>
              <p>Illustrative average distance per unit of energy</p>
            </div>
          </div>

          <div className="ep-chart ep-efficiency-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={efficiency} layout="vertical" margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                <CartesianGrid stroke="#E8E0D4" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#81776D", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="vehicle" width={100} tick={{ fill: "#81776D", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#FBF8F1", border: "1px solid #D8CFC0", borderRadius: 10 }}
                  formatter={value => [`${value} km/kWh`, "Efficiency"]}
                />
                <Bar dataKey="value" name="Efficiency" fill="#66847E" radius={[0, 5, 5, 0]} barSize={19} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="ep-chart-foot">Efficiency values are sample figures, not measured vehicle telemetry.</div>
        </article>
      </div>

      <article className="ep-panel ep-table-panel">
        <div className="ep-panel-heading">
          <div>
            <span className="ep-kicker">CATEGORY BREAKDOWN</span>
            <h2>Energy consumption summary</h2>
            <p>Selected period: {period}</p>
          </div>
        </div>
        <div className="ep-table-wrap">
          <table className="ep-table">
            <thead>
              <tr>
                <th>Vehicle category</th>
                <th>Energy consumed</th>
                <th>Share of total</th>
                <th>Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Two-wheelers", "two", "42.8"],
                ["Three-wheelers", "three", "10.6"],
                ["Cars", "cars", "6.4"],
                ["Vans", "vans", "4.2"],
                ["Buses", "buses", "1.1"]
              ].map(([name, key, rate]) => {
                const amount = chartData.reduce((sum, item) => sum + item[key], 0);
                return (
                  <tr key={key}>
                    <td><span className="ep-dot" style={{ background: categoryColors[key] }} />{name}</td>
                    <td>{formatNumber(amount)} kWh</td>
                    <td>{(amount / totalEnergy * 100).toFixed(1)}%</td>
                    <td>{rate} km/kWh</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>

      <div className="ep-note">
        <Zap size={16} />
        <span><strong>Data note:</strong> This screen currently uses illustrative sample data for frontend demonstration. Actual energy, cost and efficiency figures will be connected to available backend records in the integration phase.</span>
      </div>
    </section>
  );
}
