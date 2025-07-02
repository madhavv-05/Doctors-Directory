from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.models import CustomUser
from .serializers import *

class PatientProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            patient = request.user
        except CustomUser.DoesNotExist:
            return Response({"detail": "Patient profile not found."}, status=404)

        serializer = PatientProfileSerializer(patient)
        return Response(serializer.data)
