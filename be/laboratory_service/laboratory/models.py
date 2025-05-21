# Định nghĩa các model cho laboratory_service
from django.db import models

class LabRequest(models.Model):
    # Trạng thái yêu cầu xét nghiệm
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    # ID bệnh nhân (lưu trực tiếp, không kiểm tra)
    patient_id = models.IntegerField()
    # ID bác sĩ (lưu trực tiếp, không kiểm tra)
    doctor_id = models.IntegerField()
    # Loại xét nghiệm (ví dụ: máu, nước tiểu)
    test_type = models.CharField(max_length=100)
    # Mô tả yêu cầu xét nghiệm
    description = models.TextField(blank=True)
    # Trạng thái yêu cầu
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    # Thời gian tạo và cập nhật
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Lab Request {self.id} for Patient {self.patient_id}"

class LabResult(models.Model):
    # Yêu cầu xét nghiệm liên quan
    lab_request = models.ForeignKey(LabRequest, on_delete=models.CASCADE, related_name='results')
    # Ngày công bố kết quả
    result_date = models.DateTimeField()
    # Nội dung kết quả xét nghiệm
    details = models.TextField()
    # Thời gian tạo và cập nhật
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Lab Result for Request {self.lab_request.id}"