# Định tuyến URL chính của dự án
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),  # Giao diện admin
    path('api/', include('laboratory.urls')),  # Chuyển tiếp các yêu cầu API đến ứng dụng laboratory
]