import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv, find_dotenv



print(load_dotenv(find_dotenv()))
app = Flask(__name__, template_folder="templates")
CORS(app)


# Manually set the Google AI API key
GENAI_API_KEY = os.getenv("GENAI_API_KEY")  # Replace with your actual key
print(GENAI_API_KEY)
if not GENAI_API_KEY:
    raise ValueError("❌ Google AI API Key not found! Please provide a valid API key.")

# Configure Gemini API
genai.configure(api_key=GENAI_API_KEY, transport="rest") 

def generate_response(emotion):
    try:
        # UPDATED PROMPT: Added specific instructions to avoid markdown
        prompt = (
            f"You're a Therapist. Provide a comforting and supportive message for someone feeling {emotion}. "
            "IMPORTANT: Provide ONLY the raw HTML content (e.g., <p>...</p>). "
            "Do NOT wrap the response in markdown code blocks like ```html. "
            "Do NOT include the <!DOCTYPE html> or <html> tags. Just the body content."
        )
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)

        if not response.text:
            return "⚠️ No response received from the AI."

        # EXTRA SAFETY: Strip backticks just in case Gemini ignores instructions
        clean_text = response.text.replace("```html", "").replace("```", "").strip()
        
        return clean_text

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
    # port = int(os.environ.get("PORT", 10000))  # Default to 10000
    app.run(host="0.0.0.0", port=10000, debug=False)

#Test comment