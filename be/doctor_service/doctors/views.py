# Định nghĩa views để xử lý các yêu cầu API
from rest_framework import viewsets, permissions, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import DoctorProfile, Diagnosis
from .serializers import DoctorProfileSerializer, DiagnosisSerializer
from django.shortcuts import get_object_or_404
import requests
from django.conf import settings

# Trong DoctorProfileViewSet
class DoctorProfileViewSet(viewsets.ModelViewSet):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer

    def get_permissions(self):
        return [permissions.AllowAny()]  # Cho phép tất cả yêu cầu

    def get_queryset(self):
        return DoctorProfile.objects.all()

    def perform_create(self, serializer):
        serializer.save()  
    @action(detail=False, methods=['get', 'put', 'patch'], url_path='user/(?P<user_id>\d+)')
    def by_user_id(self, request, user_id=None):
        # Tìm DoctorProfile theo user_id
        doctor_profile = get_object_or_404(DoctorProfile, user_id=user_id)
        
        if request.method == 'GET':
            # Trả về thông tin DoctorProfile
            serializer = self.get_serializer(doctor_profile)
            return Response(serializer.data)
        
        # Xử lý PUT/PATCH (cập nhật)
        serializer = self.get_serializer(doctor_profile, data=request.data, partial=request.method == 'PATCH')
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

# Trong DiagnosisViewSet
class DiagnosisViewSet(viewsets.ModelViewSet):
    queryset = Diagnosis.objects.all()
    serializer_class = DiagnosisSerializer

    def get_permissions(self):
        return [permissions.AllowAny()]  # Cho phép tất cả yêu cầu

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'admin':
            return Diagnosis.objects.all()
        elif user.is_authenticated:
            return Diagnosis.objects.filter(doctor__user_id=user.id)
        else:
            return Diagnosis.objects.all()  # Trả về tất cả cho người dùng không xác thực

    def perform_create(self, serializer):
        # Lấy doctor_id từ dữ liệu gửi lên
        doctor_id = self.request.data.get('doctor')
        if not doctor_id:
            raise serializers.ValidationError("Doctor ID is required.")
        doctor = get_object_or_404(DoctorProfile, id=doctor_id)
        serializer.save(doctor=doctor)

class AppointmentViewSet(viewsets.ViewSet):
    def get_permissions(self):
        return [permissions.AllowAny()]  # Cho phép tất cả yêu cầu

    @action(detail=False, methods=['get'])
    def list(self, request):
        # Lấy danh sách lịch hẹn của bác sĩ từ patient_service
        user = request.user
        try:
            # Gọi API patient_service để lấy lịch hẹn
            response = requests.get(
                f"{settings.PATIENT_SERVICE_URL}appointments/",
                params={'doctor_id': user.id},
                headers={'Authorization': f'Bearer {request.auth}'},
                timeout=5
            )
            if response.status_code != 200:
                return Response({"detail": "Unable to fetch appointments"}, status=response.status_code)
            return Response(response.json())
        except requests.RequestException:
            return Response({"detail": "Error communicating with patient_service"}, status=500)

    @action(detail=True, methods=['put'])
    def update_status(self, request, pk=None):
        # Cập nhật trạng thái lịch hẹn (xác nhận/hủy)
        try:
            # Gọi API patient_service để cập nhật trạng thái
            response = requests.put(
                f"{settings.PATIENT_SERVICE_URL}appointments/{pk}/",
                json={'status': request.data.get('status')},
                headers={'Authorization': f'Bearer {request.auth}'},
                timeout=5
            )
            if response.status_code != 200:
                return Response({"detail": "Unable to update appointment"}, status=response.status_code)
            return Response(response.json())
        except requests.RequestException:
            return Response({"detail": "Error communicating with patient_service"}, status=500)