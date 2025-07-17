from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    project_type: str  # 'network', 'web', 'mobile', 'api'
    status: str = "active"
    target_count: int = 0

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    target_count: Optional[int] = None

class ProjectResponse(ProjectBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_accessed: datetime
    
    class Config:
        from_attributes = True