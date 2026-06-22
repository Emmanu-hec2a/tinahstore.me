from rest_framework import generics, filters, permissions
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer

class OrderListCreateView(generics.ListCreateAPIView):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['order_number', 'customer_name', 'customer_phone']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # If user is authenticated, they should only see their own orders
        # UNLESS they are an admin (who uses the same endpoint for the admin panel)
        if self.request.user.is_authenticated and not self.request.user.is_staff:
            return queryset.filter(user=self.request.user)
            
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        return queryset

    def perform_create(self, serializer):
        # Link order to user if logged in
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()

class OrderDetailView(generics.RetrieveUpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    lookup_field = 'order_number'

    def get_permissions(self):
        if self.request.method in ['PATCH', 'PUT']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def update(self, request, *args, **kwargs):
        # Handle manual payment confirmation from admin
        if request.data.get('deposit_paid') is True:
            instance = self.get_object()
            instance.confirm_deposit_payment()
            return Response(self.get_serializer(instance).data)
            
        # Handle restocking on cancellation
        if request.data.get('status') == 'cancelled':
            instance = self.get_object()
            if instance.status != 'cancelled':
                instance.restock()

        return super().update(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Mark as viewed when an admin opens the detail page
        if not instance.is_viewed:
            instance.is_viewed = True
            instance.save()
        return super().retrieve(request, *args, **kwargs)
