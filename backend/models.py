from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base
from sqlalchemy.orm import relationship

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    driver = relationship("Driver", back_populates="vehicles")
    vehicle_number = Column(String(20), unique=True, nullable=False)
    model = Column(String(100), nullable=False)
    vehicle_type = Column(String(50))
    status = Column(String(20), default="Active")
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(15), unique=True, nullable=False)
    license_number = Column(String(30), unique=True, nullable=False)
    status = Column(String(20), default="Active")
    created_at = Column(DateTime, server_default=func.now())
    vehicles = relationship("Vehicle", back_populates="driver")