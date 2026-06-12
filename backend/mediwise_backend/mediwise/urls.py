from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/profile/', include('accounts.profile_urls')),
    path('api/symptoms/', include('symptoms.urls')),
    path('api/history/', include('history.urls')),
    path('api/prescriptions/', include('prescriptions.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
