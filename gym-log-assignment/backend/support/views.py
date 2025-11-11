from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings
from django.core.mail import get_connection, send_mail
import ssl, certifi
import openai
import os
from users.models import Profile
from MealLogging.models import Meal
from exercises.models import UserWorkout

@api_view(['POST'])
def send_support_email(request):
    data = request.data
    user_email = data.get('email')
    user_message = data.get('message')

    subject = f"New Support Message from {user_email}"
    message_body = f"Message:\n{user_message}\n\nReply to: {user_email}"

    # create an SMTP connection using certifi's CA bundle
    ssl_context = ssl.create_default_context(cafile=certifi.where())
    connection = get_connection(
        host='smtp.gmail.com',
        port=587,
        username=settings.EMAIL_HOST_USER,
        password=settings.EMAIL_HOST_PASSWORD,
        use_tls=True,
        fail_silently=False,
    )
    connection.ssl_context = ssl_context # assign the custom SSL context

    send_mail(
        subject,
        message_body,
        settings.EMAIL_HOST_USER, # From email
        # To email for support team for testing purposes i am using my email
        ['bdhakal1313@gmail.com'],
        connection=connection,
    )
    return Response({"success": True, "message": "Email sent!"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_with_ai(request):
    user_message = request.data.get("message", "")
    if not user_message:
        return Response({"error": "Message required"}, status=400)

    try:
        profile, _ = Profile.objects.get_or_create(user=request.user)
        payload_user = request.data.get("user") or {}

        name = (
            profile.name
            or payload_user.get("name")
            or request.user.get_full_name()
            or request.user.username
        )
        sex = profile.get_sex_display() if hasattr(profile, "get_sex_display") else profile.sex
        if not sex:
            sex = payload_user.get("sex", "Not provided")

        age = profile.age if profile.age is not None else payload_user.get("age")
        age_display = age if age is not None else "Not provided"

        height = profile.height if profile.height is not None else payload_user.get("height")
        height_display = f"{height} cm" if height is not None else "Not provided"

        weight = profile.weight if profile.weight is not None else payload_user.get("weight")
        weight_display = f"{weight} kg" if weight is not None else "Not provided"

        if hasattr(profile, "get_activity_level_display"):
            activity_level = profile.get_activity_level_display()
        else:
            activity_level = profile.activity_level
        activity_level = activity_level or payload_user.get("activity_level", "Not provided")

        if hasattr(profile, "get_goal_display"):
            goal = profile.get_goal_display()
        else:
            goal = profile.goal
        goal = goal or payload_user.get("goal", "Not provided")

        recent_meals = list(
            Meal.objects.filter(user=request.user).order_by("-date", "-time")[:3]
        )
        if recent_meals:
            meal_lines = []
            for meal in recent_meals:
                meal_lines.append(
                    f"{meal.date.isoformat()} {meal.time.strftime('%H:%M')} "
                    f"{meal.meal_type.title()}: {meal.name} "
                    f"({meal.calories} kcal, {meal.protein}g protein, {meal.carbs}g carbs, {meal.fat}g fat)"
                )
            meal_section = "\n".join(meal_lines)
        else:
            meal_section = "No recent meal logs."

        recent_workouts = list(
            UserWorkout.objects.filter(user=request.user)
            .select_related("exercise")
            .order_by("-added_date")[:3]
        )
        if recent_workouts:
            workout_lines = []
            for workout in recent_workouts:
                exercise_name = workout.exercise.name if workout.exercise else "Workout"
                details = []
                if workout.sets:
                    details.append(f"{workout.sets} sets")
                if workout.reps:
                    details.append(f"{workout.reps} reps")
                if workout.notes:
                    details.append(f"Notes: {workout.notes}")
                detail_text = f" ({', '.join(details)})" if details else ""
                workout_lines.append(
                    f"{workout.added_date.date().isoformat()} - {exercise_name}{detail_text}"
                )
            workout_section = "\n".join(workout_lines)
        else:
            workout_section = "No recent workouts logged."

        user_context = f"""
User Info:
Name: {name}
Sex: {sex}
Age: {age_display}
Height: {height_display}
Weight: {weight_display}
Activity Level: {activity_level}
Goal: {goal}

Recent Meals:
{meal_section}

Recent Workouts:
{workout_section}
""".strip()

        openai.api_key = os.getenv("OPENAI_API_KEY")
        response = openai.chat.completions.create(
            model="gpt-4o-mini",  # fast and cheaper for real-time support
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are Ram, the friendly AI assistant for the Shaktiman fitness app. "
                        "Offer supportive fitness guidance and troubleshooting tied to the user's context. "
                        "Keep every response within 2-3 sentences and avoid charts or formulas unless the user explicitly asks for them."
                    ),
                },
                {"role": "system", "content": user_context},
                {"role": "user", "content": user_message},
            ],
            max_tokens=200,
        )
        reply = response.choices[0].message.content.strip()
        return Response({"reply": reply})
    except Exception as e:
        print("Error communicating with OpenAI:", e)
        return Response({"error": str(e)}, status=500)
    
