from django.core.management.base import BaseCommand
from exercises.models import Exercise


class Command(BaseCommand):
    help = 'Update MET values for exercises'

    def handle(self, *args, **options):
        # MET values for common exercises
        met_mapping = {
            # Strength training
            'push': 8.0,
            'pull': 8.0,
            'squat': 5.0,
            'lunge': 4.0,
            'deadlift': 6.0,
            'bench press': 6.0,
            'weight': 6.0,
            'plank': 4.0,
            
            # Cardio
            'running': 9.8,
            'jogging': 7.0,
            'walking': 3.5,
            'cycling': 7.5,
            'swimming': 9.0,
            'jump': 12.0,
            'burpee': 8.0,
            'jumping jack': 8.0,
            
            # Flexibility
            'yoga': 2.5,
            'stretch': 2.5,
            'pilates': 3.0,
        }
        
        updated_count = 0
        
        for exercise in Exercise.objects.all():
            exercise_name_lower = exercise.name.lower()
            
            # Try to match with known exercises
            matched = False
            for keyword, met in met_mapping.items():
                if keyword in exercise_name_lower:
                    exercise.met_value = met
                    exercise.save()
                    self.stdout.write(
                        self.style.SUCCESS(f"✓ {exercise.name}: MET = {met}")
                    )
                    updated_count += 1
                    matched = True
                    break
            
            # Set default based on category
            if not matched:
                if exercise.category == 'cardio':
                    exercise.met_value = 7.0
                elif exercise.category == 'strength':
                    exercise.met_value = 6.0
                else:  # flexibility
                    exercise.met_value = 2.5
                
                exercise.save()
                self.stdout.write(
                    f"  {exercise.name}: Default MET = {exercise.met_value} ({exercise.category})"
                )
                updated_count += 1
        
        self.stdout.write(
            self.style.SUCCESS(f"\n✓ Updated {updated_count} exercises with MET values")
        )
