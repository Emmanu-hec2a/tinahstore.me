import random
import string
from django.db import models
from django.conf import settings
from products.models import Product, ProductVariant

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    STATUS_CHOICES = (
        ('pending_deposit', 'Pending Deposit'),
        ('confirmed', 'Confirmed'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )
    PAYMENT_METHOD_CHOICES = (
        ('mpesa', 'M-PESA'),
        ('card', 'Card'),
        ('manual', 'Manual (Send Money)'),
    )

    order_number = models.CharField(max_length=10, unique=True, editable=False)
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=15)
    delivery_address = models.TextField()
    city = models.CharField(max_length=50)
    county = models.CharField(max_length=50)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending_deposit')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2)
    deposit_amount = models.DecimalField(max_digits=10, decimal_places=2)
    balance_amount = models.DecimalField(max_digits=10, decimal_places=2)
    deposit_paid = models.BooleanField(default=False)
    balance_collected = models.BooleanField(default=False)
    is_viewed = models.BooleanField(default=False) # New field to track admin view status
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self.generate_order_number()
        super().save(*args, **kwargs)

    def generate_order_number(self):
        while True:
            digits = ''.join(random.choices(string.digits, k=5))
            order_number = f"TS-{digits}"
            if not Order.objects.filter(order_number=order_number).exists():
                return order_number

    def __str__(self):
        return self.order_number

    def confirm_deposit_payment(self):
        """
        Standardizes the logic for confirming a deposit payment.
        Used by both M-PESA callbacks and manual admin actions.
        """
        if not self.deposit_paid:
            self.deposit_paid = True
            if self.status == 'pending_deposit':
                self.status = 'confirmed'
            self.save()

    def reduce_stock(self):
        """
        Decrements stock for each item in the order.
        Called during order creation.
        """
        for item in self.items.all():
            if item.variant:
                if item.variant.stock >= item.quantity:
                    item.variant.stock -= item.quantity
                    item.variant.save()
            else:
                if item.product.stock >= item.quantity:
                    item.product.stock -= item.quantity
                    item.product.save()

    def restock(self):
        """
        Adds stock back to products/variants if an order is cancelled.
        """
        for item in self.items.all():
            if item.variant:
                item.variant.stock += item.quantity
                item.variant.save()
            else:
                item.product.stock += item.quantity
                item.product.save()

    @property
    def is_fully_reviewed(self):
        # Check if all items in this order have been reviewed
        from products.models import ProductReview
        item_count = self.items.count()
        review_count = ProductReview.objects.filter(order=self).count()
        return review_count >= item_count

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
