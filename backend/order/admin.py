from django.contrib import admin

from .models import Order, CartItem

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    # list_display = ("completed",)
    list_display = ("product","completed","date_created")
    list_editable = ("completed",)
    ordering = ["-date_created"]

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ["owner", "product", "quantity", "timestamp"]
    ordering =  ["-timestamp"]