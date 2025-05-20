# Tệp kiểm thử cho ứng dụng pharmacy
from django.test import TestCase
from rest_framework.test import APIClient

class PrescriptionTests(TestCase):
    def setUp(self):
        # Khởi tạo client để gửi yêu cầu API
        self.client = APIClient()

    def test_create_prescription(self):
        # Viết test cases sau
        pass

class MedicineTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_medicine(self):
        # Viết test cases sau
        pass