from rest_framework import serializers
from accounts.models import UserDoctor
from .models import Speciality


class DoctorProfileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()

    class Meta:
        model = UserDoctor
        fields = ['name', 'specialization', 'fees', 'availability', 'address','age']

    def get_name(self, obj):
        return obj.user.name
    def get_age(self, obj):
        return obj.user.age
    def get_address(self, obj):
        user = obj.user
        address_parts = [user.address, user.city, user.state, user.country]
        # Filter out any empty parts
        full_address = ', '.join(filter(None, address_parts))
        return full_address



class SpecialitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Speciality
        fields = ['id', 'name', 'image_url']
