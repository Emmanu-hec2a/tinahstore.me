from rest_framework import generics, permissions
from .models import ProductReview
from .serializers_reviews import ProductReviewSerializer

class ProductReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        product_slug = self.request.query_params.get('product_slug')
        if product_slug:
            return ProductReview.objects.filter(product__slug=product_slug)
        return ProductReview.objects.all()
