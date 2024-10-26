from django.contrib import admin
from .models import Contact

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'phone', 'address')
    search_fields = ('first_name', 'last_name', 'email', 'phone', 'address')
    list_filter = ('created_at', 'updated_at')
