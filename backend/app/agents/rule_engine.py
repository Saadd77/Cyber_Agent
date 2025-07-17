from typing import Dict, Any, List, Optional
import re
import requests
import socket
import subprocess
import platform
from urllib.parse import urlparse
from .mitre_rules import MITREFramework

class RuleBasedEngine:
    """Core rule-based cybersecurity assessment engine"""
    
    @staticmethod
    def check_network_security(target_ip: str, port_range: str = "1-1000") -> Dict[str, Any]:
        """Comprehensive network security assessment using MITRE framework"""
        results = {
            "target": target_ip,
            "scan_type": "network_security",
            "open_ports": [],
            "services": {},
            "vulnerabilities": [],
            "mitre_analysis": {},
            "os_detection": {},
            "security_findings": [],
            "confidence": 0.9
        }
        
        # Parse port range
        start_port, end_port = map(int, port_range.split('-'))
        
        # Port scanning with timeout
        print(f"Scanning ports {start_port}-{end_port} on {target_ip}...")
        for port in range(start_port, min(end_port + 1, 1001)):  # Limit to 1000 ports max
            if RuleBasedEngine._check_port(target_ip, port):
                results["open_ports"].append(port)
                
                # Service identification
                service_info = MITREFramework.check_service_vulnerabilities(port)
                results["services"][str(port)] = service_info
                
                # Add vulnerability findings
                if service_info.get("common_vulns"):
                    results["vulnerabilities"].extend([
                        {
                            "port": port,
                            "service": service_info["service"],
                            "vulnerability": vuln,
                            "severity": RuleBasedEngine._assess_vulnerability_severity(port, vuln)
                        }
                        for vuln in service_info["common_vulns"]
                    ])
        
        # MITRE ATT&CK analysis
        results["mitre_analysis"] = MITREFramework.check_network_discovery_techniques(
            target_ip, results["open_ports"]
        )
        
        # OS Detection
        results["os_detection"] = RuleBasedEngine._detect_operating_system(target_ip)
        
        # Security findings summary
        results["security_findings"] = RuleBasedEngine._generate_security_findings(results)
        
        # Overall risk score
        results["risk_score"] = RuleBasedEngine._calculate_network_risk_score(results)
        
        return results
    
    @staticmethod
    def _check_port(ip: str, port: int, timeout: float = 1.0) -> bool:
        """Check if a specific port is open"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(timeout)
            result = sock.connect_ex((ip, port))
            sock.close()
            return result == 0
        except:
            return False
    
    @staticmethod
    def _detect_operating_system(target_ip: str) -> Dict[str, Any]:
        """Basic OS detection using TTL analysis"""
        os_info = {
            "detected_os": "Unknown",
            "confidence": 0.0,
            "method": "TTL Analysis",
            "details": {}
        }
        
        try:
            if platform.system().lower() == "windows":
                cmd = ["ping", "-n", "1", target_ip]
            else:
                cmd = ["ping", "-c", "1", target_ip]
                
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0:
                output = result.stdout.lower()
                
                # TTL-based OS detection
                ttl_match = re.search(r'ttl[=\s]+(\d+)', output)
                if ttl_match:
                    ttl = int(ttl_match.group(1))
                    os_info["details"]["ttl"] = ttl
                    
                    if ttl <= 64:
                        os_info["detected_os"] = "Linux/Unix"
                        os_info["confidence"] = 0.7
                    elif ttl <= 128:
                        os_info["detected_os"] = "Windows"
                        os_info["confidence"] = 0.7
                    elif ttl <= 255:
                        os_info["detected_os"] = "Network Device/Router"
                        os_info["confidence"] = 0.6
                        
        except Exception as e:
            os_info["error"] = str(e)
        
        return os_info
    
    @staticmethod
    def _assess_vulnerability_severity(port: int, vulnerability: str) -> str:
        """Assess vulnerability severity based on port and vulnerability type"""
        high_risk_ports = [21, 23, 135, 139, 445, 1433, 3306, 3389]
        critical_vulns = ["default credentials", "anonymous", "cleartext", "unencrypted"]
        
        if port in high_risk_ports:
            return "High"
        
        if any(critical in vulnerability.lower() for critical in critical_vulns):
            return "High"
        
        if port in [22, 80, 443]:
            return "Medium"
            
        return "Low"
    
    @staticmethod
    def _generate_security_findings(results: Dict[str, Any]) -> List[str]:
        """Generate human-readable security findings"""
        findings = []
        
        open_ports = results.get("open_ports", [])
        if len(open_ports) > 10:
            findings.append(f"High number of open ports detected ({len(open_ports)})")
        
        # Check for dangerous services
        dangerous_ports = {21: "FTP", 23: "Telnet", 135: "RPC", 139: "NetBIOS", 445: "SMB"}
        for port in open_ports:
            if port in dangerous_ports:
                findings.append(f"Potentially dangerous service detected: {dangerous_ports[port]} on port {port}")
        
        # Check MITRE findings
        mitre_analysis = results.get("mitre_analysis", {})
        if mitre_analysis.get("risk_assessment", {}).get("overall_risk") == "High":
            findings.append("High-risk MITRE ATT&CK techniques detected")
        
        return findings
    
    @staticmethod
    def _calculate_network_risk_score(results: Dict[str, Any]) -> int:
        """Calculate overall network risk score (0-100)"""
        score = 0
        
        # Base score from number of open ports
        open_ports = len(results.get("open_ports", []))
        score += min(open_ports * 5, 30)
        
        # High-risk services
        high_risk_ports = [21, 23, 135, 139, 445, 1433, 3306, 3389]
        high_risk_count = len([p for p in results.get("open_ports", []) if p in high_risk_ports])
        score += high_risk_count * 15
        
        # MITRE risk assessment
        mitre_risk = results.get("mitre_analysis", {}).get("risk_assessment", {})
        if mitre_risk.get("overall_risk") == "High":
            score += 25
        elif mitre_risk.get("overall_risk") == "Medium":
            score += 15
        
        # Vulnerability count
        vuln_count = len(results.get("vulnerabilities", []))
        score += min(vuln_count * 3, 20)
        
        return min(score, 100)
    
    @staticmethod
    def check_web_classification(url: str) -> Dict[str, Any]:
        """Placeholder for web classification - to be implemented"""
        return {
            "url": url,
            "classification": "pending",
            "confidence": 0.0,
            "message": "Web classification rules to be implemented",
            "indicators": [],
            "recommendations": ["Implement web classification rules"]
        }
    
    @staticmethod
    def check_web_vulnerabilities(url: str) -> Dict[str, Any]:
        """Placeholder for web penetration testing - to be implemented"""
        return {
            "url": url,
            "vulnerabilities": [],
            "confidence": 0.0,
            "message": "Web penetration testing rules to be implemented", 
            "security_headers": {},
            "recommendations": ["Implement web vulnerability assessment rules"]
        }