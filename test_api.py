#!/usr/bin/env python3
"""
Quick test script to debug OpenRouter API issues
"""

from fitaicoach_core import call_openrouter_api, OPENROUTER_API_KEY

def test_api():
    print("Testing OpenRouter API...")
    print(f"API Key (first 10 chars): {OPENROUTER_API_KEY[:10]}...")
    
    # Simple test prompt
    test_prompt = """
    Generate a simple JSON response with the following structure:
    {
      "test": "success",
      "message": "API is working"
    }
    
    Return ONLY the JSON, no other text.
    """
    
    print("Sending test prompt...")
    response = call_openrouter_api(test_prompt, OPENROUTER_API_KEY)
    
    if response:
        print("✅ API call successful!")
        print(f"Response: {response}")
    else:
        print("❌ API call failed!")
        print("Response was None")

if __name__ == "__main__":
    test_api()
