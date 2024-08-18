# your_app/management/commands/run_view_function.py
from django.core.management.base import BaseCommand
from chabot.views import user_sessions_update  # Import the function

class Command(BaseCommand):
    help = 'Updates user sessions by removing those older than 30 minutes'

    def handle(self, *args, **kwargs):
        user_sessions_update()
        self.stdout.write(self.style.SUCCESS('Successfully updated user sessions'))
