# chatbot/urls.py
from django.urls import path
from .views import handle_user_message, get_bot_response

urlpatterns = [
    path('Ecommerce-Chatbot/user/', handle_user_message, name='handle_user_message'),
    path('Ecommerce-Chatbot/bot/', get_bot_response, name='get_bot_response'),
    path('Medical-Assistant/user/', handle_user_message, name='handle_user_message'),
    path('Medical-Assistant/bot/', get_bot_response, name='get_bot_response'),
    path('Code-Analyser/user/', handle_user_message, name='handle_user_message'),
    path('Code-Analyser/bot/', get_bot_response, name='get_bot_response'),
]
