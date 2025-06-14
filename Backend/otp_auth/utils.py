import random
from datetime import timedelta
from django.utils import timezone
from django.core.mail import send_mail
import boto3
from django.conf import settings

def generate_otp():
    return str(random.randint(100000, 999999))

def send_email_otp(to_email, otp):
    subject = "Your OTP Code"
    message = f"Your OTP is: {otp}"
    from_email = settings.EMAIL_HOST_USER
    send_mail(subject, message, from_email, [to_email])

def send_sms_otp(phone_number, otp):
    client = boto3.client(
        'sns',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION_NAME
    )

    message = f'Your OTP is: {otp}'
    response = client.publish(
        PhoneNumber=phone_number,
        Message=message,
    )
    return response