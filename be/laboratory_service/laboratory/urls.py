# Định tuyến URL cho ứng dụng laboratory
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LabRequestViewSet, LabResultViewSet

# Tạo router để tự động sinh URL
router = DefaultRouter()
router.register(r'lab_requests', LabRequestViewSet)
router.register(r'lab_results', LabResultViewSet)

urlpatterns = [
    path('', include(router.urls)),
]