# Định nghĩa serializers để xử lý dữ liệu API
from rest_framework import serializers
from .models import DoctorProfile, Diagnosis
import requests
from django.conf import settings

class DoctorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = ['id', 'user_id', 'specialty', 'clinic', 'schedule', 'created_at', 'updated_at']
        read_only_fields = ['id','created_at', 'updated_at']

    # def validate_user_id(self, value):
    #     # Gọi API user_service để kiểm tra user tồn tại và có vai trò doctor hoặc admin
    #     try:
    #         response = requests.get(f"{settings.USER_SERVICE_URL}{value}/", timeout=5)
    #         if response.status_code != 200:
    #             raise serializers.ValidationError("User does not exist.")
    #         user_data = response.json()
    #         if user_data.get('role') not in ['doctor', 'admin']:
    #             raise serializers.ValidationError("User must have role 'doctor' or 'admin'.")
    #     except requests.RequestException:
    #         raise serializers.ValidationError("Unable to verify user with user_service.")
    #     return value
    def validate_user_id(self, value):
        return value  

class DiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagnosis
        fields = ['id', 'patient_id', 'doctor', 'diagnosis_date', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    # def validate_patient_id(self, value):
    #     # Gọi API patient_service để kiểm tra bệnh nhân tồn tại
    #     try:
    #         response = requests.get(f"{settings.PATIENT_SERVICE_URL}patients/{value}/", timeout=5)
    #         if response.status_code != 200:
    #             raise serializers.ValidationError("Patient does not exist.")
    #     except requests.RequestException:
    #         raise serializers.ValidationError("Unable to verify patient with patient_service.")
    #     return value
    def validate_user_id(self, value):
        return value  # Bỏ kiểm tra user_service