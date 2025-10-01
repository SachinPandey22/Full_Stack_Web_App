import os
import django

# Setup Django - Your settings module is 'gymlog.settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gymlog.settings')
django.setup()

from exercises.models import Exercise

print("🔄 Clearing existing exercises...")
Exercise.objects.all().delete()

print("📝 Adding new exercises...")

# Add new exercises
exercises_created = Exercise.objects.bulk_create([
    #
    # BACK EXERCISES
    Exercise(name='Pull-ups', category='strength', muscle_group='back', description='Pull body up until chin over bar', equipment='Bodyweight', difficulty='intermediate'),
    Exercise(name='Barbell Rows', category='strength', muscle_group='back', description='Pull barbell to lower chest', equipment='Barbell', difficulty='intermediate'),
    Exercise(name='Lat Pulldown', category='strength', muscle_group='back', description='Pull bar down to chest', equipment='Machines', difficulty='beginner'),
    Exercise(name='Deadlifts', category='strength', muscle_group='back', description='Lift barbell from ground to standing', equipment='Barbell', difficulty='advanced'),
    Exercise(name='Dumbbell Rows', category='strength', muscle_group='back', description='Single-arm rowing movement', equipment='Dumbbells', difficulty='beginner'),
    Exercise(name='T-Bar Rows', category='strength', muscle_group='back', description='Rowing movement using T-bar', equipment='Barbell', difficulty='intermediate'),
    Exercise(name='Face Pulls', category='strength', muscle_group='back', description='Pull rope towards face for rear delts', equipment='Cables', difficulty='beginner'),
    
    # LEGS EXERCISES
    Exercise(name='Barbell Squats', category='strength', muscle_group='legs', description='Lower hips with barbell on back', equipment='Barbell', difficulty='intermediate'),
    Exercise(name='Leg Press', category='strength', muscle_group='legs', description='Push weight with legs while seated', equipment='Machines', difficulty='beginner'),
    Exercise(name='Lunges', category='strength', muscle_group='legs', description='Step forward and lower back knee', equipment='Dumbbells', difficulty='beginner'),
    Exercise(name='Romanian Deadlifts', category='strength', muscle_group='legs', description='Hip hinge for hamstrings', equipment='Barbell', difficulty='intermediate'),
    Exercise(name='Leg Curls', category='strength', muscle_group='legs', description='Isolation for hamstrings', equipment='Machines', difficulty='beginner'),
    Exercise(name='Leg Extensions', category='strength', muscle_group='legs', description='Isolation for quadriceps', equipment='Machines', difficulty='beginner'),
    Exercise(name='Bulgarian Split Squats', category='strength', muscle_group='legs', description='Single-leg squat with rear foot elevated', equipment='Dumbbells', difficulty='intermediate'),
    Exercise(name='Calf Raises', category='strength', muscle_group='legs', description='Rise up on toes to work calves', equipment='Machines', difficulty='beginner'),
    
    # ARMS EXERCISES
    Exercise(name='Barbell Curls', category='strength', muscle_group='arms', description='Classic bicep exercise', equipment='Barbell', difficulty='beginner'),
    Exercise(name='Tricep Dips', category='strength', muscle_group='arms', description='Lower and raise between parallel bars', equipment='Bodyweight', difficulty='intermediate'),
    Exercise(name='Hammer Curls', category='strength', muscle_group='arms', description='Curl with neutral grip', equipment='Dumbbells', difficulty='beginner'),
    Exercise(name='Overhead Tricep Extension', category='strength', muscle_group='arms', description='Extend weight overhead', equipment='Dumbbells', difficulty='beginner'),
    Exercise(name='Cable Tricep Pushdown', category='strength', muscle_group='arms', description='Push cable down for triceps', equipment='Cables', difficulty='beginner'),
    Exercise(name='Preacher Curls', category='strength', muscle_group='arms', description='Bicep isolation on preacher bench', equipment='Barbell', difficulty='intermediate'),
    Exercise(name='Close-Grip Bench Press', category='strength', muscle_group='arms', description='Bench press with narrow grip for triceps', equipment='Barbell', difficulty='intermediate'),
    
    # SHOULDERS EXERCISES
    Exercise(name='Overhead Press', category='strength', muscle_group='shoulders', description='Press barbell overhead', equipment='Barbell', difficulty='intermediate'),
    Exercise(name='Lateral Raises', category='strength', muscle_group='shoulders', description='Raise dumbbells to sides', equipment='Dumbbells', difficulty='beginner'),
    Exercise(name='Front Raises', category='strength', muscle_group='shoulders', description='Raise dumbbells to front', equipment='Dumbbells', difficulty='beginner'),
    Exercise(name='Arnold Press', category='strength', muscle_group='shoulders', description='Rotating dumbbell press', equipment='Dumbbells', difficulty='intermediate'),
    Exercise(name='Rear Delt Flyes', category='strength', muscle_group='shoulders', description='Bent-over flyes for rear delts', equipment='Dumbbells', difficulty='beginner'),
    Exercise(name='Upright Rows', category='strength', muscle_group='shoulders', description='Pull barbell up along body to chin', equipment='Barbell', difficulty='intermediate'),
    Exercise(name='Pike Push-ups', category='strength', muscle_group='shoulders', description='Bodyweight shoulder exercise', equipment='Bodyweight', difficulty='intermediate'),
    
    # CORE EXERCISES
    Exercise(name='Planks', category='strength', muscle_group='core', description='Hold body straight', equipment='Bodyweight', difficulty='beginner'),
    Exercise(name='Crunches', category='strength', muscle_group='core', description='Classic ab exercise', equipment='Bodyweight', difficulty='beginner'),
    Exercise(name='Russian Twists', category='strength', muscle_group='core', description='Rotate torso side to side', equipment='Dumbbells', difficulty='beginner'),
    Exercise(name='Hanging Leg Raises', category='strength', muscle_group='core', description='Hang and raise legs', equipment='Bodyweight', difficulty='advanced'),
    Exercise(name='Bicycle Crunches', category='strength', muscle_group='core', description='Alternating elbow to knee', equipment='Bodyweight', difficulty='beginner'),
    Exercise(name='Ab Wheel Rollouts', category='strength', muscle_group='core', description='Roll ab wheel forward and back', equipment='Bodyweight', difficulty='advanced'),
    Exercise(name='Side Planks', category='strength', muscle_group='core', description='Hold body sideways on one arm', equipment='Bodyweight', difficulty='beginner'),
    Exercise(name='Cable Woodchops', category='strength', muscle_group='core', description='Rotational movement with cable', equipment='Cables', difficulty='intermediate'),
])

print(f"✅ Successfully added {len(exercises_created)} exercises!")

# Show summary by muscle group
from django.db.models import Count
counts = Exercise.objects.values('muscle_group').annotate(total=Count('id')).order_by('muscle_group')

print("\n📊 Exercise Count by Muscle Group:")
for item in counts:
    print(f"   {item['muscle_group'].title()}: {item['total']} exercises")

print("\n🎉 Database populated successfully!")
