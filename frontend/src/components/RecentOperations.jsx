
import React from 'react';
import './FleetModules.css';

function RecentOperations() {

  // Sample frontend data
  const operations = [
    {
      time: '14:28',
      title: 'Vehicle Assigned',
      vehicle: 'EV-012',
      description: 'Vehicle assigned to a driver',
      type: 'assignment',
      status: 'Completed'
    },
    {
      time: '14:16',
      title: 'Charging Completed',
      vehicle: 'EV-045',
      description: 'Charging session completed - 41 kWh',
      type: 'charging',
      status: 'Completed'
    },
    {
      time: '13:52',
      title: 'Battery Alert',
      vehicle: 'EV-140',
      description: 'Battery level dropped below 20%',
      type: 'alert',
      status: 'Warning'
    },
    {
      time: '13:31',
      title: 'Maintenance Update',
      vehicle: 'EV-003',
      description: 'Scheduled maintenance recorded',
      type: 'maintenance',
      status: 'Completed'
    },
    {
      time: '13:05',
      title: 'Vehicle Status Updated',
      vehicle: 'EV-088',
      description: 'Vehicle status changed to Available',
      type: 'status',
      status: 'Completed'
    }
  ];

  const shiftSummary = [
    { label: 'Vehicle Assignments', completed: 142, total: 160 },
    { label: 'Charging Sessions', completed: 146, total: 180 },
    { label: 'Work Orders', completed: 11, total: 16 },
    { label: 'Alerts Resolved', completed: 23, total: 27 }
  ];

  return (
    <div className="fleet-module">

      <div className="module-heading">
        <div>
          <h2>Recent Operations</h2>
          <p>Monitor the latest fleet activities and updates</p>
        </div>

        <span className="demo-label">Demo Data</span>
      </div>

      {/* Operations timeline */}
      <section className="util-panel">
        <h3>Recent Activity Timeline</h3>

        <div className="operations-list">

          {operations.map((operation, index) => (
            <div className="operation-item" key={index}>

              <div className={`operation-icon ${operation.type}`}>
                {operation.type === 'assignment' && '↗'}
                {operation.type === 'charging' && '⚡'}
                {operation.type === 'alert' && '⚠'}
                {operation.type === 'maintenance' && '🔧'}
                {operation.type === 'status' && '✓'}
              </div>

              <div className="operation-details">
                <div className="operation-title">
                  <h4>{operation.title}</h4>
                  <span>{operation.time}</span>
                </div>

                <p>{operation.description}</p>

                <div className="operation-footer">
                  <strong>{operation.vehicle}</strong>

                  <span className={
                    operation.status === 'Warning'
                      ? 'warning-status'
                      : 'completed-status'
                  }>
                    {operation.status}
                  </span>
                </div>
              </div>

            </div>
          ))}

        </div>
      </section>

      {/* Shift summary */}
      <section className="util-panel">
        <h3>Shift Summary</h3>

        <div className="shift-grid">

          {shiftSummary.map((item) => {
            const percentage = Math.round(
              (item.completed / item.total) * 100
            );

            return (
              <div className="shift-card" key={item.label}>

                <p>{item.label}</p>

                <h2>
                  {item.completed}
                  <span> / {item.total}</span>
                </h2>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <small>{percentage}% completed</small>

              </div>
            );
          })}

        </div>
      </section>

    </div>
  );
}

export default RecentOperations;
