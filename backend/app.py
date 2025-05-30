from flask import Flask, request, jsonify
from dotenv import load_dotenv
from google import genai
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@app.route('/langchain-completion', methods=['POST'])
def langchain_completion():
    try:
        user_message = request.json.get('message', '')
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            api_key=GEMINI_API_KEY
        )
        response = llm.invoke(user_message)

        return jsonify({"status": "success", "response": response.content})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api-completion', methods=['POST'])
def api_completion():
    try:
        user_message = request.json.get('message', '')
        client = genai.Client(api_key=GEMINI_API_KEY)

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=user_message
        )
        reply = response.text

        return jsonify({"status": "success", "response": reply})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/check', methods=['POST'])
def check():
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents='Reply if working'
        )
        reply = response.text

        return jsonify({"status": "success", "response": reply})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)