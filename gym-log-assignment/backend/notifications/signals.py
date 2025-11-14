from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

from .models import Notification
from users.models import NutritionTargets  
from exercises.models import UserWorkout 

User = get_user_model()


# 1) Welcome notification on first registration
@receiver(post_save, sender=User)
def create_welcome_notification(sender, instance, created, **kwargs):
    if not created:
        return
    Notification.objects.create(
        user=instance,
        message="Welcome to Shaktiman! 🎉"
    )


# 2) Nutrition target created
@receiver(post_save, sender=NutritionTargets)
def create_nutrition_target_notification(sender, instance, created, **kwargs):
    if not created:
        return
    Notification.objects.create(
        user=instance.user,  # NutritionTargets has OneToOne to User
        message="Nutrition target created 🥗"
    )

# 3) Workout Added
@receiver(post_save, sender=UserWorkout)
def create_workout_added_notification(sender, instance, created, **kwargs):
    if not created:
        return  # Only notify when a workout is first added

    exercise_name = instance.exercise.name if instance.exercise else "Workout"

    Notification.objects.create(
        user=instance.user,
        message=f"'{exercise_name}' has been added to your workout list."
    )

# 4) Workout Completed
@receiver(pre_save, sender=UserWorkout)
def create_workout_completed_notification(sender, instance, **kwargs):
    if instance.pk is None:
        return

    try:
        previous = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        previous = None

    if previous and previous.completed_date is None and instance.completed_date is not None:
        exercise_name = instance.exercise.name if instance.exercise else "Workout"

        Notification.objects.create(
            user=instance.user,
            message=f'Bravo! "{exercise_name}" is completed 🙌'
        )