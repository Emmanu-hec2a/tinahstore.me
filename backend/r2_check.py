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

import boto3
from django.conf import settings
import django, os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tinahstore.settings')
django.setup()

s3 = boto3.client(
    's3',
    endpoint_url=settings.AWS_S3_ENDPOINT_URL,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name='auto',
)

import time
timestamp = str(int(time.time()))

# Upload with timestamp
key = f'test/persist-{timestamp}.txt'
s3.put_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=key, Body=b'test')
print(f'Uploaded: {key}')

# List immediately
objects = s3.list_objects_v2(Bucket=settings.AWS_STORAGE_BUCKET_NAME)
print('All objects right now:')
for obj in objects.get('Contents', []):
    print(' -', obj['Key'])

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

# import django, os
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tinahstore.settings')
# django.setup()
# from products.models import Product
# for p in Product.objects.all():
#     if p.image:
#         print(p.id, p.image.name, p.image.url)

# List ALL objects in bucket
paginator = s3.get_paginator('list_objects_v2')
pages = paginator.paginate(Bucket=settings.AWS_STORAGE_BUCKET_NAME)
all_keys = []
for page in pages:
    for obj in page.get('Contents', []):
        all_keys.append(obj['Key'])

print('All files in R2:')
for key in all_keys:
    print(' -', key)

print()

# After the put_object call, immediately list
s3.put_object(
    Bucket=settings.AWS_STORAGE_BUCKET_NAME,
    Key='test/hello2.txt',
    Body=b'hello again',
    ContentType='text/plain',
)
print('Just uploaded test/hello2.txt')

# Immediately list
objects = s3.list_objects_v2(Bucket=settings.AWS_STORAGE_BUCKET_NAME)
print('Immediate listing:')
for obj in objects.get('Contents', []):
    print(' -', obj['Key'])