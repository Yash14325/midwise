from django.db import models
from django.contrib.auth.models import User
import json


class Prescription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prescriptions')
    image = models.ImageField(upload_to='prescriptions/', blank=True, null=True)
    ocr_text = models.TextField(blank=True, default='')
    _analyzed_medicines = models.TextField(db_column='analyzed_medicines', default='[]')
    check_id = models.IntegerField(blank=True, null=True)  # FK to SymptomCheck (optional)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def analyzed_medicines(self):
        return json.loads(self._analyzed_medicines)

    @analyzed_medicines.setter
    def analyzed_medicines(self, value):
        self._analyzed_medicines = json.dumps(value)

    def __str__(self):
        return f"Prescription #{self.id} — {self.user.email}"

    class Meta:
        ordering = ['-created_at']
