from rest_framework import serializers
from .models import Prescription


class PrescriptionSerializer(serializers.ModelSerializer):
    analyzed_medicines = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Prescription
        fields = ['id', 'image_url', 'ocr_text', 'analyzed_medicines', 'check_id', 'created_at']
        read_only_fields = fields

    def get_analyzed_medicines(self, obj):
        return obj.analyzed_medicines

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else None
