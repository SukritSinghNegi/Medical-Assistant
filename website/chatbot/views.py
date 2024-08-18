# chatbot/views.py
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from lib.retrieval_generation import generation
from lib.data_injesion import ingestdata
from datetime import datetime, timedelta


vstore = ingestdata("done")
chain = generation(vstore)

# Temporary storage for user messages
user_sessions = {}

def user_sessions_update() :
    global user_sessions 
    users = user_sessions.keys()
    if len(users) != 0 :
        for user in users :
            if datetime.now() - user_sessions[user][list(user_sessions[user].keys())[0]] > timedelta(minutes=30):
                del(user_sessions[user])  # Delete user sessions that are older than 30 minutes
    return user_sessions

@csrf_exempt
def handle_user_message(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data.get('user_id')
        user_message = data.get('text')
        active = bool(data.get('active'))
        print(active)
        if user_id not in user_sessions:
            user_sessions[user_id] = {}
        # Store the user message
        if active:
            user_sessions[user_id][datetime]=user_message
        else:
            del(user_sessions[user_id])
        print(user_sessions)

        return JsonResponse({'status': 'Message received'}, status=200)

def get_bot_response(request):
    try:
        user_id = request.GET.get('user_id')
        if not user_sessions.get(user_id):
            return JsonResponse({'response': 'Hello! How can I assist you today?'}, status=200)

        if len(user_sessions[user_id]) > 1:
            # Get the latest user message
            user_message = ", ".join(list(user_sessions[user_id].values())[-3:])
        else:
            user_message = user_sessions[user_id][-1]

        # Generate a bot response
        bot_response = chain.invoke(user_message)
        return JsonResponse({'response': bot_response}, status=200)
    except Exception as e:
        print(f"Error: {str(e)}")
        return JsonResponse({'response': 'Sorry, something went wrong! Please try again.'}, status=500)
