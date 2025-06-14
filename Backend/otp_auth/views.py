from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import OTP
from .serializers import OTPSerializer
from .utils import generate_otp, send_email_otp, send_sms_otp
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import User  # or your custom model
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken



class VerifyOTPAndAuthenticateView(APIView):
    def post(self, request):
        contact = request.data.get('contact')
        otp = request.data.get('otp')

        if not contact or not otp:
            return Response({'error': 'Contact and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)

    
        try:
            otp_entry = OTP.objects.get(contact=contact, otp=otp, is_verified=False)
        except OTP.DoesNotExist:
            return Response({'error': 'Invalid OTP or already verified'}, status=status.HTTP_400_BAD_REQUEST)

        if timezone.now() > otp_entry.expires_at:
            return Response({'error': 'OTP expired'}, status=status.HTTP_400_BAD_REQUEST)

  
        otp_entry.is_verified = True
        otp_entry.save()

     
        try:
            user = User.objects.get(username=contact)  
            # Step 5: Generate JWT
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({
                'message': 'User not registered',
                'register_required': True,
                'contact': contact
            }, status=status.HTTP_200_OK)
        


class SendOTP(APIView):
    def post(self, request):
        contact = request.data.get('contact')
        method = request.data.get('method')  # 'email' or 'sms'

        if not contact or method not in ['email', 'sms']:
            return Response({"error": "Missing or invalid contact/method"}, status=400)

        otp = generate_otp()
        expiry = timezone.now() + timedelta(minutes=5)

        OTP.objects.create(contact=contact, code=otp, expires_at=expiry)

        try:
            if method == 'email':
                send_email_otp(contact, otp)
            elif method == 'sms':
                send_sms_otp(contact, otp)
        except Exception as e:
            return Response({"error": f"Failed to send OTP: {str(e)}"}, status=500)

        return Response({"message": f"OTP sent via {method}"}, status=200)
