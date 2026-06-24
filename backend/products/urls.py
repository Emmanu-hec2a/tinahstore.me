from django.urls import path
from .views import ProductListView, ProductDetailView, RelatedProductView, test_upload
from .views_reviews import ProductReviewListCreateView

urlpatterns = [
    path('', ProductListView.as_view(), name='product-list'),
    path('test-upload/', test_upload),  # ← must be before <slug:slug>/
    path('reviews/', ProductReviewListCreateView.as_view(), name='product-reviews'),
    path('<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('<slug:slug>/related/', RelatedProductView.as_view(), name='product-related'),
]