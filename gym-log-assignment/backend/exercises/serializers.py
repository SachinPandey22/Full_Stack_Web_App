from rest_framework import serializers
from .models import Exercise
from .models import UserWorkout

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = "__all__"

class UserWorkoutSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer(read_only=True)
    exercise_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = UserWorkout
        fields = ['id', 'exercise', 'exercise_id', 'added_date', 'sets', 'reps', 'notes']