from rest_framework import serializers
from .models import DoctorProfile, Diagnosis
import requests
from django.conf import settings
import logging

# Khởi tạo logger để ghi log cho serializer
logger = logging.getLogger(__name__)

class DoctorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        # Chỉ định model DoctorProfile để serialize
        model = DoctorProfile
        # Liệt kê các trường sẽ được serialize
        fields = ['id', 'user_id', 'specialty', 'clinic', 'schedule', 'created_at', 'updated_at']
        # Các trường chỉ đọc, không cho phép cập nhật qua API
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_user_id(self, value):
        return value

class DiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        # Chỉ định model Diagnosis để serialize
        model = Diagnosis
        # Liệt kê các trường sẽ được serialize
        fields = ['id', 'patient_id', 'doctor', 'diagnosis_date', 'description', 'created_at', 'updated_at']
        # Các trường chỉ đọc, không cho phép cập nhật qua API
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_user_id(self, value):
        return value