from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.models import *
from .serializers import *
from .models import Speciality


class DoctorHomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            doctor = UserDoctor.objects.get(user=request.user)
        except UserDoctor.DoesNotExist:
            return Response({"detail": "Doctor profile not found."}, status=404)

        serializer = DoctorProfileSerializer(doctor)
        return Response(serializer.data)



class SpecialityListView(APIView):
    def get(self, request):
        specialities = Speciality.objects.all()
        serializer = SpecialitySerializer(specialities, many=True)
        return Response(serializer.data)
