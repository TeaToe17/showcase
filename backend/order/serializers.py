from rest_framework import serializers

from .models import Order, CartItem
from product.models import Product
from user.models import CustomUser

class OrderSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    product_name = serializers.SerializerMethodField()
    product_image = serializers.SerializerMethodField()
    product_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ["id", "product", "buyer_name", "buyer_whatsapp_contact", "buyer_call_contact", "agreed_price", "completed", "product_name", "product_image", "product_price", "date_created"]

    def get_product_name(self, obj):
        if isinstance(obj, dict):
            return None
        return getattr(obj.product, 'name', None)
    
    def get_product_image(self, obj):
        if isinstance(obj, dict):
            return None
        return getattr(obj.product, 'image', None)

    def get_product_price(self, obj):
        if isinstance(obj, dict):
            return None
        return getattr(obj.product, 'price', None)

class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset = Product.objects.all())
    owner = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), required=False)
    product_image = serializers.SerializerMethodField() 
    product_stock = serializers.SerializerMethodField()
    product_price = serializers.SerializerMethodField() 
    product_name = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ["id", "owner", "product", "product_image", "quantity", "product_stock", "product_price", "product_name"]
        extra_kwargs = {"owner":{"read_only":True}}

    def get_product_image(self, obj):
        if isinstance(obj, dict):
            return None
        return getattr(obj.product, 'image', None)

    def get_product_stock(self, obj):
        if isinstance(obj, dict):
            return None
        return getattr(obj.product, 'stock', None)

    def get_product_price(self, obj):
        if isinstance(obj, dict):
            return None
        return getattr(obj.product, 'price', None)

    def get_product_name(self, obj):
        if isinstance(obj, dict):
            return None
        return getattr(obj.product, 'name', None)
