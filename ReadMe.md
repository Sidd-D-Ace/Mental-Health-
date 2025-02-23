# Mind Space - Mental Health Support

Mind Space is a web application designed to provide comforting and supportive advice based on user emotions. It leverages Google's Gemini AI to generate personalized responses, offering encouragement and mental health support.

## Features
- 🌟 AI-generated supportive messages for various emotions
- 😊 Positive reinforcement for users feeling good
- 🧠 Support for users with a heavy mind (stress, anxiety, sadness, etc.)
- 🎨 Simple and interactive UI
- 🔗 Cross-Origin support using Flask-CORS

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Flask (Python)
- **AI Model:** Google Gemini AI (via `google-generativeai` API)


## Installation & Setup
### Prerequisites
Ensure you have Python installed (version 3.7+ recommended).

### Clone the Repository
```bash
git clone https://github.com/your-repo/mind-space.git
cd mind-space
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run the Flask Server
```bash
python app.py
```

The app will be available at: **http://127.0.0.1:5000/**

## API Endpoints
### 1. Get AI Advice
**Endpoint:** `/get_advice`
- **Method:** `POST`
- **Request Body:** JSON `{ "emotion": "sadness" }`
- **Response:** `{ "advice": "Stay strong! You are not alone." }`

---
💙 *Developed to support mental well-being with the power of AI!*

