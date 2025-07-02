
from django.urls import path
from .views import *

urlpatterns = [
    path('home/', DoctorHomeView.as_view(), name='home'),
    path('specialities/', SpecialityListView.as_view(), name='speciality-list'),
]
