from rest_framework import serializers
from .models import Prescription, Medicine
import requests
from django.conf import settings
import logging

# Khởi tạo logger để ghi log cho serializer
logger = logging.getLogger(__name__)

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        # Chỉ định model Prescription để serialize
        model = Prescription
        # Liệt kê các trường sẽ được serialize
        fields = ['id', 'patient_id', 'doctor_id', 'diagnosis_id', 'details', 'status', 'created_at', 'updated_at']
        # Các trường chỉ đọc, không cho phép cập nhật qua API
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        return data

class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        # Chỉ định model Medicine để serialize
        model = Medicine
        # Liệt kê các trường sẽ được serialize
        fields = ['id', 'name', 'description', 'quantity', 'price', 'created_at', 'updated_at']
        # Các trường chỉ đọc, không cho phép cập nhật qua API
        read_only_fields = ['id', 'created_at', 'updated_at']