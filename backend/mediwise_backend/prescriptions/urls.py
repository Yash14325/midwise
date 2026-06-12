from django.urls import path
from .views import scan_prescription, list_prescriptions, prescription_detail

urlpatterns = [
    path('scan/', scan_prescription, name='scan-prescription'),
    path('', list_prescriptions, name='prescription-list'),
    path('<int:pk>/', prescription_detail, name='prescription-detail'),
]
