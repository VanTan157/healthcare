from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Prescription, Medicine
from .serializers import PrescriptionSerializer, MedicineSerializer
import logging

# Khởi tạo logger để ghi log cho ứng dụng
logger = logging.getLogger(__name__)

class PrescriptionViewSet(viewsets.ModelViewSet):
    # Định nghĩa queryset mặc định để lấy tất cả đơn thuốc
    queryset = Prescription.objects.all()
    # Chỉ định serializer để xử lý dữ liệu Prescription
    serializer_class = PrescriptionSerializer

    def update(self, request, *args, **kwargs):
        """
        Cập nhật trạng thái đơn thuốc (pending, dispensed, cancelled).
        Chỉ cho phép cập nhật trường status.
        """
        # Lấy instance của đơn thuốc từ database
        instance = self.get_object()
        # Lấy status từ request data
        status = request.data.get('status')
        # Kiểm tra xem status có hợp lệ không
        if status not in ['pending', 'dispensed', 'cancelled']:
            logger.error(f"Invalid status {status} for prescription {instance.id}")
            return Response({"detail": "Invalid status"}, status=400)
        # Cập nhật status và lưu vào database
        instance.status = status
        instance.save()
        # Serialize và trả về dữ liệu đã cập nhật
        serializer = self.get_serializer(instance)
        logger.debug(f"Updated status of prescription {instance.id} to {status}")
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='by_diagnosisId/(?P<diagnosis_id>\d+)')
    def get_by_diagnosis_id(self, request, diagnosis_id=None):
        """
        Endpoint để lấy danh sách đơn thuốc theo diagnosis_id.
        URL: GET /api/prescriptions/by_diagnosisId/{diagnosis_id}/
        """
        logger.debug(f"Fetching prescriptions for diagnosis_id: {diagnosis_id}")
        # Lọc các đơn thuốc theo diagnosis_id
        prescriptions = Prescription.objects.filter(diagnosis_id=diagnosis_id)
        if not prescriptions.exists():
            # Nếu không tìm thấy đơn thuốc, trả về lỗi 404
            logger.debug(f"No prescriptions found for diagnosis_id: {diagnosis_id}")
            return Response({"detail": f"No prescriptions found for diagnosis_id {diagnosis_id}"}, status=404)
        # Serialize danh sách đơn thuốc và trả về
        serializer = self.get_serializer(prescriptions, many=True)
        logger.debug(f"Successfully fetched {prescriptions.count()} prescriptions for diagnosis_id: {diagnosis_id}")
        return Response(serializer.data)

class MedicineViewSet(viewsets.ModelViewSet):
    # Định nghĩa queryset mặc định để lấy tất cả thuốc trong kho
    queryset = Medicine.objects.all()
    # Chỉ định serializer để xử lý dữ liệu Medicine
    serializer_class = MedicineSerializer