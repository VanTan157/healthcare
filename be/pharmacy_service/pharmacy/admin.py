# Cấu hình giao diện Django Admin cho các model
from django.contrib import admin
from .models import Prescription, Medicine

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient_id', 'doctor_id', 'status']  # Hiển thị các trường trong danh sách
    search_fields = ['patient_id', 'doctor_id']  # Cho phép tìm kiếm theo patient_id, doctor_id
    list_filter = ['status']  # Lọc theo trạng thái

@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ['name', 'quantity', 'price']  # Hiển thị các trường trong danh sách
    search_fields = ['name']  # Cho phép tìm kiếm theo tên thuốc