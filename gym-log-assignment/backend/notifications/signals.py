from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

from .models import Notification
from users.models import NutritionTargets  

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
