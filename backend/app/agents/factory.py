from typing import Dict, Any, Optional
from .base import BaseAgent, AgentType
from .web_classifier import WebClassifierAgent
from .web_pentester import WebPentesterAgent
from .network_scanner import NetworkScannerAgent

class AgentFactory:
    """Factory for creating and managing AI agents"""
    
    @staticmethod
    def create_agent(agent_type: str, engine_type: str = "rule_based") -> Optional[BaseAgent]:
        """Create an agent instance based on type"""
        
        # Convert string parameter to enum
        try:
            agent_enum = AgentType(agent_type)
        except ValueError as e:
            raise ValueError(f"Invalid agent type: {e}")
        
        # Create appropriate agent (engine_type is ignored for now, kept for API compatibility)
        if agent_enum == AgentType.WEB_CLASSIFIER:
            return WebClassifierAgent()
        elif agent_enum == AgentType.WEB_PENTESTER:
            return WebPentesterAgent()
        elif agent_enum == AgentType.NETWORK_SCANNER:
            return NetworkScannerAgent()
        else:
            raise ValueError(f"Unsupported agent type: {agent_type}")
    
    @staticmethod
    def get_available_agents() -> Dict[str, Any]:
        """Get list of available agents and their capabilities"""
        return {
            "agents": [
                {
                    "type": "web_classifier",
                    "name": "Website Classification Agent",
                    "description": "Analyzes websites for phishing and malicious content",
                    "engine": "ai_based",  # Will be implemented later
                    "target_types": ["url"],
                    "status": "development"
                },
                {
                    "type": "web_pentester", 
                    "name": "Web Penetration Testing Agent",
                    "description": "Tests web applications for security vulnerabilities",
                    "engine": "ai_based",  # Will be implemented later
                    "target_types": ["url"],
                    "status": "development"
                },
                {
                    "type": "network_scanner",
                    "name": "Network Security Scanner",
                    "description": "Scans network infrastructure for security issues",
                    "engine": "rule_based",
                    "target_types": ["ip", "hostname"],
                    "status": "active"
                }
            ]
        }