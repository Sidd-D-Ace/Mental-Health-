
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__, template_folder="templates")
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5000"}})


# Manually set the Google AI API key
GENAI_API_KEY = "AIzaSyBfMI7wWgF-bp6rLKPqWPxcBuaWt9UhKR8"  # Replace with your actual key

if not GENAI_API_KEY:
    raise ValueError("❌ Google AI API Key not found! Please provide a valid API key.")

# Configure Gemini API
genai.configure(api_key=GENAI_API_KEY, transport="rest") 

def generate_response(emotion):
    try:
        prompt = f"Provide a comforting and supportive message for someone feeling {emotion}."
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(prompt)

        if not response.text:
            return "⚠️ No response received from the AI."

        return response.text

    except Exception as e:
        print(f"❌ Error in AI response: {str(e)}")
        return "⚠️ Unable to fetch advice at the moment. Please try again later."

# API Route to get AI response

@app.route("/get_advice", methods=["POST"])
def get_advice():
    try:
        data = request.get_json()
        print("🔍 Received Data:", data)  # Debugging
        
        if not data or "emotion" not in data:
            return jsonify({"error": "Emotion not provided"}), 400
        
        emotion = data["emotion"]
        print("🔍 Emotion:", emotion)  # Debugging

        advice = generate_response(emotion)
        print("🔍 Generated Advice:", advice)  # Debugging
        
        return jsonify({"advice": advice})

    except Exception as e:
        print(f"❌ Error in /get_advice: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route("/get_positive_advice", methods=["GET"])
def get_positive_advice():
    try:
        print("🔍 Generating positive advice...")
        advice = generate_response("positivity and motivation")
        print("🔍 Generated Advice:", advice)  # Debugging

        return jsonify({"advice": advice})

    except Exception as e:
        print(f"❌ Error in /get_positive_advice: {e}")
        return jsonify({"error": "Internal server error"}), 500



@app.route('/')
def home():
    return render_template("index.html")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # Default to 5000 if no port is specified
    app.run(host='0.0.0.0', port=port)
