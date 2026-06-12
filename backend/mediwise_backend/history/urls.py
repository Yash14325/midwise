from django.urls import path
from .views import history_list, history_detail, history_delete

urlpatterns = [
    path('', history_list, name='history-list'),
    path('<int:pk>/', history_detail, name='history-detail'),
    path('<int:pk>/delete/', history_delete, name='history-delete'),
]
