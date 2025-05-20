from rest_framework import viewsets, permissions, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import DoctorProfile, Diagnosis
from .serializers import DoctorProfileSerializer, DiagnosisSerializer
from django.shortcuts import get_object_or_404
import requests
from django.conf import settings
import logging

# Khởi tạo logger để ghi log cho ứng dụng
logger = logging.getLogger(__name__)

class DoctorProfileViewSet(viewsets.ModelViewSet):
    # Định nghĩa queryset mặc định để lấy tất cả hồ sơ bác sĩ
    queryset = DoctorProfile.objects.all()
    # Chỉ định serializer để xử lý dữ liệu DoctorProfile
    serializer_class = DoctorProfileSerializer

    def get_permissions(self):
        return [permissions.AllowAny()]

    def get_queryset(self):
        # Trả về toàn bộ hồ sơ bác sĩ
        return DoctorProfile.objects.all()

    def perform_create(self, serializer):
        # Lưu hồ sơ bác sĩ mới vào cơ sở dữ liệu
        # Không thực hiện thêm logic nào ngoài việc gọi save() của serializer
        serializer.save()

    @action(detail=False, methods=['get', 'put', 'patch'], url_path='user/(?P<user_id>\d+)')
    def by_user_id(self, request, user_id=None):
        """
        Endpoint tùy chỉnh để lấy hoặc cập nhật hồ sơ bác sĩ theo user_id.
        URL: GET/PUT/PATCH /api/doctors/user/{user_id}/
        """
        # Tìm hồ sơ bác sĩ dựa trên user_id, trả về 404 nếu không tìm thấy
        doctor_profile = get_object_or_404(DoctorProfile, user_id=user_id)
        
        if request.method == 'GET':
            # Nếu là GET, serialize và trả về dữ liệu hồ sơ bác sĩ
            serializer = self.get_serializer(doctor_profile)
            return Response(serializer.data)
        
        # Nếu là PUT hoặc PATCH, cập nhật hồ sơ bác sĩ
        # partial=True cho PATCH để cho phép cập nhật một phần
        serializer = self.get_serializer(doctor_profile, data=request.data, partial=request.method == 'PATCH')
        if serializer.is_valid():
            # Lưu dữ liệu cập nhật vào cơ sở dữ liệu
            serializer.save()
            return Response(serializer.data)
        # Trả về lỗi nếu dữ liệu không hợp lệ
        return Response(serializer.errors, status=400)

class DiagnosisViewSet(viewsets.ModelViewSet):
    # Định nghĩa queryset mặc định để lấy tất cả chuẩn đoán
    queryset = Diagnosis.objects.all()
    # Chỉ định serializer để xử lý dữ liệu Diagnosis
    serializer_class = DiagnosisSerializer

    def get_permissions(self):
        # Cho phép tất cả yêu cầu
        return [permissions.AllowAny()]

    def get_queryset(self):
        # Lấy user từ request
        user = self.request.user
        if user.is_authenticated and user.role == 'admin':
            # Nếu user là admin, trả về tất cả chuẩn đoán
            return Diagnosis.objects.all()
        elif user.is_authenticated:
            # Nếu user là bác sĩ, chỉ trả về chuẩn đoán của họ
            return Diagnosis.objects.filter(doctor__user_id=user.id)
        else:
            return Diagnosis.objects.all()

    def perform_create(self, serializer):
        # Lấy doctor_id từ dữ liệu gửi lên
        doctor_id = self.request.data.get('doctor')
        if not doctor_id:
            # Nếu không có doctor_id, trả về lỗi
            raise serializers.ValidationError("Doctor ID is required.")
        # Tìm DoctorProfile theo doctor_id, trả về 404 nếu không tìm thấy
        doctor = get_object_or_404(DoctorProfile, id=doctor_id)
        # Lưu chuẩn đoán mới với doctor được chỉ định
        serializer.save(doctor=doctor)

    @action(detail=False, methods=['get'], url_path='by_patientId/(?P<patient_id>\d+)')
    def get_by_patient_id(self, request, patient_id=None):
        """
        Endpoint tùy chỉnh để lấy danh sách chuẩn đoán theo patient_id.
        URL: GET /api/diagnoses/by_patientId/{patient_id}/
        """
        logger.debug(f"Fetching diagnoses for patient_id: {patient_id}")
        # Lọc các chuẩn đoán theo patient_id
        diagnoses = Diagnosis.objects.filter(patient_id=patient_id)
        if not diagnoses.exists():
            # Nếu không tìm thấy chuẩn đoán, trả về lỗi 404
            logger.debug(f"No diagnoses found for patient_id: {patient_id}")
            return Response({"detail": f"No diagnoses found for patient_id {patient_id}"}, status=404)
        # Serialize danh sách chuẩn đoán và trả về
        serializer = self.get_serializer(diagnoses, many=True)
        logger.debug(f"Successfully fetched {diagnoses.count()} diagnoses for patient_id: {patient_id}")
        return Response(serializer.data)

class AppointmentViewSet(viewsets.ViewSet):
    def get_permissions(self):
        # Cho phép tất cả yêu cầu
        return [permissions.AllowAny()]

    @action(detail=False, methods=['get'])
    def list(self, request):
        """
        Endpoint để lấy danh sách lịch hẹn của bác sĩ từ patient_service.
        URL: GET /api/appointments/
        """
        # Lấy user từ request
        user = request.user
        try:
            # Gọi API patient_service để lấy danh sách lịch hẹn theo doctor_id
            response = requests.get(
                f"{settings.PATIENT_SERVICE_URL}appointments/",
                params={'doctor_id': user.id},
                headers={'Authorization': f'Bearer {request.auth}'},
                timeout=5
            )
            if response.status_code != 200:
                # Nếu API trả về lỗi, trả về mã trạng thái tương ứng
                logger.error(f"Failed to fetch appointments for doctor_id {user.id}: {response.status_code}")
                return Response({"detail": "Unable to fetch appointments"}, status=response.status_code)
            # Trả về dữ liệu JSON từ patient_service
            return Response(response.json())
        except requests.RequestException as e:
            # Xử lý lỗi kết nối với patient_service
            logger.error(f"Error communicating with patient_service: {str(e)}")
            return Response({"detail": "Error communicating with patient_service"}, status=500)

    @action(detail=True, methods=['put'])
    def update_status(self, request, pk=None):
        """
        Endpoint để cập nhật trạng thái lịch hẹn (xác nhận/hủy).
        URL: PUT /api/appointments/{pk}/update-status/
        """
        try:
            # Gọi API patient_service để cập nhật trạng thái lịch hẹn
            response = requests.put(
                f"{settings.PATIENT_SERVICE_URL}appointments/{pk}/",
                json={'status': request.data.get('status')},
                headers={'Authorization': f'Bearer {request.auth}'},
                timeout=5
            )
            if response.status_code != 200:
                # Nếu API trả về lỗi, trả về mã trạng thái tương ứng
                logger.error(f"Failed to update appointment {pk}: {response.status_code}")
                return Response({"detail": "Unable to update appointment"}, status=response.status_code)
            # Trả về dữ liệu JSON từ patient_service
            return Response(response.json())
        except requests.RequestException as e:
            # Xử lý lỗi kết nối với patient_service
            logger.error(f"Error communicating with patient_service: {str(e)}")
            return Response({"detail": "Error communicating with patient_service"}, status=500)