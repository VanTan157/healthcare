from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import LabRequest, LabResult
from .serializers import LabRequestSerializer, LabResultSerializer

class LabRequestViewSet(viewsets.ModelViewSet):
    queryset = LabRequest.objects.all()
    serializer_class = LabRequestSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        status = request.data.get('status')
        if status not in ['pending', 'completed', 'cancelled']:
            return Response({"detail": "Invalid status"}, status=400)
        instance.status = status
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # Thêm endpoint tùy chỉnh để lọc theo doctor_id và patient_id
    @action(detail=False, methods=['get'], url_path='filter')
    def filter_by_doctor_and_patient(self, request):
        doctor_id = request.query_params.get('doctor_id')
        patient_id = request.query_params.get('patient_id')

        # Xây dựng queryset động
        queryset = self.get_queryset()
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)

        # Nếu không có tham số nào được cung cấp, trả về lỗi
        if not doctor_id and not patient_id:
            return Response({"detail": "At least one of doctor_id or patient_id is required"}, status=400)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class LabResultViewSet(viewsets.ModelViewSet):
    queryset = LabResult.objects.all()
    serializer_class = LabResultSerializer