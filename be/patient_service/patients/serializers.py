from rest_framework import serializers
from .models import PatientProfile, Appointment
import requests
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

from rest_framework import serializers
from .models import PatientProfile

class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = ['id','user_id', 'date_of_birth', 'address', 'medical_history', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_user_id(self, value):
        user = self.context['request'].user
        if not user.is_authenticated:
            raise serializers.ValidationError("User is not authenticated.")
        if not user.is_active:
            raise serializers.ValidationError("User is not active.")
        if user.role not in ['patient', 'admin', 'doctor', 'nurse', 'pharmacist', 'lab_technician', 'insurance_provider']:
            raise serializers.ValidationError("User must have role 'patient' or 'admin'.")
        if user.id != value:
            raise serializers.ValidationError("User ID does not match authenticated user.")
        return value
    
class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor_id', 'appointment_date', 'reason', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']