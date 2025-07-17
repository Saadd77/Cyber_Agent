import asyncio
from app.agents.factory import AgentFactory

async def test_agents():
    """Test all agents with sample data"""
    
    # Test Web Classifier
    print("=== Testing Web Classifier ===")
    classifier = AgentFactory.create_agent("web_classifier", "rule_based")
    result = await classifier.execute("https://example.com")
    print(f"Rule-based result: {result}")
    
    classifier_ml = AgentFactory.create_agent("web_classifier", "ml")
    result_ml = await classifier_ml.execute("https://example.com")
    print(f"ML result: {result_ml}")
    
    # Test Web Pentester
    print("\n=== Testing Web Pentester ===")
    pentester = AgentFactory.create_agent("web_pentester", "rule_based")
    result = await pentester.execute("https://httpbin.org")
    print(f"Pentester result: {result}")
    
    # Test Network Scanner
    print("\n=== Testing Network Scanner ===")
    scanner = AgentFactory.create_agent("network_scanner", "rule_based")
    result = await scanner.execute("8.8.8.8")
    print(f"Scanner result: {result}")

if __name__ == "__main__":
    asyncio.run(test_agents())