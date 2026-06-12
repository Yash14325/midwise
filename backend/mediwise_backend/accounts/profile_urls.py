from django.urls import path
from .profile_views import get_profile, create_profile, update_profile

urlpatterns = [
    path('', get_profile, name='get-profile'),
    path('create/', create_profile, name='create-profile'),
    path('update/', update_profile, name='update-profile'),
]
