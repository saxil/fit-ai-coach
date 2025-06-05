import random
# import requests # No longer needed for API calls
import json
from openai import OpenAI, APIStatusError, APIConnectionError, AuthenticationError, RateLimitError # Updated import

# Placeholder for your OpenRouter API Key - REPLACE THIS!
OPENROUTER_API_KEY = "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" # Corrected the string termination
# It's highly recommended to use environment variables for API keys in production.
# Example: OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY") (requires import os)

# --- Functions for FitAI Coach ---

# def load_model(model_path='workout_model.pkl'):
#     """Loads the pre-trained machine learning model (Old method)."""
#     return joblib.load(model_path)

def call_openrouter_api(prompt_text, api_key):
    """
    Calls the OpenRouter API with a given prompt using the OpenAI library.
    """
    if not api_key or api_key == "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":
        print("ERROR: OpenRouter API key is not set or is still the placeholder 'YOUR_OPENROUTER_API_KEY_HERE'. Please ensure your actual API key is assigned to OPENROUTER_API_KEY at the top of fitaicoach_core.py.")
        return None

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key, # Use the api_key variable passed into the function
    )

    # IMPORTANT: For free models on OpenRouter, HTTP-Referer and X-Title are often required.
    # Replace "http://localhost:5000" with your actual site URL when deploying.
    # Replace "FitAI Coach" with your actual app name if different.
    print("Reminder: Ensure HTTP-Referer is your actual site URL and X-Title is your app name in extra_headers for deployed applications.")
    
    try:
        completion = client.chat.completions.create(
            model="deepseek/deepseek-r1-0528:free", # Updated model
            messages=[
                {"role": "system", "content": "You are FitAI Coach, an expert in creating personalized workout and nutrition plans. Provide responses in valid JSON format as specified in the user prompt."},
                {"role": "user", "content": prompt_text}
            ],
            extra_headers={ 
                "HTTP-Referer": "http://localhost:5000", # Changed to a common local URL
                "X-Title": "FitAI Coach", 
            },
            extra_body={} 
        )
        # Mimic the structure expected by get_personalized_workout and get_nutrition_plan
        if completion.choices and completion.choices[0].message:
            return {
                "choices": [
                    {
                        "message": {
                            "content": completion.choices[0].message.content
                        }
                    }
                ]
            }
        else:
            print("Error: OpenAI API response format not as expected.")
            print(f"Full response: {completion}")
            return None
    except APIStatusError as e: # Changed to direct exception name
        print(f"OpenRouter API returned an API Status Error: {e.status_code} - {e.message}")
        print(f"Response body: {e.response.text if e.response else 'N/A'}")
        return None
    except APIConnectionError as e: # Changed to direct exception name
        print(f"Failed to connect to OpenRouter API: {e}")
        return None
    except AuthenticationError as e: # Changed to direct exception name
        print(f"OpenRouter API authentication failed: {e.message}")
        print("Please double-check your OPENROUTER_API_KEY at the top of fitaicoach_core.py.")
        return None
    except RateLimitError as e: # Changed to direct exception name
        print(f"OpenRouter API rate limit exceeded: {e.message}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred calling OpenRouter API: {e}")
        return None

def get_personalized_workout(user_data, api_key):
    """
    Generates a personalized workout plan using the Gemini model via OpenRouter.
    """
    prompt = f"""
    Act as FitAI Coach. Based on the following user data:
    Age: {user_data.get('age')}
    Gender: {user_data.get('gender')}
    Fitness Goal: {user_data.get('goal')} (e.g., Weight Loss, Muscle Gain, Maintenance)
    Current Activity Level (1-5, 5 is very active): {user_data.get('activity_level')}
    Self-rated Workout Performance (1-10, 10 is excellent): {user_data.get('workout_performance')}
    Typical Resting Heart Rate (optional): {user_data.get('heart_rate')}
    Weight (kg): {user_data.get('weight')}
    Available Equipment (comma-separated, e.g., bodyweight, dumbbells, barbell, bench): {user_data.get('equipment_list', 'bodyweight')} 

    Generate a personalized workout plan. The plan should include:
    1. A "name" for the workout plan (string).
    2. A "description" of the plan (string).
    3. A list of "exercises". Each exercise in the list should be an object with:
        - "name" (string, e.g., "Push-ups")
        - "sets" (integer or string, e.g., 3 or "3-4")
        - "reps" (string, e.g., "10-12" or "AMRAP" or "30 seconds")

    Return ONLY the JSON object for the workout plan, without any surrounding text or explanations.
    Example of desired JSON structure for an exercise: {{"name": "Push-ups", "sets": 3, "reps": "10-12"}}
    Example of overall JSON:
    {{
      "name": "Beginner Full Body Strength",
      "description": "A plan for beginners focusing on full body strength.",
      "exercises": [
        {{"name": "Bodyweight Squats", "sets": 3, "reps": "12-15"}},
        {{"name": "Push-ups (on knees if needed)", "sets": 3, "reps": "8-10"}},
        {{"name": "Plank", "sets": 3, "reps": "30 seconds"}}
      ]
    }}

    Consider the user's goal, activity level, and available equipment when selecting exercises.
    If the user's goal is 'Weight Loss', include more cardio and higher repetition exercises.
    If the goal is 'Muscle Gain', focus on compound strength exercises with moderate to heavy loads (implicitly, by exercise selection) and moderate repetitions.
    If the goal is 'Maintenance', provide a balanced routine.
    Select 5-7 exercises for the workout.
    """

    api_response = call_openrouter_api(prompt, api_key)

    if api_response and api_response.get("choices") and api_response["choices"][0].get("message"):
        try:
            content_str = api_response["choices"][0]["message"]["content"]
            # Sometimes the API might wrap the JSON in backticks or other text
            if content_str.startswith("```json"):
                content_str = content_str[7:]
            if content_str.endswith("```"):
                content_str = content_str[:-3]
            
            workout_plan = json.loads(content_str.strip())
            
            return workout_plan
        except json.JSONDecodeError as e:
            print(f"Failed to decode JSON from Gemini for workout: {e}")
            print(f"Received content: {api_response['choices'][0]['message']['content']}")
            return {"name": "Error Plan", "description": "Could not generate workout plan from AI. Invalid format.", "exercises": []}
        except Exception as e:
            print(f"An unexpected error occurred while processing workout plan: {e}")
            return {"name": "Error Plan", "description": "An unexpected error occurred.", "exercises": []}


    return {"name": "Error Plan", "description": "Could not retrieve workout plan from AI.", "exercises": []}


# def generate_dynamic_workout(plan_category, user_data): # This is the old function, can be kept as fallback or removed
#     # ... (previous implementation of generate_dynamic_workout)
#     pass


def get_nutrition_plan(user_data, api_key):
    """
    Generates a personalized nutrition plan using the Gemini model via OpenRouter.
    (No longer falls back to NUTRITION_DETAILS as it's removed)
    """
    prompt = f"""
    Act as FitAI Coach. Based on the following user data:
    Age: {user_data.get('age')}
    Gender: {user_data.get('gender')}
    Fitness Goal: {user_data.get('goal')} (e.g., Weight Loss, Muscle Gain, Maintenance)
    Current Activity Level (1-5, 5 is very active): {user_data.get('activity_level')}
    Dietary Habits/Preferences: {user_data.get('dietary_habits')} (e.g., Balanced, High Protein, Low Carb, Vegetarian, Vegan)
    Weight (kg): {user_data.get('weight')}

    Generate a personalized one-day nutrition plan. The plan should include:
    1. A "plan_name" (string, e.g., "Weight Loss Nutrition Day 1").
    2. A "description" of the plan (string).
    3. A list of "meals". Each meal in the list should be an object with:
        - "meal_name" (string, e.g., "Breakfast", "Lunch", "Dinner", "Snack 1")
        - "recipe" (string, a brief description of the meal or simple recipe ideas)
        - "ingredients" (a list of strings, e.g., ["Oats", "Berries", "Almond Milk"])
        - "calories" (string or integer, estimated calories for the meal, e.g., "Approx. 350 kcal" or 350) - Optional, include if you can estimate.

    Return ONLY the JSON object for the nutrition plan, without any surrounding text or explanations.
    Example of desired JSON structure for a meal: {{"meal_name": "Breakfast", "recipe": "Oatmeal with berries and nuts", "ingredients": ["1/2 cup rolled oats", "1/2 cup mixed berries", "1 tbsp chopped nuts", "1 cup almond milk"], "calories": "Approx. 350 kcal"}}
    Example of overall JSON:
    {{
      "plan_name": "Muscle Gain Kickstart - Day 1",
      "description": "A high-protein meal plan to support muscle growth.",
      "meals": [
        {{"meal_name": "Breakfast", "recipe": "Scrambled eggs with spinach and whole-wheat toast.", "ingredients": ["3 large eggs", "1 cup spinach", "2 slices whole-wheat toast", "1 tsp olive oil"], "calories": "Approx. 400 kcal"}},
        {{"meal_name": "Snack 1", "recipe": "Greek yogurt with almonds.", "ingredients": ["1 cup Greek yogurt", "1/4 cup almonds"], "calories": "Approx. 250 kcal"}},
        {{"meal_name": "Lunch", "recipe": "Grilled chicken salad with mixed greens and vinaigrette.", "ingredients": ["150g grilled chicken breast", "2 cups mixed greens", "1/2 cucumber", "1/2 bell pepper", "2 tbsp vinaigrette dressing"], "calories": "Approx. 500 kcal"}},
        {{"meal_name": "Dinner", "recipe": "Baked salmon with quinoa and steamed broccoli.", "ingredients": ["150g salmon fillet", "1 cup cooked quinoa", "1 cup steamed broccoli"], "calories": "Approx. 550 kcal"}}
      ]
    }}

    Tailor the plan to the user's goal:
    - 'Weight Loss': Calorie deficit, nutrient-dense foods.
    - 'Muscle Gain': Calorie surplus, high protein.
    - 'Maintenance': Balanced macronutrients for current weight.
    Consider dietary preferences like Vegetarian, Vegan, Low Carb, etc.
    Provide 3 main meals and 1-2 snacks.
    """

    api_response = call_openrouter_api(prompt, api_key)

    if api_response and api_response.get("choices") and api_response["choices"][0].get("message"):
        try:
            content_str = api_response["choices"][0]["message"]["content"]
            # Clean potential markdown formatting
            if content_str.startswith("```json"):
                content_str = content_str[7:]
            if content_str.endswith("```"):
                content_str = content_str[:-3]

            nutrition_plan = json.loads(content_str.strip())
            return nutrition_plan
        except json.JSONDecodeError as e:
            print(f"Failed to decode JSON from Gemini for nutrition: {e}")
            print(f"Received content: {api_response['choices'][0]['message']['content']}")
            return {"plan_name": "Error Plan", "description": "Could not generate nutrition plan from AI. Invalid format.", "meals": []}
        except Exception as e:
            print(f"An unexpected error occurred while processing nutrition plan: {e}")
            return {"plan_name": "Error Plan", "description": "An unexpected error occurred.", "meals": []}

    return {"plan_name": "Error Plan", "description": "Could not retrieve nutrition plan from AI.", "meals": []}

# The old get_personalized_workout that uses the local model and generate_dynamic_workout
# can be renamed or kept if a fallback is desired.
# For now, the new get_personalized_workout above replaces it.

# The old NUTRITION_DETAILS can be used as a fallback if API fails or if user prefers it.
# For now, get_nutrition_plan tries to fetch from API.
