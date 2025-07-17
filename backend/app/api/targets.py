from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.user import User
from ..models.project import Project
from ..models.target import Target
from ..schemas.target import TargetCreate, TargetUpdate, TargetResponse
from .auth import get_current_user

router = APIRouter(prefix="/targets", tags=["targets"])

@router.get("/project/{project_id}", response_model=List[TargetResponse])
async def get_project_targets(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify project ownership
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    targets = db.query(Target).filter(Target.project_id == project_id).all()
    return [TargetResponse.model_validate(target) for target in targets]

@router.post("/", response_model=TargetResponse)
async def create_target(
    target_data: TargetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify project ownership
    project = db.query(Project).filter(
        Project.id == target_data.project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    target = Target(**target_data.model_dump())
    db.add(target)
    
    # Update project target count
    project.target_count = db.query(Target).filter(Target.project_id == project.id).count() + 1
    
    db.commit()
    db.refresh(target)
    
    return TargetResponse.model_validate(target)