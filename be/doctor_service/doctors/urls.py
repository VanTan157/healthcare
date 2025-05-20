from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorProfileViewSet, DiagnosisViewSet, AppointmentViewSet
from rest_framework.response import Response

# Tạo router cho DoctorProfile và Diagnosis
router = DefaultRouter()
router.register(r'doctors', DoctorProfileViewSet)
router.register(r'diagnoses', DiagnosisViewSet)

# Định nghĩa URL thủ công cho AppointmentViewSet
appointment_viewset = AppointmentViewSet.as_view({
    'get': 'list',
    'put': 'update_status',
})

urlpatterns = [
    path('', include(router.urls)),
    path('appointments/', appointment_viewset, name='appointment-list'),
    path('appointments/<int:pk>/update-status/', appointment_viewset, name='appointment-update-status'),
    path('prescriptions/', lambda request: Response({"detail": "Not implemented yet"}, status=501), name='prescriptions'),
    path('lab_requests/', lambda request: Response({"detail": "Not implemented yet"}, status=501), name='lab_requests'),
]