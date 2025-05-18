from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import PatientProfile, Appointment
from .serializers import PatientProfileSerializer, AppointmentSerializer
from django.shortcuts import get_object_or_404
import logging
logger = logging.getLogger(__name__)

class PatientProfileViewSet(viewsets.ModelViewSet):
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer

    def get_permissions(self):
        logger.debug(f"Checking permissions for action: {self.action}, User: {self.request.user}, Authenticated: {self.request.user.is_authenticated}")
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        # Chỉ cho phép người dùng xem hồ sơ của họ hoặc Admin xem tất cả
       
        user = self.request.user
        logger.debug(f"User: {user}, Is authenticated: {user.is_authenticated}, ID: {getattr(user, 'id', None)}, Role: {getattr(user, 'role', 'N/A')}")
        if user.is_authenticated and user.role == 'admin':
            return PatientProfile.objects.all()
        return PatientProfile.objects.filter(user_id=user.id)

    def perform_create(self, serializer):
        # Đảm bảo user_id là ID của người dùng đang đăng nhập
        logger.debug(f"Creating profile for user_id: {self.request.user.id}")
        serializer.save(user_id=self.request.user.id)

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        # Chỉ cho phép người dùng xem lịch hẹn của họ hoặc Admin xem tất cả
        user = self.request.user
        if user.is_authenticated and user.role == 'admin':
            return Appointment.objects.all()
        return Appointment.objects.filter(patient__user_id=user.id)

    def perform_create(self, serializer):
        # Tự động gán patient dựa trên user_id
        patient = get_object_or_404(PatientProfile, user_id=self.request.user.id)
        serializer.save(patient=patient)