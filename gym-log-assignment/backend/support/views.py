from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.core.mail import get_connection, send_mail
import ssl, certifi
import openai
import os

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
def chat_with_ai(request):
    user_message = request.data.get("message", "")
    if not user_message:
        return Response({"error": "Message required"}, status=400)

    try:
        openai.api_key = os.getenv("OPENAI_API_KEY")
        response = openai.chat.completions.create(
            model="gpt-4o-mini",  # fast and cheaper for real-time support
            messages=[
                {"role": "system", "content": "You are a friendly AI assistant that helps users troubleshoot their fitness app or website issues."},
                {"role": "user", "content": user_message},
            ],
            max_tokens=200,
        )
        reply = response.choices[0].message.content.strip()
        return Response({"reply": reply})
    except Exception as e:
        print("Error communicating with OpenAI:", e)
        return Response({"error": str(e)}, status=500)
    

