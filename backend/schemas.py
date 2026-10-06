from pydantic import BaseModel, Field

class VehicleCreate(BaseModel):
    vehicle_number: str = Field(min_length=1, max_length=20)
    model: str = Field(min_length=1, max_length=100)
    vehicle_type: str | None = None
    status: str = "Active"
class DriverCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    phone: str = Field(min_length=1, max_length=15)
    license_number: str = Field(min_length=1, max_length=30)
    status: str = "Active"

class VehicleAssign(BaseModel):
    driver_id: int

from datetime import datetime
from pydantic import BaseModel

class MaintenanceCreate(BaseModel):
    vehicle_id: int
    maintenance_type: str
    description: str
    cost: float
    maintenance_date: datetime
    status: str = "Pending"

class MaintenanceUpdate(BaseModel):
    vehicle_id: int
    maintenance_type: str
    description: str
    cost: float
    maintenance_date: datetime
    status: str