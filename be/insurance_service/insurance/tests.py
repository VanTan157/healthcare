# Tệp kiểm thử cho ứng dụng insurance
from django.test import TestCase
from rest_framework.test import APIClient

class InsuranceContractTests(TestCase):
    def setUp(self):
        # Khởi tạo client để gửi yêu cầu API
        self.client = APIClient()

    def test_create_insurance_contract(self):
        # Viết test cases sau
        pass

class InsuranceClaimTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_insurance_claim(self):
        # Viết test cases sau
        pass