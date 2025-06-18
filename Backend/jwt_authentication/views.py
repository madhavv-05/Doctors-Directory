from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.models import CustomUser
from otp_auth.models import OTP
from django.utils import timezone
from .serializers import RegisterUserSerializer
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken, TokenError



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer



class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]  # Ensures only valid JWT tokens work

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'email': user.email,
            'phone': user.mobile_number,
            'user_type': user.user_type,
        })
    



class OTPLoginView(APIView):
    def post(self, request):
        
        contact = request.data.get('contact')
        otp = request.data.get('code')

        # Check OTP existence and validity
        try:
            otp_obj = OTP.objects.get(contact=contact, code=otp, is_verified=False)
        except OTP.DoesNotExist:
            return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)

        if otp_obj.expires_at < timezone.now():
            return Response({"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)

        otp_obj.is_verified = True
        otp_obj.save()

        # Check if user is registered
        try:
            user = CustomUser.objects.get(mobile_number=contact)
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "OTP verified, user authenticated",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user_id": user.id,
                "user_type": user.user_type,
            })
        except CustomUser.DoesNotExist:
            # User not registered, only OTP verified
            return Response({
                "message": "OTP verified, user not registered",
                "contact": contact
            }, status=status.HTTP_202_ACCEPTED)




class RegisterUserView(APIView):
    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)

        except TokenError:
            return Response({"error": "Invalid token or already blacklisted"}, status=status.HTTP_400_BAD_REQUEST)
