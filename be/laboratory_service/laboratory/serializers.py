# Định nghĩa serializers để xử lý dữ liệu API
from rest_framework import serializers
from .models import LabRequest, LabResult

class LabRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabRequest
        fields = ['id', 'patient_id', 'doctor_id', 'test_type', 'description', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class LabResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabResult
        fields = ['id', 'lab_request', 'result_date', 'details', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']