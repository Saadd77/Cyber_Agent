from typing import Dict, Any, List
import socket
import subprocess
import platform
import re

class MITREFramework:
    """MITRE ATT&CK Framework rules for cybersecurity assessment"""
    
    # MITRE ATT&CK Techniques relevant to network reconnaissance
    MITRE_TECHNIQUES = {
        "T1046": {
            "name": "Network Service Scanning",
            "description": "Adversaries may attempt to get a listing of services running on remote hosts",
            "tactics": ["Discovery"],
            "detection": "Monitor for port scanning activities"
        },
        "T1040": {
            "name": "Network Sniffing", 
            "description": "Adversaries may sniff network traffic to capture information",
            "tactics": ["Discovery", "Credential Access"],
            "detection": "Monitor for promiscuous mode on network interfaces"
        },
        "T1018": {
            "name": "Remote System Discovery",
            "description": "Adversaries may attempt to get a listing of other systems",
            "tactics": ["Discovery"],
            "detection": "Monitor for network discovery commands"
        },
        "T1082": {
            "name": "System Information Discovery",
            "description": "Adversaries may attempt to get detailed information about the OS and hardware",
            "tactics": ["Discovery"],
            "detection": "Monitor for system information gathering commands"
        },
        "T1021.001": {
            "name": "Remote Desktop Protocol",
            "description": "Adversaries may use Valid Accounts to log into a computer using RDP",
            "tactics": ["Lateral Movement"],
            "detection": "Monitor RDP logon events"
        },
        "T1021.004": {
            "name": "SSH",
            "description": "Adversaries may use Valid Accounts to log into remote machines using SSH",
            "tactics": ["Lateral Movement"],
            "detection": "Monitor SSH connection attempts"
        },
        "T1190": {
            "name": "Exploit Public-Facing Application",
            "description": "Adversaries may attempt to take advantage of a weakness in an Internet-facing computer",
            "tactics": ["Initial Access"],
            "detection": "Monitor for suspicious web requests"
        }
    }
    
    @classmethod
    def check_network_discovery_techniques(cls, target_ip: str, open_ports: List[int]) -> Dict[str, Any]:
        """Check for MITRE ATT&CK network discovery techniques"""
        mitre_findings = {
            "techniques_detected": [],
            "risk_assessment": {},
            "defensive_recommendations": []
        }
        
        # T1046 - Network Service Scanning (what we're doing)
        if open_ports:
            mitre_findings["techniques_detected"].append({
                "technique_id": "T1046",
                "technique_name": "Network Service Scanning",
                "evidence": f"Detected {len(open_ports)} open ports on target",
                "ports": open_ports,
                "risk_level": "Medium"
            })
            
        # T1021.001 - RDP Detection
        if 3389 in open_ports:
            mitre_findings["techniques_detected"].append({
                "technique_id": "T1021.001", 
                "technique_name": "Remote Desktop Protocol",
                "evidence": "RDP service detected on port 3389",
                "risk_level": "High",
                "description": "RDP can be used for lateral movement if compromised"
            })
            
        # T1021.004 - SSH Detection  
        if 22 in open_ports:
            mitre_findings["techniques_detected"].append({
                "technique_id": "T1021.004",
                "technique_name": "SSH",
                "evidence": "SSH service detected on port 22", 
                "risk_level": "Medium",
                "description": "SSH can be used for lateral movement with valid credentials"
            })
            
        # T1190 - Public-Facing Applications
        web_ports = [80, 443, 8080, 8443]
        detected_web_ports = [port for port in open_ports if port in web_ports]
        if detected_web_ports:
            mitre_findings["techniques_detected"].append({
                "technique_id": "T1190",
                "technique_name": "Exploit Public-Facing Application",
                "evidence": f"Web services detected on ports: {detected_web_ports}",
                "risk_level": "High",
                "description": "Web applications may contain exploitable vulnerabilities"
            })
            
        # Generate risk assessment
        high_risk_count = len([t for t in mitre_findings["techniques_detected"] if t.get("risk_level") == "High"])
        medium_risk_count = len([t for t in mitre_findings["techniques_detected"] if t.get("risk_level") == "Medium"])
        
        mitre_findings["risk_assessment"] = {
            "overall_risk": "High" if high_risk_count > 0 else "Medium" if medium_risk_count > 0 else "Low",
            "high_risk_techniques": high_risk_count,
            "medium_risk_techniques": medium_risk_count,
            "total_techniques": len(mitre_findings["techniques_detected"])
        }
        
        # Generate defensive recommendations based on MITRE
        mitre_findings["defensive_recommendations"] = cls._generate_mitre_defenses(mitre_findings["techniques_detected"])
        
        return mitre_findings
    
    @classmethod
    def _generate_mitre_defenses(cls, detected_techniques: List[Dict[str, Any]]) -> List[str]:
        """Generate defensive recommendations based on detected MITRE techniques"""
        recommendations = []
        
        technique_ids = [t["technique_id"] for t in detected_techniques]
        
        if "T1046" in technique_ids:
            recommendations.extend([
                "Implement network segmentation to limit scanning scope",
                "Deploy intrusion detection systems to monitor for port scans",
                "Use firewalls to restrict unnecessary port access"
            ])
            
        if "T1021.001" in technique_ids:
            recommendations.extend([
                "Disable RDP if not required, or restrict access via VPN",
                "Enable Network Level Authentication for RDP",
                "Monitor RDP connections and failed authentication attempts",
                "Implement multi-factor authentication for RDP access"
            ])
            
        if "T1021.004" in technique_ids:
            recommendations.extend([
                "Use key-based authentication instead of passwords",
                "Disable root login and use sudo for administrative access",
                "Monitor SSH connections and implement fail2ban",
                "Regular SSH configuration audits"
            ])
            
        if "T1190" in technique_ids:
            recommendations.extend([
                "Regular web application security testing",
                "Implement Web Application Firewall (WAF)",
                "Keep web applications and frameworks updated",
                "Use HTTPS with proper TLS configuration"
            ])
            
        return recommendations
    
    @classmethod
    def check_service_vulnerabilities(cls, port: int) -> Dict[str, Any]:
        """Check for known vulnerabilities in common services"""
        service_vulns = {
            21: {
                "service": "FTP",
                "common_vulns": ["Anonymous login", "Cleartext credentials", "Directory traversal"],
                "mitre_techniques": ["T1078", "T1552.001"],
                "recommendations": ["Use SFTP/FTPS", "Disable anonymous access", "Regular updates"]
            },
            22: {
                "service": "SSH", 
                "common_vulns": ["Weak passwords", "Outdated versions", "Default credentials"],
                "mitre_techniques": ["T1021.004", "T1110"],
                "recommendations": ["Key-based auth", "Disable password auth", "Update SSH"]
            },
            23: {
                "service": "Telnet",
                "common_vulns": ["Cleartext transmission", "No encryption", "Legacy protocol"],
                "mitre_techniques": ["T1021.002", "T1040"],
                "recommendations": ["Replace with SSH", "Disable Telnet", "Use encrypted alternatives"]
            },
            80: {
                "service": "HTTP",
                "common_vulns": ["Unencrypted data", "Missing security headers", "Information disclosure"],
                "mitre_techniques": ["T1190", "T1040"],
                "recommendations": ["Migrate to HTTPS", "Security headers", "Regular security scans"]
            },
            443: {
                "service": "HTTPS",
                "common_vulns": ["Weak TLS config", "Certificate issues", "Mixed content"],
                "mitre_techniques": ["T1190", "T1040"],
                "recommendations": ["Strong TLS config", "Certificate monitoring", "Security headers"]
            },
            1433: {
                "service": "SQL Server",
                "common_vulns": ["Default credentials", "SQL injection", "Unencrypted connections"],
                "mitre_techniques": ["T1190", "T1078"],
                "recommendations": ["Change defaults", "Network isolation", "Encryption"]
            },
            3306: {
                "service": "MySQL", 
                "common_vulns": ["Default credentials", "Remote root access", "Privilege escalation"],
                "mitre_techniques": ["T1190", "T1078"],
                "recommendations": ["Secure installation", "Limit remote access", "Regular updates"]
            },
            3389: {
                "service": "RDP",
                "common_vulns": ["Weak passwords", "BlueKeep vulnerability", "No NLA"],
                "mitre_techniques": ["T1021.001", "T1110"],
                "recommendations": ["Strong passwords", "Enable NLA", "Regular patches"]
            }
        }
        
        return service_vulns.get(port, {
            "service": f"Unknown service on port {port}",
            "common_vulns": ["Unknown service risks"],
            "mitre_techniques": ["T1046"],
            "recommendations": ["Identify service", "Close if unnecessary", "Security assessment"]
        })