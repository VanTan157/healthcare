from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorProfileViewSet, DiagnosisViewSet, AppointmentViewSet
from rest_framework.response import Response

# Tạo router để tự động tạo URL cho DoctorProfileViewSet và DiagnosisViewSet
router = DefaultRouter()
# Đăng ký endpoint /api/doctors/ cho DoctorProfileViewSet
router.register(r'doctors', DoctorProfileViewSet)
# Đăng ký endpoint /api/diagnoses/ cho DiagnosisViewSet (bao gồm cả /by_patientId/)
router.register(r'diagnoses', DiagnosisViewSet)

# Tạo viewset thủ công cho AppointmentViewSet vì nó kế thừa ViewSet thay vì ModelViewSet
appointment_viewset = AppointmentViewSet.as_view({
    'get': 'list',  # Map GET /api/appointments/ tới hàm list
    'put': 'update_status',  # Map PUT /api/appointments/{pk}/update-status/ tới hàm update_status
})

# Định nghĩa các URL patterns
urlpatterns = [
    # Bao gồm tất cả URL từ router (cho doctors và diagnoses)
    path('', include(router.urls)),
    # Endpoint để lấy danh sách lịch hẹn
    path('appointments/', appointment_viewset, name='appointment-list'),
    # Endpoint để cập nhật trạng thái lịch hẹn
    path('appointments/<int:pk>/update-status/', appointment_viewset, name='appointment-update-status'),
    # Placeholder cho endpoint prescriptions (chưa triển khai)
    path('prescriptions/', lambda request: Response({"detail": "Not implemented yet"}, status=501), name='prescriptions'),
    # Placeholder cho endpoint lab_requests (chưa triển khai)
    path('lab_requests/', lambda request: Response({"detail": "Not implemented yet"}, status=501), name='lab_requests'),
]