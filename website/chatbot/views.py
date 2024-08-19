from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import cache  # Import Django's cache
import json
from lib.retrieval_generation import generation
from lib.data_injesion import ingestdata
from datetime import datetime, timedelta

vstore = ingestdata("done")
chain = generation(vstore)

# Maximum number of messages to store in the window buffer
WINDOW_SIZE = 3

@csrf_exempt
def handle_user_message(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data.get('user_id')
        user_message = data.get('text')
        active = bool(data.get('active'))
        
        cache_key = f'user_session_{user_id}'
        
        if active:
            # Retrieve the current window buffer from the cache
            message_buffer = cache.get(cache_key, [])
            
            # Add the new message to the buffer
            message_buffer.append(user_message)
            
            # Ensure the buffer doesn't exceed the window size
            if len(message_buffer) > WINDOW_SIZE:
                message_buffer.pop(0)
            
            # Store the updated buffer in the cache with a 30-minute timeout
            cache.set(cache_key, message_buffer, timeout=1800)
        else:
            # Remove the user session from the cache
            cache.delete(cache_key)
        
        return JsonResponse({'status': 'Message received'}, status=200)

def get_bot_response(request):
    try:
        user_id = request.GET.get('user_id')
        cache_key = f'user_session_{user_id}'
        
        # Retrieve the message buffer from the cache
        message_buffer = cache.get(cache_key)
        
        if not message_buffer:
            return JsonResponse({'response': 'Hello! How can I assist you today?', 'active': True}, status=200)
        
        # Concatenate the buffered messages to form the input to the bot
        user_message = " ".join(message_buffer)
        
        # Generate a bot response using the concatenated user messages
        bot_response = chain.invoke(user_message)
        message_buffer.append(bot_response)

        if len(message_buffer) > WINDOW_SIZE:
                message_buffer.pop(0) 
        cache.set(cache_key, message_buffer, timeout=1800)
        return JsonResponse({'response': bot_response, 'active': True}, status=200)
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return JsonResponse({'response': 'Sorry, something went wrong! Please try again.', 'active': False}, status=500)
