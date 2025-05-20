# Định nghĩa các model cho doctor_service
from django.db import models

class DoctorProfile(models.Model):
    # Liên kết với User từ user_service
    user_id = models.IntegerField(unique=True)
    # Chuyên môn của bác sĩ (ví dụ: Nội khoa, Ngoại khoa)
    specialty = models.CharField(max_length=100)
    # Phòng khám hoặc bệnh viện bác sĩ làm việc
    clinic = models.CharField(max_length=200)
    # Lịch làm việc (lưu dạng text, ví dụ: "Mon-Fri, 9AM-5PM")
    schedule = models.TextField(blank=True)
    # Thời gian tạo và cập nhật
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Doctor {self.user_id} - {self.specialty}"

class Diagnosis(models.Model):
    # ID bệnh nhân từ patient_service
    patient_id = models.IntegerField()
    # Bác sĩ thực hiện chẩn đoán
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='diagnoses')
    # Ngày chẩn đoán
    diagnosis_date = models.DateTimeField()
    # Nội dung chẩn đoán
    description = models.TextField()
    # Thời gian tạo và cập nhật
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Diagnosis for Patient {self.patient_id} by Doctor {self.doctor.user_id}"