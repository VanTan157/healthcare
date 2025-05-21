# Cấu hình giao diện Django Admin cho các model
from django.contrib import admin
from .models import InsuranceContract, InsuranceClaim

@admin.register(InsuranceContract)
class InsuranceContractAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient_id', 'policy_number', 'provider']  # Hiển thị các trường trong danh sách
    search_fields = ['patient_id', 'policy_number']  # Cho phép tìm kiếm theo patient_id, policy_number

@admin.register(InsuranceClaim)
class InsuranceClaimAdmin(admin.ModelAdmin):
    list_display = ['id', 'contract', 'amount', 'status']  # Hiển thị các trường trong danh sách
    search_fields = ['contract__patient_id']  # Cho phép tìm kiếm theo patient_id
    list_filter = ['status']  # Lọc theo trạng thái