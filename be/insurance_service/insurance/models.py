# Định nghĩa các model cho insurance_service
from django.db import models

class InsuranceContract(models.Model):
    # ID bệnh nhân (lưu trực tiếp, không kiểm tra)
    patient_id = models.IntegerField()
    # Số hợp đồng bảo hiểm
    policy_number = models.CharField(max_length=50, unique=True)
    # Nhà cung cấp bảo hiểm
    provider = models.CharField(max_length=100)
    # Ngày bắt đầu hợp đồng
    start_date = models.DateField()
    # Ngày hết hạn hợp đồng
    end_date = models.DateField()
    # Chi tiết hợp đồng
    details = models.TextField(blank=True)
    # Thời gian tạo và cập nhật
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Contract {self.policy_number} for Patient {self.patient_id}"

class InsuranceClaim(models.Model):
    # Trạng thái yêu cầu bồi thường
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    # Hợp đồng bảo hiểm liên quan
    contract = models.ForeignKey(InsuranceContract, on_delete=models.CASCADE, related_name='claims')
    # Số tiền yêu cầu bồi thường
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    # Ngày gửi yêu cầu
    claim_date = models.DateTimeField()
    # Mô tả yêu cầu
    description = models.TextField()
    # Trạng thái yêu cầu
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    # Thời gian tạo và cập nhật
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Claim for Contract {self.contract.policy_number}"