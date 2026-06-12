import os
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from .models import Prescription
from .serializers import PrescriptionSerializer
from .ocr_utils import extract_text_from_image, analyze_medicines


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def scan_prescription(request):
    image = request.FILES.get('image')
    check_id = request.data.get('check_id')

    if not image:
        return Response({'error': 'No image uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

    # Save the prescription record
    prescription = Prescription(user=request.user)
    if check_id:
        prescription.check_id = int(check_id)

    prescription.image = image
    prescription.save()

    # Run OCR
    image_path = prescription.image.path
    ocr_text = extract_text_from_image(image_path)
    prescription.ocr_text = ocr_text

    # Analyze medicines
    medicines = analyze_medicines(ocr_text)
    prescription.analyzed_medicines = medicines
    prescription.save()

    return Response(PrescriptionSerializer(prescription).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_prescriptions(request):
    prescriptions = Prescription.objects.filter(user=request.user).order_by('-created_at')
    return Response(PrescriptionSerializer(prescriptions, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def prescription_detail(request, pk):
    try:
        p = Prescription.objects.get(pk=pk, user=request.user)
    except Prescription.DoesNotExist:
        return Response({'error': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    return Response(PrescriptionSerializer(p).data)
