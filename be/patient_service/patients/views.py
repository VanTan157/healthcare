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
        # Bỏ xác thực cho get_by_user_id, update_by_user_id, partial_update_by_user_id, delete_by_user_id
        if self.action in ['get_by_user_id', 'update_by_user_id', 'partial_update_by_user_id', 'delete_by_user_id']:
            return []
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        logger.debug(f"User: {user}, Is authenticated: {user.is_authenticated}, ID: {getattr(user, 'id', None)}, Role: {getattr(user, 'role', 'N/A')}")
        if user.is_authenticated and user.role == 'admin':
            return PatientProfile.objects.all()
        return PatientProfile.objects.filter(user_id=user.id)

    def perform_create(self, serializer):
        logger.debug(f"Creating profile for user_id: {self.request.user.id}")
        serializer.save(user_id=self.request.user.id)

    @action(detail=False, methods=['get'], url_path='by_userId/(?P<user_id>\d+)')
    def get_by_user_id(self, request, user_id=None):
        """
        Lấy hồ sơ bệnh nhân theo user_id.
        URL: GET /api/patients/by_userId/{userId}
        """
        logger.debug(f"Fetching patient profile for user_id: {user_id}")
        patient = get_object_or_404(PatientProfile, user_id=user_id)
        serializer = self.get_serializer(patient)
        return Response(serializer.data)

    @action(detail=False, methods=['put'], url_path='update_by_userId/(?P<user_id>\d+)')
    def update_by_user_id(self, request, user_id=None):
        """
        Cập nhật toàn bộ hồ sơ bệnh nhân theo user_id.
        URL: PUT /api/patients/update_by_userId/{userId}
        """
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
        """
        Cập nhật từng phần hồ sơ bệnh nhân theo user_id.
        URL: PATCH /api/patients/partial_update_by_userId/{userId}
        """
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
        """
        Xóa hồ sơ bệnh nhân theo user_id.
        URL: DELETE /api/patients/delete_by_userId/{userId}
        """
        logger.debug(f"Deleting patient profile for user_id: {user_id}")
        patient = get_object_or_404(PatientProfile, user_id=user_id)
        patient.delete()
        logger.debug(f"Successfully deleted patient profile for user_id: {user_id}")
        return Response(status=204)

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'admin':
            return Appointment.objects.all()
        return Appointment.objects.filter(patient__user_id=user.id)

    def perform_create(self, serializer):
        patient = get_object_or_404(PatientProfile, user_id=self.request.user.id)
        serializer.save(patient=patient)