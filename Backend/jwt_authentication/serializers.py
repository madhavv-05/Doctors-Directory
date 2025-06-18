from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from accounts.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Attach extra claims (will be encoded into the access token)
        token['email'] = user.email
        token['phone'] = user.mobile_number
        token['user_type'] = user.user_type

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Add extra info in the login response
        data['id'] = self.user.id
        data['email'] = self.user.email
        data['phone'] = self.user.mobile_number
        data['user_type'] = self.user.user_type

        return data


class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'mobile_number', 'email', 'user_type', 'name',
             'age', 'address', 'city', 'state', 'country', 'profile_picture'
        ]
        extra_kwargs = {
            'mobile_number': {'required': True},
            'email': {'required': False},
            'user_type': {'required': True},
            'name': {'required': True},
        }

    def create(self, validated_data):
        user = CustomUser.objects.create(**validated_data)
        return user

    def to_representation(self, instance):
        refresh = RefreshToken.for_user(instance)
        return {
            "message": "User registered successfully",
            "user_id": instance.id,
            "user_type": instance.user_type,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }

