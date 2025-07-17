from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime
import uuid

class TargetBase(BaseModel):
    name: str
    target_url: Optional[str] = None
    target_ip: Optional[str] = None
    target_type: str  # 'website' or 'ip'
    status: str = "pending"

class TargetCreate(TargetBase):
    project_id: uuid.UUID
    
    @validator('target_url', 'target_ip')
    def validate_target(cls, v, values):
        target_type = values.get('target_type')
        if target_type == 'website' and not values.get('target_url'):
            raise ValueError('target_url is required for website targets')
        if target_type == 'ip' and not values.get('target_ip'):
            raise ValueError('target_ip is required for IP targets')
        return v

class TargetUpdate(BaseModel):
    name: Optional[str] = None
    target_url: Optional[str] = None
    target_ip: Optional[str] = None
    status: Optional[str] = None

class TargetResponse(TargetBase):
    id: uuid.UUID
    project_id: uuid.UUID
    created_at: datetime
    
    class Config:
        from_attributes = True