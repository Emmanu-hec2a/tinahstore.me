from rest_framework import serializers
from .models import MpesaTransaction

class MpesaTransactionSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    customer_name = serializers.CharField(source='order.customer_name', read_only=True)
    balance_amount = serializers.DecimalField(source='order.balance_amount', max_digits=10, decimal_places=2, read_only=True)
    balance_collected = serializers.BooleanField(source='order.balance_collected', read_only=True)

    class Meta:
        model = MpesaTransaction
        fields = [
            'order_number', 'customer_name', 'balance_amount', 'balance_collected',
            'checkout_request_id', 'merchant_request_id', 'phone_number', 
            'amount', 'mpesa_receipt_number', 'result_code', 
            'result_desc', 'created_at'
        ]
