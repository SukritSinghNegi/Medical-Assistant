from flask import Flask, request, jsonify, request
import os
from lib.retrieval_generation import generation
from lib.data_injesion import ingestdata
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will allow all origins by default


vstore=ingestdata("done")
chain=generation(vstore)

# Temporary storage for user messages
user_sessions = {}

# Endpoint to handle user messages
@app.route('/chatbot/user', methods=['POST'])
def handle_user_message():
    data = request.get_json()
    
    user_id = data.get('user_id')
    user_message = data.get('text')

    if user_id not in user_sessions:
        user_sessions[user_id] = []
    # Store the user message
    user_sessions[user_id].append(user_message)
    print(f"User message received: {user_message}")

    return jsonify({'status': 'Message received'}), 200

@app.route('/chatbot/bot', methods=['GET'])
def get_bot_response():
    try:
        user_id = request.args.get('user_id')
        if not user_sessions.get(user_id):
            return jsonify({'response': 'Hello! How can I assist you today?'}), 200

        if len(user_sessions[user_id]) > 1:
        # Get the latest user message
            user_message = ", ".join(user_sessions[user_id][-3:])
        else:
            user_message = user_sessions[user_id][-1]

        # Generate a bot response (for demonstration purposes, we're just echoing the message)
        bot_response = chain.invoke(user_message)
        return jsonify({'response': bot_response}), 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'response': 'Sorry, something went wrong! Please try again.'}), 500


if __name__ == '__main__':
    app.run(debug=True)
