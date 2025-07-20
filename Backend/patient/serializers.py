from rest_framework import serializers
from accounts.models import CustomUser

class PatientProfileSerializer(serializers.ModelSerializer):
   

    class Meta:
        model = CustomUser
        fields = ['mobile_number','name','email','address','city','state','country']

    