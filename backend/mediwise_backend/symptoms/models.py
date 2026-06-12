from django.db import models
from django.contrib.auth.models import User
import json


class SymptomCheck(models.Model):
    SEVERITY_LABELS = [
        ('Mild', 'Mild'),
        ('Moderate', 'Moderate'),
        ('Severe', 'Severe'),
        ('Critical', 'Critical'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='symptom_checks')

    # Store symptoms as JSON string for SQLite
    _symptoms = models.TextField(db_column='symptoms', default='[]')
    severity = models.IntegerField()              # 1-10
    duration_days = models.IntegerField()
    age_at_check = models.IntegerField()
    notes = models.TextField(blank=True, default='')

    # Prediction results
    predicted_disease = models.CharField(max_length=200, blank=True)
    confidence_score = models.FloatField(default=0.0)
    _all_predictions = models.TextField(db_column='all_predictions', default='[]')
    _recommended_tablets = models.TextField(db_column='recommended_tablets', default='[]')
    _home_remedies = models.TextField(db_column='home_remedies', default='[]')
    doctor_recommendation = models.TextField(blank=True)
    severity_label = models.CharField(max_length=20, choices=SEVERITY_LABELS, blank=True)
    emergency_flag = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def symptoms(self):
        return json.loads(self._symptoms)

    @symptoms.setter
    def symptoms(self, value):
        self._symptoms = json.dumps(value)

    @property
    def all_predictions(self):
        return json.loads(self._all_predictions)

    @all_predictions.setter
    def all_predictions(self, value):
        self._all_predictions = json.dumps(value)

    @property
    def recommended_tablets(self):
        return json.loads(self._recommended_tablets)

    @recommended_tablets.setter
    def recommended_tablets(self, value):
        self._recommended_tablets = json.dumps(value)

    @property
    def home_remedies(self):
        return json.loads(self._home_remedies)

    @home_remedies.setter
    def home_remedies(self, value):
        self._home_remedies = json.dumps(value)

    def __str__(self):
        return f"{self.user.email} — {self.predicted_disease} ({self.created_at.date()})"

    class Meta:
        ordering = ['-created_at']
