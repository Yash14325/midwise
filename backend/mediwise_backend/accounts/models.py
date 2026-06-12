from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
        ('prefer_not_to_say', 'Prefer not to say'),
    ]

    BLOOD_GROUP_CHOICES = [
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
        ('O+', 'O+'), ('O-', 'O-'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=200)
    phone_number = models.CharField(max_length=20, blank=True)
    emergency_contact_name = models.CharField(max_length=200, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    age = models.IntegerField()
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True)
    blood_group = models.CharField(max_length=5, choices=BLOOD_GROUP_CHOICES, blank=True)

    # Stored as comma-separated strings for SQLite simplicity
    previous_diseases = models.TextField(blank=True, default='')   # "Diabetes,Hypertension"
    allergies = models.TextField(blank=True, default='')           # "Penicillin,Dust"
    current_medications = models.TextField(blank=True, default='') # "Metformin,Aspirin"

    profile_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_previous_diseases(self):
        return [d.strip() for d in self.previous_diseases.split(',') if d.strip()]

    def set_previous_diseases(self, diseases_list):
        self.previous_diseases = ','.join(diseases_list)

    def get_allergies(self):
        return [a.strip() for a in self.allergies.split(',') if a.strip()]

    def set_allergies(self, allergies_list):
        self.allergies = ','.join(allergies_list)

    def get_current_medications(self):
        return [m.strip() for m in self.current_medications.split(',') if m.strip()]

    def set_current_medications(self, meds_list):
        self.current_medications = ','.join(meds_list)

    def __str__(self):
        return f"{self.full_name} ({self.user.email})"
