from typing import Optional
import re
from urllib.parse import urlparse

class ValidationError(Exception):
    """Custom validation error"""
    pass

def validate_email(email: str) -> bool:
    """Validate email format"""
    email_pattern = re.compile(
        r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    )
    return bool(email_pattern.match(email))

def validate_password_strength(password: str) -> Dict[str, bool]:
    """Validate password strength"""
    checks = {
        'length': len(password) >= 8,
        'uppercase': bool(re.search(r'[A-Z]', password)),
        'lowercase': bool(re.search(r'[a-z]', password)),
        'digit': bool(re.search(r'\d', password)),
        'special': bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', password))
    }
    return checks

def validate_project_name(name: str) -> bool:
    """Validate project name"""
    if not name or len(name.strip()) < 3:
        return False
    if len(name) > 100:
        return False
    # Allow alphanumeric, spaces, hyphens, underscores
    return bool(re.match(r'^[a-zA-Z0-9\s\-_]+$', name))

def validate_target_input(target_type: str, target_value: str) -> bool:
    """Validate target input based on type"""
    if target_type == 'website':
        return validate_url(target_value)
    elif target_type == 'ip':
        return validate_ip_address(target_value)
    return False

def validate_url(url: str) -> bool:
    """Validate URL format"""
    try:
        result = urlparse(url)
        return all([result.scheme in ['http', 'https'], result.netloc])
    except:
        return False

def validate_ip_address(ip: str) -> bool:
    """Validate IP address format"""
    ip_pattern = re.compile(
        r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
    )
    return bool(ip_pattern.match(ip))