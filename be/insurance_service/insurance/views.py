from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import InsuranceContract, InsuranceClaim
from .serializers import InsuranceContractSerializer, InsuranceClaimSerializer

class InsuranceContractViewSet(viewsets.ModelViewSet):
    # Truy vấn tất cả hợp đồng bảo hiểm
    queryset = InsuranceContract.objects.all()
    serializer_class = InsuranceContractSerializer

    # Thêm endpoint tùy chỉnh để lọc theo patient_id
    @action(detail=False, methods=['get'], url_path='filter')
    def filter_by_patient(self, request):
        patient_id = request.query_params.get('patient_id')

        # Nếu không có patient_id, trả về lỗi
        if not patient_id:
            return Response({"detail": "patient_id is required"}, status=400)

        # Lọc hợp đồng bảo hiểm theo patient_id
        queryset = self.get_queryset().filter(patient_id=patient_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class InsuranceClaimViewSet(viewsets.ModelViewSet):
    # Truy vấn tất cả yêu cầu bồi thường
    queryset = InsuranceClaim.objects.all()
    serializer_class = InsuranceClaimSerializer

    def update(self, request, *args, **kwargs):
        # Chỉ cho phép cập nhật trạng thái yêu cầu bồi thường
        instance = self.get_object()
        status = request.data.get('status')
        if status not in ['pending', 'approved', 'rejected']:
            return Response({"detail": "Invalid status"}, status=400)
        instance.status = status
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)