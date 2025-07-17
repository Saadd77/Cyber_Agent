from sqlalchemy import Column, String, Text, Integer, ForeignKey, DateTime, Numeric
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from ..core.database import Base

class TestRun(Base):
    __tablename__ = "test_runs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    target_id = Column(UUID(as_uuid=True), ForeignKey("targets.id", ondelete="CASCADE"), nullable=False)
    agent_type = Column(String(50), nullable=False)  # 'web_classifier', 'web_pentester', 'network_scanner'
    engine_type = Column(String(50), nullable=False)  # 'rule_based', 'ml'
    status = Column(String(50), default="running")  # 'running', 'completed', 'failed'
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    duration_seconds = Column(Integer)
    
    # Relationships
    project = relationship("Project", back_populates="test_runs")
    target = relationship("Target", back_populates="test_runs")
    results = relationship("TestResult", back_populates="test_run", cascade="all, delete-orphan")

class TestResult(Base):
    __tablename__ = "test_results"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    test_run_id = Column(UUID(as_uuid=True), ForeignKey("test_runs.id", ondelete="CASCADE"), nullable=False)
    result_type = Column(String(50), nullable=False)
    severity = Column(String(20))  # 'info', 'low', 'medium', 'high', 'critical'
    confidence_score = Column(Numeric(3, 2))  # 0.00 to 1.00
    title = Column(String(255), nullable=False)
    description = Column(Text)
    raw_data = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    test_run = relationship("TestRun", back_populates="results")