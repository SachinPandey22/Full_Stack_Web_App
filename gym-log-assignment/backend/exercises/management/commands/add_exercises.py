from django.core.management.base import BaseCommand
from exercises.add_exercises import run_exercise_script

class Command(BaseCommand):
    help = "Populates the Exercise table with default data"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Running add_exercise script..."))
        run_exercise_script()
        self.stdout.write(self.style.SUCCESS("✅ add_exercise script completed successfully!"))
