from django.contrib import admin
from .models import PatientProfile, Appointment

@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ['user_id', 'date_of_birth', 'address']
    search_fields = ['user_id']

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor_id', 'appointment_date', 'status']
    list_filter = ['status']
    search_fields = ['patient__user_id']