from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Dict, Any
import uuid
from datetime import datetime

from ..core.database import get_db
from ..models.user import User
from ..models.test_result import TestRun, TestResult
from ..agents.factory import AgentFactory
from .auth import get_current_user

router = APIRouter(prefix="/agents", tags=["agents"])

# Store for tracking running tests (in production, use Redis)
running_tests: Dict[str, Dict[str, Any]] = {}

@router.get("/available")
async def get_available_agents():
    """Get list of available agents"""
    return AgentFactory.get_available_agents()

@router.post("/execute")
async def execute_agent(
    agent_request: Dict[str, Any],
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Execute an agent against a target"""
    
    # Validate request
    required_fields = ["agent_type", "target", "project_id", "target_id"]
    for field in required_fields:
        if field not in agent_request:
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
    
    # Create test run record
    test_run = TestRun(
        project_id=agent_request["project_id"],
        target_id=agent_request["target_id"],
        agent_type=agent_request["agent_type"],
        engine_type="rule_based",  # Default to rule_based for now
        status="running"
    )
    
    db.add(test_run)
    db.commit()
    db.refresh(test_run)
    
    # Add to background tasks
    background_tasks.add_task(
        execute_agent_background,
        str(test_run.id),
        agent_request,
        db
    )
    
    return {
        "test_run_id": str(test_run.id),
        "status": "started",
        "message": "Agent execution started in background"
    }

async def execute_agent_background(test_run_id: str, agent_request: Dict[str, Any], db: Session):
    """Execute agent in background"""
    
    try:
        # Create agent (engine_type parameter removed since it's handled in factory)
        agent = AgentFactory.create_agent(agent_request["agent_type"])
        
        if not agent:
            raise Exception("Failed to create agent")
        
        # Execute agent
        results = await agent.execute(
            agent_request["target"],
            agent_request.get("options", {})
        )
        
        # Update test run
        test_run = db.query(TestRun).filter(TestRun.id == test_run_id).first()
        if test_run:
            test_run.status = "completed"
            test_run.completed_at = datetime.utcnow()
            test_run.duration_seconds = int((test_run.completed_at - test_run.started_at).total_seconds())
            
            # Create test results
            for result_type, result_data in results.get("results", {}).items():
                test_result = TestResult(
                    test_run_id=test_run.id,
                    result_type=result_type,
                    severity=result_data.get("severity", "info"),
                    confidence_score=results.get("confidence_score", 0.0),
                    title=f"{result_type.replace('_', ' ').title()} Result",
                    description=str(result_data),
                    raw_data=result_data
                )
                db.add(test_result)
            
            db.commit()
       
    except Exception as e:
        # Update test run with error
        test_run = db.query(TestRun).filter(TestRun.id == test_run_id).first()
        if test_run:
            test_run.status = "failed"
            test_run.completed_at = datetime.utcnow()
            
            # Create error result
            error_result = TestResult(
                test_run_id=test_run.id,
                result_type="error",
                severity="high",
                confidence_score=1.0,
                title="Agent Execution Error",
                description=str(e),
                raw_data={"error": str(e)}
            )
            db.add(error_result)
            db.commit()

@router.get("/status/{test_run_id}")
async def get_agent_status(
    test_run_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get status of running agent"""
    
    test_run = db.query(TestRun).filter(TestRun.id == test_run_id).first()
    if not test_run:
        raise HTTPException(status_code=404, detail="Test run not found")
    
    return {
        "test_run_id": str(test_run.id),
        "status": test_run.status,
        "agent_type": test_run.agent_type,
        "engine_type": test_run.engine_type,
        "started_at": test_run.started_at.isoformat(),
        "completed_at": test_run.completed_at.isoformat() if test_run.completed_at else None,
        "duration_seconds": test_run.duration_seconds
    }

@router.get("/results/{test_run_id}")
async def get_agent_results(
    test_run_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get results from completed agent execution"""
    
    test_run = db.query(TestRun).filter(TestRun.id == test_run_id).first()
    if not test_run:
        raise HTTPException(status_code=404, detail="Test run not found")
    
    results = db.query(TestResult).filter(TestResult.test_run_id == test_run.id).all()
    
    return {
        "test_run": {
            "id": str(test_run.id),
            "status": test_run.status,
            "agent_type": test_run.agent_type,
            "engine_type": test_run.engine_type,
            "started_at": test_run.started_at.isoformat(),
            "completed_at": test_run.completed_at.isoformat() if test_run.completed_at else None,
            "duration_seconds": test_run.duration_seconds
        },
        "results": [
            {
                "id": str(result.id),
                "result_type": result.result_type,
                "severity": result.severity,
                "confidence_score": float(result.confidence_score) if result.confidence_score else 0.0,
                "title": result.title,
                "description": result.description,
                "raw_data": result.raw_data,
                "created_at": result.created_at.isoformat()
            }
            for result in results
        ]
    }