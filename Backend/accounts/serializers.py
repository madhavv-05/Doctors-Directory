# accounts/serializers.py

from rest_framework import serializers
from accounts.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *

class RegisterUserSerializer(serializers.ModelSerializer):
    specialization = serializers.CharField(required=False)
    fees = serializers.IntegerField(required=False)
    experience = serializers.IntegerField(required=False)

    working_on = serializers.CharField(required=False)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'name', 'email', 'mobile_number', 'age',
            'address', 'city', 'state', 'country', 'profile_picture',
            'user_type',  # will default to patient
            'specialization', 'fees', 'experience', 'working_on'
        ]
        extra_kwargs = {
            'name': {'required': True},
            'mobile_number': {'required': True},
            'user_type': {'required': False, 'default': 'patient'},
        }

    def create(self, validated_data):
        # Separate doctor-specific fields
        doctor_fields = {
            key: validated_data.pop(key)
            for key in ['specialization', 'fees', 'experience', 'working_on']
            if key in validated_data
        }

        # Default to patient if user_type not explicitly passed
        user_type = validated_data.get('user_type', 'patient')
        validated_data['user_type'] = user_type

        user = CustomUser.objects.create(**validated_data)

        # If user is a doctor, create related UserDoctor object
        if user.user_type == 'doctor':
            UserDoctor.objects.create(user=user, **doctor_fields)

        return user

    def to_representation(self, instance):
        refresh = RefreshToken.for_user(instance)
        return {
            "message": "User registered successfully",
            "user_id": str(instance.id),
            "user_type": instance.user_type,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
