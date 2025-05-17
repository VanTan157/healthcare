from rest_framework.views import APIView
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, RegisterSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        elif self.action == 'list':  # Kiểm tra cho action list
            return [permissions.IsAuthenticated(), RolePermission()]  # Sử dụng custom permission
        return [permissions.IsAuthenticated()]  # Các action khác yêu cầu xác thực

# Custom permission để kiểm tra role
class RolePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Lấy user hiện tại
        user = request.user
        if not user.is_authenticated:
            return False
        # Chỉ cho phép admin và doctor
        allowed_roles = ['admin', 'doctor']
        return user.role in allowed_roles

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@csrf_exempt
def register_view(request):
    print("Register view called")
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)