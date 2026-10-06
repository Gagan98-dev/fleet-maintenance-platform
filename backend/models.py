from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
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