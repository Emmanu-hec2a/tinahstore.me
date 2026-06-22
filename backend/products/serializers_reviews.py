from rest_framework import serializers
from .models import ProductReview

class ProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = [
            'id', 'product', 'order', 'customer_name', 
            'rating', 'comment', 'is_verified_purchase', 'created_at'
        ]
        read_only_fields = ['is_verified_purchase', 'created_at']

    def validate(self, data):
        # Check if the order is delivered
        order = data['order']
        if order.status != 'delivered':
            raise serializers.ValidationError("Only products from delivered orders can be reviewed.")
        
        # Check if the product was actually in that order
        if not order.items.filter(product=data['product']).exists():
            raise serializers.ValidationError("This product was not part of the specified order.")
            
        return data
