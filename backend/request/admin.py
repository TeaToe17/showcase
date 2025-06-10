from django.contrib import admin

from .models import Request

@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    ordering = ["-date_created"]
    list_display = ["name", "date_created"]
    search_fields = ['name']
    list_filter = ['date_created']