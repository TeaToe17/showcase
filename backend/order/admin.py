from django.contrib import admin

from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    # list_display = ("completed",)
    list_display = ("product","completed","date_created")
    list_editable = ("completed",)
    ordering = ["date_created"]