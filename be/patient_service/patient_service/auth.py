import logging
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import AnonymousUser

logger = logging.getLogger(__name__)

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        logger.debug(f"Validating token: {validated_token}")
        user_id = validated_token.get('id')  # Lấy id từ token
        username = validated_token.get('username')
        email = validated_token.get('email')
        role = validated_token.get('role')
        is_active = validated_token.get('is_active')

        if not user_id:
            logger.error("No user_id found in token payload")
            raise AuthenticationFailed('No user_id in token')
        if not role:
            logger.error("No role found in token payload")
            raise AuthenticationFailed('No role in token')
        if not is_active:
            logger.error("User is not active")
            raise AuthenticationFailed('User is not active')
        if role not in ['patient', 'admin', 'doctor', 'nurse', 'pharmacist', 'lab_technician', 'insurance_provider']:
            raise AuthenticationFailed('Invalid user role')

        class TempUser(AnonymousUser):
            def __init__(self, user_id, username, email, role, is_active):
                self.id = user_id
                self.username = username
                self.email = email
                self.role = role
                self.is_active = is_active
            @property
            def is_authenticated(self):
                return True

        return TempUser(user_id=user_id, username=username, email=email, role=role, is_active=is_active)