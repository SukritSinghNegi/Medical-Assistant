from django.shortcuts import render
# Create your views here.
# chatbot/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from lib.retrieval_generation import generation
from lib.data_injesion import ingestdata

vstore = ingestdata("done")
chain = generation(vstore)

# Temporary storage for user messages
user_sessions = {}

@csrf_exempt
def handle_user_message(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)
        user_id = data.get('user_id')
        user_message = data.get('text')
        print(f"Received : {user_id}")

        if user_id not in user_sessions:
            user_sessions[user_id] = []
        # Store the user message
        user_sessions[user_id].append(user_message)
        print(f"User message received: {user_message}")

        print(user_sessions)          

        return JsonResponse({'status': 'Message received'}, status=200)

def get_bot_response(request):
    try:
        user_id = request.GET.get('user_id')
        if not user_sessions.get(user_id):
            return JsonResponse({'response': 'Hello! How can I assist you today?'}, status=200)

        if len(user_sessions[user_id]) > 1:
            # Get the latest user message
            user_message = ", ".join(user_sessions[user_id][-3:])
        else:
            user_message = user_sessions[user_id][-1]

        # Generate a bot response
        bot_response = chain.invoke(user_message)
        return JsonResponse({'response': bot_response}, status=200)
    except Exception as e:
        print(f"Error: {str(e)}")
        return JsonResponse({'response': 'Sorry, something went wrong! Please try again.'}, status=500)
