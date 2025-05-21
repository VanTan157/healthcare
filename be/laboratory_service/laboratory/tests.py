# Tệp kiểm thử cho ứng dụng laboratory
from django.test import TestCase
from rest_framework.test import APIClient

class LabRequestTests(TestCase):
    def setUp(self):
        # Khởi tạo client để gửi yêu cầu API
        self.client = APIClient()

    def test_create_lab_request(self):
        # Viết test cases sau
        pass

class LabResultTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_lab_result(self):
        # Viết test cases sau
        pass