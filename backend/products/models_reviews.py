from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from .models import Product
from orders.models import Order

class ProductReview(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    order = models.ForeignKey(Order, related_name='product_reviews', on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=100)
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True)
    is_verified_purchase = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('product', 'order') # One review per product per order

    def __str__(self):
        return f"{self.rating} stars for {self.product.name} by {self.customer_name}"
