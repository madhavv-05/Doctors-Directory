
from django.urls import path
from .views import *

urlpatterns = [
    path('profile/', PatientProfileView.as_view(), name='profile'),
]
