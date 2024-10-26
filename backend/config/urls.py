from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from contacts.views import ContactViewSet

router = DefaultRouter()
router.register(r'contacts', ContactViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
