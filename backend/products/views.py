import json
from rest_framework import generics, filters, status
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view
from django.views.decorators.cache import cache_page
from django.shortcuts import get_object_or_404
from .models import Category, Product
from .serializers import CategorySerializer, ProductListSerializer, ProductDetailSerializer


from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.utils.text import slugify
from PIL import Image
from io import BytesIO
import os

@api_view(['GET'])
def debug_storage(request):
    from django.conf import settings
    from django.core.files.storage import default_storage
    from django.core.files.base import ContentFile

    # Test upload from live server
    test_path = default_storage.save('test/live-server-test.txt', ContentFile(b'hello from live server'))
    test_url = default_storage.url(test_path)

    return Response({
        'storage': settings.DEFAULT_FILE_STORAGE,
        'bucket': getattr(settings, 'AWS_STORAGE_BUCKET_NAME', 'NOT SET'),
        'test_upload_path': test_path,
        'test_upload_url': test_url,
    })

def process_and_upload_image(image_file, product_id):
    """Process image and upload directly to R2."""
    img = Image.open(image_file)

    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    img.thumbnail((1200, 1200), Image.Resampling.LANCZOS)

    output = BytesIO()
    img.save(output, format='JPEG', quality=85, optimize=True)
    output.seek(0)

    original_name = os.path.basename(image_file.name)
    clean_name = f"products/{product_id}_{slugify(os.path.splitext(original_name)[0])}.jpg"
    print(f"DEBUG: About to upload {clean_name}, size={output.getbuffer().nbytes} bytes")

    saved_path = default_storage.save(clean_name, ContentFile(output.read()))
    print(f"DEBUG: Saved to {saved_path}, URL={url}")
    return saved_path
class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer

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
            try:
                path = process_and_upload_image(img, product.id)
                ProductImage.objects.create(product=product, image=path)
                print(f"DEBUG: ProductImage created with path {path}")
            except Exception as e:
                print(f"DEBUG ERROR: {e}")

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
            try:
                path = process_and_upload_image(img, instance.id)  # ← instance
                ProductImage.objects.create(product=instance, image=path)  # ← instance
                print(f"DEBUG: ProductImage created with path {path}")
            except Exception as e:
                print(f"DEBUG ERROR: {e}")

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

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


from rest_framework.response import Response
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

@api_view(['POST'])
def test_upload(request):
    if 'image' not in request.FILES:
        return Response({'error': 'No image provided'}, status=400)

    image = request.FILES['image']
    try:
        path = default_storage.save(f'test/{image.name}', ContentFile(image.read()))
        url = default_storage.url(path)
        return Response({'success': True, 'path': path, 'url': url})
    except Exception as e:
        return Response({'error': str(e)}, status=500)