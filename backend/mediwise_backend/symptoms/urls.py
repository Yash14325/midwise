from django.urls import path
from .views import predict_view, symptoms_list_view, assistant_view

urlpatterns = [
    path('predict/', predict_view, name='predict'),
    path('list/', symptoms_list_view, name='symptoms-list'),
    path('assistant/', assistant_view, name='assistant'),
]
