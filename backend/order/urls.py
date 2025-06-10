from django.urls import path

from .views import OrderCreateView, OrderListView, OrderDeleteView, CreateBatchOrder, CreateCartItem, UpdateCartItem, DeleteCartItem,ListCartItem

urlpatterns = [
    path("create/", OrderCreateView.as_view(), name="order-create"),
    path("list/", OrderListView.as_view(), name="order-list"),
    path("delete/<int:id>/", OrderDeleteView.as_view(), name="order-delete"),
    path("create/batchorder/", CreateBatchOrder.as_view(), name="batch-order"),
    path("create/cartitem/", CreateCartItem.as_view(), name="create-cart-item"),
    path("list/cartitem/", ListCartItem.as_view(), name="list-cart-item"),
    path("update/cartitem/<int:id>/", UpdateCartItem.as_view(), name="update-cart-item"),
    path("delete/cartitem/<int:id>/", DeleteCartItem.as_view(), name="update-cart-item"),
]