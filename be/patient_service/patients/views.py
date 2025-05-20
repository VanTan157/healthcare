from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import PatientProfile, Appointment
from .serializers import PatientProfileSerializer, AppointmentSerializer
import logging

logger = logging.getLogger(__name__)

class PatientProfileViewSet(viewsets.ModelViewSet):
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer

    def get_permissions(self):
        logger.debug(f"Checking permissions for action: {self.action}, Request method: {self.request.method}, Path: {self.request.path}")
        # Cho phép tất cả với hành động 'list' (GET /api/patients/)
        if self.action == 'list':
            return [permissions.AllowAny()]
        # Các hành động tùy chỉnh không yêu cầu xác thực
        if self.action in ['get_by_user_id', 'update_by_user_id', 'partial_update_by_user_id', 'delete_by_user_id']:
            return []
        # Hành động create yêu cầu xác thực
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        # Các hành động còn lại (retrieve, update, partial_update, destroy) yêu cầu xác thực
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        logger.debug(f"User: {user}, Is authenticated: {user.is_authenticated}, ID: {getattr(user, 'id', None)}, Role: {getattr(user, 'role', 'N/A')}")
        # Nếu là admin hoặc doctor, trả về tất cả hồ sơ bệnh nhân
        if user.is_authenticated and (user.role == 'admin' or user.role == 'doctor'):
            return PatientProfile.objects.all()
        # Nếu không xác thực (với action 'list'), vẫn trả về tất cả hồ sơ
        if self.action == 'list':
            return PatientProfile.objects.all()
        # Với các hành động khác, chỉ trả về hồ sơ của người dùng hiện tại
        return PatientProfile.objects.filter(user_id=user.id)

    def perform_create(self, serializer):
        logger.debug(f"Creating profile for user_id: {self.request.user.id}")
        serializer.save(user_id=self.request.user.id)

    # Các action khác giữ nguyên
    @action(detail=False, methods=['get'], url_path='by_userId/(?P<user_id>\d+)')
    def get_by_user_id(self, request, user_id=None):
        logger.debug(f"Fetching patient profile for user_id: {user_id}")
        patient = get_object_or_404(PatientProfile, user_id=user_id)
        serializer = self.get_serializer(patient)
        return Response(serializer.data)

    @action(detail=False, methods=['put'], url_path='update_by_userId/(?P<user_id>\d+)')
    def update_by_user_id(self, request, user_id=None):
        logger.debug(f"Updating patient profile for user_id: {user_id}")
        patient = get_object_or_404(PatientProfile, user_id=user_id)
        serializer = self.get_serializer(patient, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            logger.debug(f"Successfully updated patient profile for user_id: {user_id}")
            return Response(serializer.data)
        logger.error(f"Validation errors for user_id {user_id}: {serializer.errors}")
        return Response(serializer.errors, status=400)

    @action(detail=False, methods=['patch'], url_path='partial_update_by_userId/(?P<user_id>\d+)')
    def partial_update_by_user_id(self, request, user_id=None):
        logger.debug(f"Partially updating patient profile for user_id: {user_id}")
        patient = get_object_or_404(PatientProfile, user_id=user_id)
        serializer = self.get_serializer(patient, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            logger.debug(f"Successfully partially updated patient profile for user_id: {user_id}")
            return Response(serializer.data)
        logger.error(f"Validation errors for user_id {user_id}: {serializer.errors}")
        return Response(serializer.errors, status=400)

    @action(detail=False, methods=['delete'], url_path='delete_by_userId/(?P<user_id>\d+)')
    def delete_by_user_id(self, request, user_id=None):
        logger.debug(f"Deleting patient profile for user_id: {user_id}")
        patient = get_object_or_404(PatientProfile, user_id=user_id)
        patient.delete()
        logger.debug(f"Successfully deleted patient profile for user_id: {user_id}")
        return Response(status=204)

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def get_permissions(self):
        if self.action in ['get_by_patient_id', 'get_by_doctor_id', 'update_status']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'admin':
            return Appointment.objects.all()
        return Appointment.objects.filter(patient__user_id=user.id)

    def perform_create(self, serializer):
        patient = get_object_or_404(PatientProfile, user_id=self.request.user.id)
        serializer.save(patient=patient)

    @action(detail=False, methods=['get'], url_path='by_patientId/(?P<patient_id>\d+)')
    def get_by_patient_id(self, request, patient_id=None):
        """
        Lấy danh sách lịch hẹn theo patient_id.
        URL: GET /api/appointments/by_patientId/{patientId}
        """
        logger.debug(f"Fetching appointments for patient_id: {patient_id}")
        appointments = Appointment.objects.filter(patient__user_id=patient_id)
        if not appointments.exists():
            logger.debug(f"No appointments found for patient_id: {patient_id}")
            return Response({"detail": f"No appointments found for patient_id {patient_id}"}, status=404)
        serializer = self.get_serializer(appointments, many=True)
        logger.debug(f"Successfully fetched {appointments.count()} appointments for patient_id: {patient_id}")
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='by_doctorId/(?P<doctor_id>\d+)')
    def get_by_doctor_id(self, request, doctor_id=None):
        """
        Lấy danh sách lịch hẹn theo doctor_id.
        URL: GET /api/appointments/by_doctorId/{doctorId}
        """
        logger.debug(f"Fetching appointments for doctor_id: {doctor_id}")
        appointments = Appointment.objects.filter(doctor_id=doctor_id)
        if not appointments.exists():
            logger.debug(f"No appointments found for doctor_id: {doctor_id}")
            return Response({"detail": f"No appointments found for doctor_id {doctor_id}"}, status=404)
        serializer = self.get_serializer(appointments, many=True)
        logger.debug(f"Successfully fetched {appointments.count()} appointments for doctor_id: {doctor_id}")
        return Response(serializer.data)

    @action(detail=True, methods=['put'], url_path='update_status')
    def update_status(self, request, pk=None):
        """
        Cập nhật trạng thái lịch hẹn theo id.
        URL: PUT /api/appointments/{id}/update_status/
        Body: {"status": "confirmed"} (hoặc "pending", "cancelled")
        """
        logger.debug(f"Updating status for appointment id: {pk}")
        appointment = get_object_or_404(Appointment, pk=pk)
        status = request.data.get('status')
        if status not in [choice[0] for choice in Appointment.STATUS_CHOICES]:
            logger.error(f"Invalid status: {status} for appointment id: {pk}")
            return Response({"detail": f"Invalid status. Must be one of: {', '.join([choice[0] for choice in Appointment.STATUS_CHOICES])}"}, status=400)
        appointment.status = status
        appointment.save()
        serializer = self.get_serializer(appointment)
        logger.debug(f"Successfully updated status to {status} for appointment id: {pk}")
        return Response(serializer.data)