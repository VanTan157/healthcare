from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, register_view, CurrentUserView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('users/register/', register_view, name='user-register'),
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
    path('', include(router.urls)),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]