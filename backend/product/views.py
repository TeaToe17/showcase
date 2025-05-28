from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import get_object_or_404

from .serializers import ProductSerializer, CategorySerialzer
from .models import Product, Category

class ProductCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

    def create(self, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=self.request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(owner=self.request.user)

            return Response(serializer.data, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
        
class ProductListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all().order_by(
            "-is_sticky", "-sticky_timestamp", "-created"
        )
        url_id = self.kwargs.get("id")
        user = self.request.user

        try:
            updated_count = Product.objects.filter(
                is_sticky=True,
                sticky_timestamp__lt=timezone.now() - timedelta(hours=2)
            ).update(is_sticky=False, sticky_timestamp=None)

            if updated_count:
                print(f"{updated_count} sticky products unstuck.")
        except Exception as e:
            print("Error unsticking expired products:", e)

        if url_id and user.is_authenticated and int(url_id) == int(user.id):
            return queryset.filter(owner__id=url_id)
        return queryset
            


class ProductUpdateView(generics.UpdateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(owner=user)
    
class ProductDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(owner=user)

class MakeProductStickyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, product_id):
        user = request.user
        product = get_object_or_404(Product, id=product_id, owner=user)

        if user.referral_points < 1:
            return Response({"message": "Not enough referral points."}, status=400)

        if product.is_sticky:
            return Response({"message": "Product is already sticky."}, status=400)

        product.is_sticky = True
        product.sticky_timestamp = timezone.now()
        user.referral_points -= 1

        user.save()
        product.save()

        return Response({"message": "Product saved as sticky."}, status=200)
    
class CategoryListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CategorySerialzer
    queryset = Category.objects.all()