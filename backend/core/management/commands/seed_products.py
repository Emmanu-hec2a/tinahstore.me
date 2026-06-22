from django.core.management.base import BaseCommand
from products.models import Category, Product, ProductVariant

class Command(BaseCommand):
    help = 'Seeds the database with initial products and variants'

    def handle(self, *args, **kwargs):
        categories_data = [
            {'name': 'Totes', 'description': 'Spacious and stylish tote bags'},
            {'name': 'Crossbody', 'description': 'Convenient crossbody bags'},
            {'name': 'Backpacks', 'description': 'Functional and trendy backpacks'},
            {'name': 'Clutches', 'description': 'Elegant clutches for special occasions'},
        ]

        categories = {}
        for cat_data in categories_data:
            cat, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']}
            )
            categories[cat_data['name']] = cat

        products_data = [
            {'name': 'Amara Leather Tote', 'category': 'Totes', 'price': 8900, 'original_price': 10500},
            {'name': 'Naivasha Crossbody', 'category': 'Crossbody', 'price': 5200, 'original_price': None},
            {'name': 'Zuri Weekender Backpack', 'category': 'Backpacks', 'price': 9600, 'original_price': None},
            {'name': 'Lamu Raffia Clutch', 'category': 'Clutches', 'price': 2400, 'original_price': None},
            {'name': 'Kilima Hobo Bag', 'category': 'Totes', 'price': 7300, 'original_price': None},
            {'name': 'Sable Mini Tote', 'category': 'Totes', 'price': 4800, 'original_price': None},
            {'name': 'Rusinga Day Backpack', 'category': 'Backpacks', 'price': 8200, 'original_price': None},
            {'name': 'Tana Structured Satchel', 'category': 'Crossbody', 'price': 6500, 'original_price': None},
        ]

        variants_config = [
            {'color_name': 'Midnight Black', 'color_hex': '#000000'},
            {'color_name': 'Caramel Tan', 'color_hex': '#C68E17'},
        ]
        sizes = ['Regular', 'Large']

        for prod_data in products_data:
            product, created = Product.objects.get_or_create(
                name=prod_data['name'],
                category=categories[prod_data['category']],
                defaults={
                    'price': prod_data['price'],
                    'original_price': prod_data['original_price'],
                    'description': f"High-quality {prod_data['name']} for everyday use.",
                    'stock': 50,
                    'is_active': True
                }
            )

            for variant_data in variants_config:
                for size in sizes:
                    ProductVariant.objects.get_or_create(
                        product=product,
                        color_name=variant_data['color_name'],
                        color_hex=variant_data['color_hex'],
                        size=size,
                        defaults={'stock': 10}
                    )

        self.stdout.write(self.style.SUCCESS('Successfully seeded products and variants'))
