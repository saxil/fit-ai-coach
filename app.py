from flask import Flask, request, jsonify, render_template
from fitaicoach_core import get_personalized_workout, get_nutrition_plan, OPENROUTER_API_KEY # Import new functions and API key

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/workout_form') # Changed from '/workout'
def workout_form():
    return render_template('workout_form.html')

@app.route('/nutrition')
def nutrition_form_page():
    return render_template('nutrition_form.html')

@app.route('/get_workout', methods=['POST'])
def api_get_workout():
    try:
        user_data = request.json
        # Ensure all expected fields are present, provide defaults if necessary
        # This is important for the prompt to Gemini
        required_fields = {
            'age': None, 'gender': None, 'goal': None, 
            'activity_level': 3, 'workout_performance': 5, 
            'heart_rate': None, 'weight': None,
            'equipment_list': 'bodyweight' # Added equipment_list
        }
        for field, default_value in required_fields.items():
            if field not in user_data or user_data[field] is None:
                user_data[field] = default_value
                if field == 'equipment_list' and not user_data[field]: # Ensure equipment_list is not empty
                    user_data[field] = 'bodyweight'

        if not OPENROUTER_API_KEY or OPENROUTER_API_KEY == "YOUR_OPENROUTER_API_KEY_HERE":
            return jsonify({"error": "API key not configured. Please contact administrator."}), 500

        workout_plan = get_personalized_workout(user_data, OPENROUTER_API_KEY)
        
        if workout_plan.get("name") == "Error Plan":
             return jsonify({"error": workout_plan.get("description", "Failed to generate workout plan.")}), 500
        
        return jsonify(workout_plan)
    except Exception as e:
        print(f"Error in /get_workout: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/get_nutrition', methods=['POST'])
def api_get_nutrition():
    try:
        user_data = request.json
        required_fields = {
            'age': None, 'gender': None, 'goal': None, 
            'activity_level': 3, 'dietary_habits': 'Balanced', 
            'weight': None
        }
        for field, default_value in required_fields.items():
            if field not in user_data or user_data[field] is None:
                user_data[field] = default_value

        if not OPENROUTER_API_KEY or OPENROUTER_API_KEY == "YOUR_OPENROUTER_API_KEY_HERE":
            return jsonify({"error": "API key not configured. Please contact administrator."}), 500

        nutrition_plan = get_nutrition_plan(user_data, OPENROUTER_API_KEY)

        if nutrition_plan.get("plan_name") == "Error Plan":
            return jsonify({"error": nutrition_plan.get("description", "Failed to generate nutrition plan.")}), 500

        return jsonify(nutrition_plan)
    except Exception as e:
        print(f"Error in /get_nutrition: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
