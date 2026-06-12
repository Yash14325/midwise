from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from symptoms.models import SymptomCheck
from symptoms.serializers import SymptomCheckSerializer


class HistoryPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def history_list(request):
    queryset = SymptomCheck.objects.filter(user=request.user).order_by('-created_at')

    # Optional filter by disease
    disease = request.query_params.get('disease')
    if disease:
        queryset = queryset.filter(predicted_disease__icontains=disease)

    paginator = HistoryPagination()
    page = paginator.paginate_queryset(queryset, request)
    serializer = SymptomCheckSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def history_detail(request, pk):
    try:
        check = SymptomCheck.objects.get(pk=pk, user=request.user)
    except SymptomCheck.DoesNotExist:
        return Response({'error': 'Record not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        check.delete()
        return Response({'message': 'Record deleted.'}, status=status.HTTP_204_NO_CONTENT)

    return Response(SymptomCheckSerializer(check).data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def history_delete(request, pk):
    return history_detail(request, pk)
