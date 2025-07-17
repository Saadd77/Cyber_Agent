from typing import Dict, Any, List
import socket
import ipaddress
from .base import BaseAgent, AgentType
from .rule_engine import RuleBasedEngine

class NetworkScannerAgent(BaseAgent):
    """Network security scanning agent with MITRE ATT&CK framework integration"""
    
    def __init__(self):
        super().__init__(AgentType.NETWORK_SCANNER)
    
    async def validate_target(self, target: str) -> bool:
        """Validate if target is a valid IP address or hostname"""
        try:
            # Try to resolve as IP address
            ipaddress.ip_address(target)
            return True
        except ValueError:
            # Try to resolve as hostname
            try:
                socket.gethostbyname(target)
                return True
            except socket.gaierror:
                return False
    
    async def execute(self, target: str, options: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute network security scanning"""
        if not await self.validate_target(target):
            return {"error": "Invalid target address"}
        
        # Default options
        if options is None:
            options = {}
        
        port_range = options.get("port_range", "1-1000")
        
        # Resolve hostname to IP if needed
        try:
            resolved_ip = socket.gethostbyname(target)
        except socket.gaierror:
            resolved_ip = target
        
        # Execute rule-based network scanning
        results = RuleBasedEngine.check_network_security(resolved_ip, port_range)
        
        # Add agent-specific metadata
        results.update({
            "original_target": target,
            "resolved_ip": resolved_ip,
            "scan_options": options,
            "agent_version": "1.0",
            "scan_methodology": "Rule-based with MITRE ATT&CK framework"
        })
        
        return self.format_results(results)
    
    def _generate_recommendations(self, results: Dict[str, Any]) -> List[str]:
        """Generate network security recommendations"""
        recommendations = []
        
        # Get MITRE-based recommendations
        mitre_recommendations = results.get("mitre_analysis", {}).get("defensive_recommendations", [])
        recommendations.extend(mitre_recommendations)
        
        # Port-specific recommendations
        open_ports = results.get("open_ports", [])
        if open_ports:
            recommendations.append(f"Review {len(open_ports)} open ports and close unnecessary services")
        
        # High-risk service recommendations
        high_risk_ports = {
            21: "Replace FTP with SFTP or secure alternatives",
            23: "Replace Telnet with SSH immediately", 
            135: "Disable RPC if not required, use firewall restrictions",
            139: "Disable NetBIOS or restrict access via firewall",
            445: "Secure SMB configuration, disable SMBv1",
            1433: "Secure SQL Server configuration, network isolation",
            3306: "Secure MySQL installation, restrict remote access",
            3389: "Secure RDP configuration, enable Network Level Authentication"
        }
        
        for port in open_ports:
            if port in high_risk_ports:
                recommendations.append(high_risk_ports[port])
        
        # General security recommendations
        recommendations.extend([
            "Implement network segmentation and micro-segmentation",
            "Deploy intrusion detection/prevention systems (IDS/IPS)",
            "Regular vulnerability assessments and penetration testing",
            "Monitor network traffic for anomalous behavior",
            "Implement zero-trust network architecture principles",
            "Regular security patches and updates for all systems",
            "Use strong authentication and access controls"
        ])
        
        # OS-specific recommendations
        os_info = results.get("os_detection", {})
        detected_os = os_info.get("detected_os", "Unknown")
        
        if "Windows" in detected_os:
            recommendations.extend([
                "Enable Windows Defender and keep definitions updated",
                "Regular Windows Updates and security patches",
                "Implement PowerShell execution policies"
            ])
        elif "Linux" in detected_os:
            recommendations.extend([
                "Keep Linux kernel and packages updated",
                "Configure iptables or other firewall solutions",
                "Implement SELinux or AppArmor policies"
            ])
        
        return recommendations