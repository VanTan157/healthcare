# Cấu hình giao diện Django Admin cho các model
from django.contrib import admin
from .models import LabRequest, LabResult

@admin.register(LabRequest)
class LabRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient_id', 'doctor_id', 'status']  # Hiển thị các trường trong danh sách
    search_fields = ['patient_id', 'doctor_id']  # Cho phép tìm kiếm theo patient_id, doctor_id
    list_filter = ['status']  # Lọc theo trạng thái

@admin.register(LabResult)
class LabResultAdmin(admin.ModelAdmin):
    list_display = ['lab_request', 'result_date']  # Hiển thị các trường trong danh sách
    search_fields = ['lab_request__id']  # Cho phép tìm kiếm theo lab_request