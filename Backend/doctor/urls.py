
from django.urls import path
from .views import *

urlpatterns = [
    path('home/', DoctorHomeView.as_view(), name='home'),
]
