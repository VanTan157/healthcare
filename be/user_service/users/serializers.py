from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'is_active']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role']
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Thêm thông tin user vào payload của token
        token['id'] = user.id
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role
        token['is_active'] = user.is_active
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Thêm thông tin user vào phản hồi JSON
        user_serializer = UserSerializer(self.user)
        data.update(user_serializer.data)
        return data