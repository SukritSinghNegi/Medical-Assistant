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
user_messages = []

# Endpoint to handle user messages
@app.route('/chatbot/user', methods=['POST'])
def handle_user_message():
    data = request.get_json()
    user_message = data.get('text')

    # Store the user message
    user_messages.append(user_message)
    print(f"User message received: {user_message}")

    return jsonify({'status': 'Message received'}), 200 

# Endpoint to provide bot response
@app.route('/chatbot/bot', methods=['GET'])
def get_bot_response():
    try:
        if not user_messages or user_messages[-1].lower() in ["hi","hello","hey","sup"]:
            return jsonify({'response': 'Hello! How can I assist you today?'}), 200

        if len(user_messages) > 1 :
        # Get the latest user message
            user_message = ", ".join(user_messages[-3:])
            print(f"User message: {user_message}")
        else :
            user_message = user_messages[-1]
        
        # Generate a bot response (for demonstration purposes, we're just echoing the message)
        bot_response = chain.invoke(user_message)

        return jsonify({'response': bot_response}), 200 
    except Exception as e:
        return jsonify({'response': user_message})

if __name__ == '__main__':
    app.run(debug=True)
