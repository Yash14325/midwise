from rest_framework import serializers
from .models import SymptomCheck


class SymptomCheckInputSerializer(serializers.Serializer):
    symptoms = serializers.ListField(child=serializers.CharField(), min_length=1)
    severity = serializers.IntegerField(min_value=1, max_value=10)
    duration_days = serializers.IntegerField(min_value=1, max_value=365)
    age = serializers.IntegerField(min_value=1, max_value=120)
    notes = serializers.CharField(required=False, allow_blank=True, default='')


class SymptomCheckSerializer(serializers.ModelSerializer):
    symptoms = serializers.SerializerMethodField()
    all_predictions = serializers.SerializerMethodField()
    recommended_tablets = serializers.SerializerMethodField()
    home_remedies = serializers.SerializerMethodField()

    class Meta:
        model = SymptomCheck
        fields = [
            'id', 'symptoms', 'severity', 'duration_days', 'age_at_check',
            'notes', 'predicted_disease', 'confidence_score', 'all_predictions',
            'recommended_tablets', 'home_remedies', 'doctor_recommendation',
            'severity_label', 'emergency_flag', 'created_at',
        ]
        read_only_fields = fields

    def get_symptoms(self, obj):
        return obj.symptoms

    def get_all_predictions(self, obj):
        return obj.all_predictions

    def get_recommended_tablets(self, obj):
        return obj.recommended_tablets

    def get_home_remedies(self, obj):
        return obj.home_remedies
