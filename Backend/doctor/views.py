from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.models import UserDoctor
from .serializers import DoctorProfileSerializer

class DoctorHomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            doctor = UserDoctor.objects.get(user=request.user)
        except UserDoctor.DoesNotExist:
            return Response({"detail": "Doctor profile not found."}, status=404)

        serializer = DoctorProfileSerializer(doctor)
        return Response(serializer.data)
