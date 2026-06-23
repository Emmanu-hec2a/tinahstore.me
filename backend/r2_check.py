import django, os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tinahstore.settings')
django.setup()
from django.conf import settings
print('STORAGE:', settings.DEFAULT_FILE_STORAGE)
print('BUCKET:', settings.AWS_STORAGE_BUCKET_NAME)
print('ENDPOINT:', settings.AWS_S3_ENDPOINT_URL)
print('DOMAIN:', settings.AWS_S3_CUSTOM_DOMAIN)
print('KEY:', settings.AWS_ACCESS_KEY_ID[:6], '...')

print()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tinahstore.settings')
django.setup()

import boto3
from django.conf import settings

s3 = boto3.client(
    's3',
    endpoint_url=settings.AWS_S3_ENDPOINT_URL,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name='auto',
)

try:
    # Try uploading a test file
    s3.put_object(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Key='test/hello.txt',
        Body=b'hello from tinahstore',
        ContentType='text/plain',
    )
    print('✅ Upload successful — R2 is working!')
except Exception as e:
    print('❌ Upload failed:', e)

try:
    # List bucket contents
    objects = s3.list_objects_v2(Bucket=settings.AWS_STORAGE_BUCKET_NAME)
    print('Bucket contents:', [o['Key'] for o in objects.get('Contents', [])])
except Exception as e:
    print('❌ List failed:', e)

print()

import django, os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tinahstore.settings')
django.setup()
from products.models import Product
for p in Product.objects.all():
    if p.image:
        print(p.id, p.image.name, p.image.url)