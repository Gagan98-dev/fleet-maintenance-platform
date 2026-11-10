
from datetime import datetime
from pydantic import BaseModel, Field


# VEHICLE
class VehicleCreate(BaseModel):
    vehicle_number: str = Field(min_length=1, max_length=20)
    model: str = Field(min_length=1, max_length=100)
    vehicle_type: str | None = None
    status: str = "Active"


# DRIVER
class DriverCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    phone: str = Field(min_length=1, max_length=15)
    license_number: str = Field(min_length=1, max_length=30)
    status: str = "Active"


# ASSIGN DRIVER
class VehicleAssign(BaseModel):
    driver_id: int


# MAINTENANCE
class MaintenanceCreate(BaseModel):
    vehicle_id: int
    maintenance_type: str = Field(min_length=1)
    description: str = Field(min_length=1)
    cost: float = Field(ge=0)
    maintenance_date: datetime
    status: str = "Pending"


class MaintenanceUpdate(BaseModel):
    vehicle_id: int
    maintenance_type: str = Field(min_length=1)
    description: str = Field(min_length=1)
    cost: float = Field(ge=0)
    maintenance_date: datetime
    status: str
