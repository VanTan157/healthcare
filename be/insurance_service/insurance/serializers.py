# Định nghĩa serializers để xử lý dữ liệu API
from rest_framework import serializers
from .models import InsuranceContract, InsuranceClaim

class InsuranceContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceContract
        fields = ['id', 'patient_id', 'policy_number', 'provider', 'start_date', 'end_date', 'details', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class InsuranceClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceClaim
        fields = ['id', 'contract', 'amount', 'claim_date', 'description', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']