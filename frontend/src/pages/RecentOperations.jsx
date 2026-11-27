import { useMemo, useState } from 'react';
import {
  Activity,
  Truck,
  BatteryCharging,
  Wrench,
  RotateCcw,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  MapPin,
  Search,
  CalendarDays,
  ArrowUpRight,
} from 'lucide-react';

import './RecentOperations.css';

const operations = [
  {
    id: 1,
    type: 'Dispatch',
    vehicle: 'EV-204',
    name: 'Electric Delivery Van',
    description: 'Vehicle dispatched for scheduled delivery route.',
    location: 'Indiranagar, Bengaluru',
    time: '09:15 AM',
    date: 'Today',
    status: 'Completed',
  },
  {
    id: 2,
    type: 'Charging',
    vehicle: 'EV-118',
    name: 'Electric Sedan',
    description: 'Battery charging session started successfully.',
    location: 'Central Charging Hub',
    time: '09:42 AM',
    date: 'Today',
    status: 'In Progress',
  },
  {
    id: 3,
    type: 'Maintenance',
    vehicle: 'EV-092',
    name: 'Electric Three Wheeler',
    description: 'Brake inspection flagged for technician review.',
    location: 'Service Centre - Whitefield',
    time: '10:05 AM',
    date: 'Today',
    status: 'Attention Required',
  },
  {
    id: 4,
    type: 'Return',
    vehicle: 'EV-156',
    name: 'Electric Delivery Bike',
    description: 'Vehicle returned after completing assigned route.',
    location: 'Fleet Depot - Hebbal',
    time: '10:30 AM',
    date: 'Today',
    status: 'Completed',
  },
  {
    id: 5,
    type: 'Charging',
    vehicle: 'EV-221',
    name: 'Electric Cargo Van',
    description: 'Battery reached 85% charge level.',
    location: 'North Charging Station',
    time: '11:10 AM',
    date: 'Today',
    status: 'Completed',
  },
  {
    id: 6,
    type: 'Dispatch',
    vehicle: 'EV-173',
    name: 'Electric Passenger Vehicle',
    description: 'Driver assignment confirmed and route initiated.',
    location: 'Electronic City, Bengaluru',
    time: '11:35 AM',
    date: 'Today',
    status: 'In Progress',
  },
  {
    id: 7,
    type: 'Maintenance',
    vehicle: 'EV-087',
    name: 'Electric Delivery Van',
    description: 'Routine battery health inspection completed.',
    location: 'Service Centre - Yelahanka',
    time: 'Yesterday, 04:20 PM',
    date: 'Yesterday',
    status: 'Completed',
  },
  {
    id: 8,
    type: 'Return',
    vehicle: 'EV-142',
    name: 'Electric Sedan',
    description: 'Vehicle returned with low remaining battery level.',
    location: 'Fleet Depot - Koramangala',
    time: 'Yesterday, 05:15 PM',
    date: 'Yesterday',
    status: 'Attention Required',
  },
];

const getOperationIcon = (type) => {
  switch (type) {
    case 'Dispatch':
      return Truck;
    case 'Charging':
      return BatteryCharging;
    case 'Maintenance':
      return Wrench;
    case 'Return':
      return RotateCcw;
    default:
      return Activity;
  }
};

function RecentOperations() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filters = [
    'All',
    'Dispatch',
    'Charging',
    'Maintenance',
    'Return',
  ];

  const filteredOperations = useMemo(() => {
    return operations.filter((operation) => {
      const matchesFilter =
        activeFilter === 'All' || operation.type === activeFilter;

      const searchText = searchTerm.toLowerCase();

      const matchesSearch =
        operation.vehicle.toLowerCase().includes(searchText) ||
        operation.name.toLowerCase().includes(searchText) ||
        operation.description.toLowerCase().includes(searchText) ||
        operation.location.toLowerCase().includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchTerm]);

  const completedCount = operations.filter(
    (item) => item.status === 'Completed'
  ).length;

  const progressCount = operations.filter(
    (item) => item.status === 'In Progress'
  ).length;

  const attentionCount = operations.filter(
    (item) => item.status === 'Attention Required'
  ).length;

  const summaryCards = [
    {
      label: 'Total Activities',
      value: operations.length,
      detail: 'Recorded operations',
      icon: Activity,
      className: 'ro-card-burgundy',
    },
    {
      label: 'Completed',
      value: completedCount,
      detail: 'Successfully completed',
      icon: CheckCircle2,
      className: 'ro-card-sage',
    },
    {
      label: 'In Progress',
      value: progressCount,
      detail: 'Currently ongoing',
      icon: Clock3,
      className: 'ro-card-tan',
    },
    {
      label: 'Attention Required',
      value: attentionCount,
      detail: 'Needs review',
      icon: AlertTriangle,
      className: 'ro-card-red',
    },
  ];

  return (
    <main className="recent-operations-page">

      {/* PAGE HEADER */}
      <header className="ro-heading">
        <div>
          <div className="ro-eyebrow">
            08 / FLEET ACTIVITY
          </div>

          <h1>
            Recent <em>Operations</em>
          </h1>

          <p>
            Monitor fleet dispatches, charging sessions, maintenance
            activities and vehicle returns from one place.
          </p>
        </div>

        <div className="ro-demo-label">
          <span className="ro-live-dot"></span>
          DEMONSTRATION DATA
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <section className="ro-summary-grid">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article className={`ro-summary-card ${card.className}`} key={card.label}>
              <div className="ro-summary-top">
                <span>{card.label}</span>
                <Icon size={19} strokeWidth={1.8} />
              </div>

              <div className="ro-summary-value">
                {card.value.toString().padStart(2, '0')}
              </div>

              <div className="ro-summary-detail">
                {card.detail}
              </div>
            </article>
          );
        })}
      </section>

      {/* MAIN CONTENT */}
      <section className="ro-content-grid">

        <div className="ro-activity-panel">

          <div className="ro-panel-heading">
            <div>
              <div className="ro-section-label">
                OPERATIONAL LOG
              </div>

              <h2>Activity <em>Timeline</em></h2>

              <p>Latest recorded fleet activities</p>
            </div>

            <div className="ro-date-label">
              <CalendarDays size={15} />
              Recent activity
            </div>
          </div>

          {/* FILTERS */}
          <div className="ro-toolbar">
            <div className="ro-filter-list">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`ro-filter-btn ${
                    activeFilter === filter ? 'active' : ''
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="ro-search-box">
              <Search size={16} />

              <input
                type="text"
                placeholder="Search activity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* ACTIVITY LIST */}
          <div className="ro-activity-list">

            {filteredOperations.length > 0 ? (
              filteredOperations.map((operation) => {
                const Icon = getOperationIcon(operation.type);

                return (
                  <article className="ro-activity-item" key={operation.id}>

                    <div className={`ro-activity-icon ro-icon-${operation.type.toLowerCase()}`}>
                      <Icon size={19} strokeWidth={1.8} />
                    </div>

                    <div className="ro-activity-main">

                      <div className="ro-activity-top">
                        <div>
                          <span className="ro-activity-type">
                            {operation.type}
                          </span>

                          <h3>{operation.vehicle}</h3>
                        </div>

                        <span className={`ro-status ro-status-${operation.status
                          .toLowerCase()
                          .replaceAll(' ', '-')}`}>
                          {operation.status}
                        </span>
                      </div>

                      <p className="ro-activity-description">
                        {operation.description}
                      </p>

                      <div className="ro-activity-meta">
                        <span>
                          <Truck size={13} />
                          {operation.name}
                        </span>

                        <span>
                          <MapPin size={13} />
                          {operation.location}
                        </span>

                        <span>
                          <Clock3 size={13} />
                          {operation.time}
                        </span>
                      </div>

                    </div>

                    <ArrowUpRight
                      className="ro-activity-arrow"
                      size={17}
                    />

                  </article>
                );
              })
            ) : (
              <div className="ro-empty-state">
                <Search size={25} />
                <h3>No activities found</h3>
                <p>Try another search term or activity filter.</p>
              </div>
            )}

          </div>

          <div className="ro-list-footer">
            Showing {filteredOperations.length} of {operations.length} recorded activities
          </div>

        </div>

        {/* RIGHT PANEL */}
        <aside className="ro-side-panel">

          <div className="ro-side-card ro-overview-card">
            <div className="ro-section-label">
              FLEET OVERVIEW
            </div>

            <h2>Today's <em>Summary</em></h2>

            <p className="ro-side-description">
              Overview of the latest recorded operational activity.
            </p>

            <div className="ro-overview-row">
              <div className="ro-overview-icon ro-overview-completed">
                <CheckCircle2 size={17} />
              </div>

              <div>
                <strong>Completed</strong>
                <span>Successfully finished</span>
              </div>

              <b>{completedCount}</b>
            </div>

            <div className="ro-overview-row">
              <div className="ro-overview-icon ro-overview-progress">
                <Clock3 size={17} />
              </div>

              <div>
                <strong>In Progress</strong>
                <span>Ongoing operations</span>
              </div>

              <b>{progressCount}</b>
            </div>

            <div className="ro-overview-row">
              <div className="ro-overview-icon ro-overview-attention">
                <AlertTriangle size={17} />
              </div>

              <div>
                <strong>Needs Attention</strong>
                <span>Requires follow-up</span>
              </div>

              <b>{attentionCount}</b>
            </div>

          </div>

          <div className="ro-side-card ro-insight-card">
            <div className="ro-insight-icon">
              <Activity size={20} />
            </div>

            <div className="ro-section-label">
              OPERATIONAL INSIGHT
            </div>

            <h3>Keep operations moving.</h3>

            <p>
              Regularly reviewing dispatch, charging and maintenance
              activities helps improve fleet availability and operational
              efficiency.
            </p>
          </div>

          <div className="ro-side-note">
            <span>DATA SOURCE</span>
            <p>
              Sample operational records are displayed for frontend
              demonstration. Live backend integration will be added later.
            </p>
          </div>

        </aside>

      </section>

    </main>
  );
}

export default RecentOperations;