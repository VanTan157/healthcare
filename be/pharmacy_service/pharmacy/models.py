from django.db import models

class Prescription(models.Model):
    # Lựa chọn trạng thái cho đơn thuốc
    STATUS_CHOICES = (
        ('pending', 'Pending'),  # Đơn thuốc đang chờ xử lý
        ('dispensed', 'Dispensed'),  # Đơn thuốc đã được cấp phát
        ('cancelled', 'Cancelled'),  # Đơn thuốc bị hủy
    )
    # ID bệnh nhân từ patient_service, lưu dưới dạng số nguyên
    patient_id = models.IntegerField()
    # ID bác sĩ từ doctor_service, lưu dưới dạng số nguyên
    doctor_id = models.IntegerField()
    # ID chẩn đoán từ doctor_service, liên kết đơn thuốc với chẩn đoán
    diagnosis_id = models.IntegerField()
    # Chi tiết đơn thuốc (danh sách thuốc, liều lượng, lưu dạng text)
    details = models.TextField()
    # Trạng thái đơn thuốc, mặc định là 'pending'
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    # Thời gian tạo và cập nhật tự động
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        # Chuỗi đại diện cho đơn thuốc
        return f"Prescription {self.id} for Patient {self.patient_id}"

class Medicine(models.Model):
    # Tên thuốc, duy nhất trong hệ thống
    name = models.CharField(max_length=100, unique=True)
    # Mô tả thuốc, có thể để trống
    description = models.TextField(blank=True)
    # Số lượng thuốc trong kho, không âm
    quantity = models.PositiveIntegerField()
    # Giá mỗi đơn vị thuốc, hỗ trợ 2 chữ số thập phân
    price = models.DecimalField(max_digits=10, decimal_places=2)
    # Thời gian tạo và cập nhật tự động
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        # Chuỗi đại diện cho thuốc
        return f"Medicine {self.name}"