from django.urls import path
from .views import ProductListView, ProductDetailView, RelatedProductView
from .views_reviews import ProductReviewListCreateView
from .views import test_upload
urlpatterns = [
    path('', ProductListView.as_view(), name='product-list'),
    path('reviews/', ProductReviewListCreateView.as_view(), name='product-reviews'),
    path('<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('<slug:slug>/related/', RelatedProductView.as_view(), name='product-related'),
    path('test-upload/', test_upload),
]
