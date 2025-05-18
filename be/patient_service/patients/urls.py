from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.response import Response
from .views import PatientProfileViewSet, AppointmentViewSet

router = DefaultRouter()
router.register(r'patients', PatientProfileViewSet)
router.register(r'appointments', AppointmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Placeholder cho các endpoint tương lai
    path('prescriptions/', lambda request: Response({"detail": "Not implemented yet"}, status=501), name='prescriptions'),
    path('bills/', lambda request: Response({"detail": "Not implemented yet"}, status=501), name='bills'),
]