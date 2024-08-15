# chatbot/urls.py
from django.urls import path
from .views import handle_user_message, get_bot_response

urlpatterns = [
    path('chatbot/user/', handle_user_message, name='handle_user_message'),
    path('chatbot/bot/', get_bot_response, name='get_bot_response'),
]
