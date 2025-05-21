# Định tuyến URL cho ứng dụng insurance
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InsuranceContractViewSet, InsuranceClaimViewSet

# Tạo router để tự động sinh URL
router = DefaultRouter()
router.register(r'insurance_contracts', InsuranceContractViewSet)
router.register(r'claims', InsuranceClaimViewSet)

urlpatterns = [
    path('', include(router.urls)),
]