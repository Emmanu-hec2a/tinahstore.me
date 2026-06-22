import json
from rest_framework import generics, filters, status
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.shortcuts import get_object_or_404
from .models import Category, Product
from .serializers import CategorySerializer, ProductListSerializer, ProductDetailSerializer

class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

class ProductListView(generics.ListCreateAPIView):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductListSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'slug', 'description']
    ordering_fields = ['price', 'created_at']

    def create(self, request, *args, **kwargs):
        # We need to handle category_id and nested data (variants/images)
        data = request.data.copy()
        
        # 1. Handle Variants
        variants_json = data.get('variants_json')
        variants_data = []
        if variants_json:
            variants_data = json.loads(variants_json)
        
        # 2. Extract Images
        images_data = request.FILES.getlist('images')

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        # 3. Save Variants
        from .models import ProductVariant, ProductImage
        for v in variants_data:
            ProductVariant.objects.create(
                product=product,
                color_name=v.get('color_name', ''),
                color_hex=v.get('color_hex', '#000000'),
                size=v.get('size', 'Regular'),
                stock=v.get('stock', 0)
            )
            
        # 4. Save Images
        for img in images_data:
            ProductImage.objects.create(product=product, image=img)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_queryset(self):
        queryset = super().get_queryset()
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        return queryset

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()

        # 1. Handle Variants
        variants_json = data.get('variants_json')
        if variants_json:
            variants_data = json.loads(variants_json)
            # Simplification: Replace all variants with the new set
            from .models import ProductVariant
            instance.variants.all().delete()
            for v in variants_data:
                ProductVariant.objects.create(
                    product=instance,
                    color_name=v.get('color_name', ''),
                    color_hex=v.get('color_hex', '#000000'),
                    size=v.get('size', 'Regular'),
                    stock=v.get('stock', 0)
                )

        # 2. Extract and Add new Images
        images_data = request.FILES.getlist('images')
        from .models import ProductImage
        for img in images_data:
            ProductImage.objects.create(product=instance, image=img)

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

class RelatedProductView(generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        slug = self.kwargs.get('slug')
        product = generics.get_object_or_404(Product, slug=slug)
        return Product.objects.filter(
            category=product.category,
            is_active=True
        ).exclude(id=product.id)[:4]
