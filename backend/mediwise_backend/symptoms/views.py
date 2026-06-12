import json
import os
import urllib.request
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import SymptomCheck
from .serializers import SymptomCheckInputSerializer, SymptomCheckSerializer
from .ml.predict import predict, AVAILABLE_SYMPTOMS


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict_view(request):
    serializer = SymptomCheckInputSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    symptoms = data['symptoms']
    severity = data['severity']
    duration_days = data['duration_days']
    age = data['age']
    notes = data.get('notes', '')

    # Run prediction
    result = predict(symptoms, severity, age, duration_days)

    # Save to DB
    check = SymptomCheck(
        user=request.user,
        severity=severity,
        duration_days=duration_days,
        age_at_check=age,
        notes=notes,
        predicted_disease=result['primary_prediction'],
        confidence_score=result['confidence'],
        doctor_recommendation=result['doctor_recommendation'],
        severity_label=result['severity_label'],
        emergency_flag=result['emergency_flag'],
    )
    check.symptoms = symptoms
    check.all_predictions = result['all_predictions']
    check.recommended_tablets = result['recommended_tablets']
    check.home_remedies = result['home_remedies']
    check.save()

    return Response({
        'check_id': check.id,
        **result,
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def symptoms_list_view(request):
    return Response({'symptoms': AVAILABLE_SYMPTOMS})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assistant_view(request):
    message = request.data.get('message', '').strip()
    if not message:
        return Response({'error': 'A message is required.'}, status=status.HTTP_400_BAD_REQUEST)

    system_prompt = request.data.get('system_prompt', '')
    history = request.data.get('history', [])

    api_key = os.getenv('ANTHROPIC_API_KEY')
    if api_key:
        try:
            payload = {
                'model': os.getenv('ANTHROPIC_MODEL', 'claude-sonnet-4-20250514'),
                'max_tokens': 800,
                'system': system_prompt or 'You are MediWise AI.',
                'messages': history + [{'role': 'user', 'content': message}],
            }
            body = json.dumps(payload).encode('utf-8')
            req = urllib.request.Request(
                'https://api.anthropic.com/v1/messages',
                data=body,
                headers={
                    'Content-Type': 'application/json',
                    'x-api-key': api_key,
                    'anthropic-version': '2023-06-01',
                },
                method='POST',
            )
            with urllib.request.urlopen(req, timeout=20) as response:
                data = json.loads(response.read().decode('utf-8'))
                reply = data.get('content', [{}])[0].get('text') or 'I could not generate a response right now.'
                return Response({'reply': reply})
        except Exception:
            pass

    reply = (
        f"Thanks for asking about '{message}'. "
        "For a local demo, I can offer general guidance: rest well, stay hydrated, monitor symptoms, and seek medical care if they worsen or if you have concerning warning signs such as chest pain, severe shortness of breath, confusion, or high fever."
    )
    return Response({'reply': reply})
