from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PrescriptionViewSet, MedicineViewSet

# Tạo router để tự động sinh URL cho PrescriptionViewSet và MedicineViewSet
router = DefaultRouter()
# Đăng ký endpoint /api/prescriptions/ cho PrescriptionViewSet
router.register(r'prescriptions', PrescriptionViewSet)
# Đăng ký endpoint /api/medicines/ cho MedicineViewSet
router.register(r'medicines', MedicineViewSet)

# Định nghĩa các URL patterns
urlpatterns = [
    # Bao gồm tất cả URL từ router (cho prescriptions và medicines)
    path('', include(router.urls)),
]