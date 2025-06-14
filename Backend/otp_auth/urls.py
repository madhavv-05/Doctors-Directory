from django.urls import path
from .views import SendOTP, VerifyOTPAndAuthenticateView

urlpatterns = [
    path('send/', SendOTP.as_view(), name='send_otp'),
   path('verify-otp/', VerifyOTPAndAuthenticateView.as_view(), name='verify_otp'),
]
