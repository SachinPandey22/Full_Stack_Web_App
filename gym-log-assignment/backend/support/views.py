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

        user_context = f"""
User Info:
Name: {name}
Sex: {sex}
Age: {age_display}
Height: {height_display}
Weight: {weight_display}
Activity Level: {activity_level}
Goal: {goal}
""".strip()

        openai.api_key = os.getenv("OPENAI_API_KEY")
        response = openai.chat.completions.create(
            model="gpt-4o-mini",  # fast and cheaper for real-time support
            messages=[
                {"role": "system", "content": "You are Ram: a friendly AI assistant for Shaktiman application that helps users troubleshoot their Issues here in the application. give short just the required answer to user queres"},
                #{"role": "system", "context": "give short just the required answer to user queres "},
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
    
