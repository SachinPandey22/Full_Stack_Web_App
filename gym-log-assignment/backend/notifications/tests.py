import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone

from notifications.models import Notification
from exercises.models import Exercise, UserWorkout

User = get_user_model()

# Tested by: Misan Parajuli
@pytest.mark.django_db
def test_welcome_notification_created_for_new_user():
    """
    When a new user is created, a single welcome notification should be
    created by the post_save signal.
    """
    user = User.objects.create_user(
        username="alice",
        email="alice@example.com",
        password="StrongPass1",
    )

    notes = Notification.objects.filter(user=user)
    assert notes.count() == 1

    note = notes.first()
    assert note.message == "Welcome to Shaktiman! 🎉"
    assert note.is_read is False

# Tested by: Misan Parajuli
@pytest.mark.django_db
def test_workout_completion_creates_notification():
    """
    When a UserWorkout goes from not-completed to completed, the pre_save
    signal should create a 'Bravo!' completion notification.
    """
    user = User.objects.create_user(
        username="bob",
        email="bob@example.com",
        password="StrongPass1",
    )

    exercise = Exercise.objects.create(
        name="Bench Press",
        category="strength",
        muscle_group="chest",
        description="Test exercise",
    )

    # First save: workout exists but is not completed yet
    workout = UserWorkout.objects.create(
        user=user,
        exercise=exercise,
        duration_minutes=30,  # valid for MinValueValidator
    )

    # Second save: mark as completed → should trigger completion signal
    workout.completed_date = timezone.now()
    workout.save()

    messages = list(
        Notification.objects.filter(user=user)
        .values_list("message", flat=True)
    )

    assert any(
        'Bravo!' in m and "Bench Press" in m
        for m in messages
    )
