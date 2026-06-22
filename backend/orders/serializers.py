from django.conf import settings
from rest_framework import serializers
from products.models import Product, ProductVariant
from .models import Order, OrderItem
from payments.models import MpesaTransaction
from payments.serializers import MpesaTransactionSerializer
from payments.services.mpesa import mpesa_service
from core.services.telegram import telegram_service

class OrderItemSerializer(serializers.ModelSerializer):
    product_slug = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=Product.objects.all(),
        source='product'
    )
    variant_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.all(),
        source='variant',
        required=False,
        allow_null=True
    )
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['product_slug', 'variant_id', 'quantity', 'unit_price', 'primary_image']
        read_only_fields = ['unit_price', 'primary_image']

    def get_primary_image(self, obj):
        # We need the product list serializer's logic to get the primary image URL
        image = obj.product.images.filter(is_primary=True).first()
        if not image:
            image = obj.product.images.first()
        if image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(image.image.url)
            return image.image.url
        return None

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    transactions = MpesaTransactionSerializer(many=True, read_only=True)
    checkout_request_id = serializers.CharField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer_name', 'customer_email', 'customer_phone',
            'delivery_address', 'city', 'county', 'payment_method', 'status',
            'total_amount', 'delivery_fee', 'deposit_amount', 'balance_amount',
            'deposit_paid', 'balance_collected', 'items', 'transactions', 
            'checkout_request_id', 'is_fully_reviewed', 'created_at'
        ]
        read_only_fields = [
            'id', 'order_number', 'total_amount', 'delivery_fee',
            'deposit_amount', 'balance_amount', 'is_fully_reviewed', 'created_at'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # We need to calculate prices before creating the order
        # First, create the order shell to get the ID, or calculate totals first
        
        subtotal = 0
        order_items = []
        
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            unit_price = product.price
            subtotal += unit_price * quantity
            order_items.append({
                'product': product,
                'variant': item_data.get('variant'),
                'quantity': quantity,
                'unit_price': unit_price
            })

        # --- Deposit & Delivery Fee Calculation ---
        # Subtotal is the sum of (unit_price * quantity) for all items.
        # Delivery fee is waived if subtotal meets the FREE_DELIVERY_THRESHOLD.
        # Deposit is a configurable percentage (DEPOSIT_PERCENTAGE) of the total.
        # Balance is the remaining amount to be paid in cash on delivery.
        delivery_fee = 0 if subtotal >= settings.FREE_DELIVERY_THRESHOLD else settings.DELIVERY_FEE
        total = subtotal + delivery_fee
        deposit = round(float(total) * settings.DEPOSIT_PERCENTAGE, 2)
        balance = round(float(total) - deposit, 2)

        # Create the order
        order = Order.objects.create(
            total_amount=total,
            delivery_fee=delivery_fee,
            deposit_amount=deposit,
            balance_amount=balance,
            **validated_data
        )

        # Create order items
        for item in order_items:
            OrderItem.objects.create(order=order, **item)

        # Reduce Stock Immediately
        order.reduce_stock()

        # Send Telegram Alert for new order
        try:
            telegram_service.notify_new_order(order)
        except Exception as e:
            print(f"Telegram Notify Error: {e}")

        # Trigger STK Push if payment method is mpesa
        if order.payment_method == 'mpesa':
            try:
                stk_response = mpesa_service.initiate_stk_push(order)
                
                if stk_response.get('ResponseCode') == '0':
                    checkout_request_id = stk_response.get('CheckoutRequestID')
                    merchant_request_id = stk_response.get('MerchantRequestID')
                    
                    # Create MpesaTransaction record
                    MpesaTransaction.objects.create(
                        order=order,
                        checkout_request_id=checkout_request_id,
                        merchant_request_id=merchant_request_id,
                        phone_number=order.customer_phone,
                        amount=order.deposit_amount
                    )
                    
                    # Add checkout_request_id to order object for the response
                    order.checkout_request_id = checkout_request_id
                else:
                    # Log failure or handle error
                    pass
            except Exception as e:
                # Handle connection errors etc
                print(f"STK Push Error: {e}")

        return order
