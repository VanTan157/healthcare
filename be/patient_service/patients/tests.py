from django.test import TestCase
from .models import PatientProfile, Appointment
from rest_framework.test import APIClient
from rest_framework import status

class PatientProfileTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_patient_profile(self):
        # Thêm test cases sau khi tích hợp xác thực
        pass

class sokatTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_appointment(self):
        # Thêm test cases sau khi tích hợp xác thực
        pass