from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from enum import Enum
import uuid
from datetime import datetime

class AgentType(Enum):
    WEB_CLASSIFIER = "web_classifier"
    WEB_PENTESTER = "web_pentester" 
    NETWORK_SCANNER = "network_scanner"

class BaseAgent(ABC):
    def __init__(self, agent_type: AgentType):
        self.agent_type = agent_type
        self.session_id = str(uuid.uuid4())
        self.engine_type = "rule_based"
        
    @abstractmethod
    async def validate_target(self, target: str) -> bool:
        """Validate if target is appropriate for this agent"""
        pass
    
    @abstractmethod
    async def execute(self, target: str, options: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute the agent against the target"""
        pass
    
    def format_results(self, raw_results: Dict[str, Any]) -> Dict[str, Any]:
        """Format results with confidence scores and recommendations"""
        return {
            "agent_type": self.agent_type.value,
            "engine_type": self.engine_type,
            "session_id": self.session_id,
            "timestamp": datetime.utcnow().isoformat(),
            "results": raw_results,
            "confidence_score": raw_results.get("confidence", 0.0),
            "recommendations": self._generate_recommendations(raw_results),
            "mitre_techniques": raw_results.get("mitre_techniques", [])
        }
    
    @abstractmethod
    def _generate_recommendations(self, results: Dict[str, Any]) -> List[str]:
        """Generate actionable recommendations based on results"""
        pass