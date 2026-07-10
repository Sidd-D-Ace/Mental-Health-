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

## 🚀 Production CI/CD & Deployment Architecture

This project features a fully automated, event-driven CI/CD lifecycle managed via Jenkins and containerized using Docker on AWS infrastructure.

### DevOps Highlights:
- **Automated Webhook Triggers:** Configured Git SCM hooks to automatically launch the pipeline on target `push` and `pull request` lifecycle actions.
- **Concurrent Quality Gates:** Utilizes Jenkins declarative parallel syntax to evaluate linting structures across frontend and backend file systems simultaneously.
- **Optimized Containerization:** The backend `Dockerfile` leverages `PYTHONDONTWRITEBYTECODE=1` to minimize container filesystem bloat and `PYTHONUNBUFFERED=1` to enable zero-lag log observability.
- **Secure Runtime Injection:** Credentials (such as the Gemini API token) are managed entirely outside the code wrapper via Jenkins Credentials Manager and safely bound into the container runtime layout.

### Production Pipeline Execution Layout:
1. **Linting & Code Formatting Validation** (Parallel Gates)
2. **Docker Image Build Context Execution** (Targeting port `10000`)
3. **Automated Docker Hub Registry Handshake & Push**
4. **Target Server Rolling Update Deployment** (Exposing host port `5000`)

---
💙 *Developed to support mental well-being with the power of AI!*

