from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)

    vehicle_number = Column(String(20), unique=True, nullable=False)
    model = Column(String(100), nullable=False)
    vehicle_type = Column(String(50))
    status = Column(String(20), default="Active")

    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=True)

    created_at = Column(DateTime, server_default=func.now())

    driver = relationship(
        "Driver",
        back_populates="vehicles"
    )

    maintenance_records = relationship(
        "Maintenance",
        back_populates="vehicle"
    )


class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    phone = Column(String(15), unique=True, nullable=False)
    license_number = Column(String(30), unique=True, nullable=False)
    status = Column(String(20), default="Active")

    created_at = Column(DateTime, server_default=func.now())

    vehicles = relationship(
        "Vehicle",
        back_populates="driver"
    )


class Maintenance(Base):
    __tablename__ = "maintenance"

    id = Column(Integer, primary_key=True, index=True)

    vehicle_id = Column(
        Integer,
        ForeignKey("vehicles.id")
    )

    maintenance_type = Column(String)
    description = Column(String)
    cost = Column(Float)
    maintenance_date = Column(DateTime)
    status = Column(String, default="Pending")

    vehicle = relationship(
        "Vehicle",
        back_populates="maintenance_records"
    )


class BatteryPack(Base):
    """Latest battery telemetry for a vehicle (one row per vehicle)."""
    __tablename__ = "battery_packs"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(
        Integer,
        ForeignKey("vehicles.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    capacity_kwh = Column(Float, default=60.0)
    soc = Column(Float, nullable=False)                # state of charge, %
    soh = Column(Float, nullable=False)                # state of health, %
    avg_temp = Column(Float, nullable=False)           # deg C
    hottest_cell_temp = Column(Float, nullable=False)  # deg C
    cell_delta_mv = Column(Float, nullable=False)      # max cell voltage spread
    charge_cycles = Column(Integer, default=0)
    internal_resistance = Column(Float, default=0.0)   # milliohm

    # list of {"temp": float, "voltage_delta": float, "health": float}
    cells = Column(JSON, default=list)

    updated_at = Column(DateTime, server_default=func.now())

    vehicle = relationship("Vehicle")


class BatterySnapshot(Base):
    """Monthly SOH history used for the degradation chart."""
    __tablename__ = "battery_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(
        Integer,
        ForeignKey("vehicles.id", ondelete="CASCADE"),
        nullable=False
    )
    month = Column(String(7), nullable=False)  # "2026-03"
    soh = Column(Float, nullable=False)


class ChargingStation(Base):
    __tablename__ = "charging_stations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    charger_type = Column(String(10), nullable=False)  # "DC" or "AC"
    power_kw = Column(Float, nullable=False)
    total_ports = Column(Integer, nullable=False)

    sessions = relationship("ChargingSession", back_populates="station")


class ChargingSession(Base):
    __tablename__ = "charging_sessions"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(
        Integer,
        ForeignKey("vehicles.id", ondelete="CASCADE"),
        nullable=False
    )
    station_id = Column(
        Integer,
        ForeignKey("charging_stations.id"),
        nullable=False
    )

    status = Column(String(20), default="In Progress")  # or "Completed"
    start_soc = Column(Float, nullable=False)
    current_soc = Column(Float, nullable=False)
    target_soc = Column(Float, default=80.0)
    power_kw = Column(Float, nullable=False)
    energy_kwh = Column(Float, default=0.0)
    cost = Column(Float, default=0.0)

    started_at = Column(DateTime, nullable=False)
    ended_at = Column(DateTime, nullable=True)

    vehicle = relationship("Vehicle")
    station = relationship("ChargingStation", back_populates="sessions")
