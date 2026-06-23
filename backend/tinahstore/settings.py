import os
from pathlib import Path
import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, False),
    DEPOSIT_PERCENTAGE=(float, 0.60),
    DELIVERY_FEE=(int, 250),
    FREE_DELIVERY_THRESHOLD=(int, 5000),
)

environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# ── Core ──────────────────────────────────────────────────────────────────────

SECRET_KEY = env('SECRET_KEY')
DEBUG       = env('DEBUG')

ALLOWED_HOSTS = env.list(
    'ALLOWED_HOSTS',
    default=['localhost', '127.0.0.1']
)

# ── Applications ──────────────────────────────────────────────────────────────

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    # Third-party
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'dj_rest_auth',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',

    # Local
    'products',
    'orders',
    'payments',
    'core',
]

# ── Middleware ────────────────────────────────────────────────────────────────

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',          # must be first
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # CSRF disabled — API uses Token auth, not session cookies
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'tinahstore.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'tinahstore.wsgi.application'

# ── Database ──────────────────────────────────────────────────────────────────

import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# ── Cache ─────────────────────────────────────────────────────────────────────

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'tinahstore-cache',
    }
}

# ── Password validation ───────────────────────────────────────────────────────

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ── Internationalisation ──────────────────────────────────────────────────────

LANGUAGE_CODE = 'en-us'
TIME_ZONE     = 'Africa/Nairobi'
USE_I18N      = True
USE_TZ        = True

# ── Static files ──────────────────────────────────────────────────────────────

STATIC_URL  = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# ── Media files ───────────────────────────────────────────────────────────────
# R2 is enabled only when R2_ACCESS_KEY_ID is present in the environment.
# Falls back to local media storage in development or if R2 isn't configured.

R2_ACCESS_KEY_ID = env('R2_ACCESS_KEY_ID', default='')

if R2_ACCESS_KEY_ID:
    DEFAULT_FILE_STORAGE    = 'storages.backends.s3boto3.S3Boto3Storage'
    AWS_ACCESS_KEY_ID       = R2_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY   = env('R2_SECRET_ACCESS_KEY', default='')
    AWS_STORAGE_BUCKET_NAME = env('R2_BUCKET_NAME', default='')
    AWS_S3_ENDPOINT_URL     = env('R2_ENDPOINT_URL', default='')
    AWS_S3_CUSTOM_DOMAIN    = env('R2_PUBLIC_URL', default='')
    AWS_DEFAULT_ACL         = 'public-read'
    AWS_QUERYSTRING_AUTH    = False
else:
    # Local media — fine for development, not suitable for production
    MEDIA_URL  = '/media/'
    MEDIA_ROOT = BASE_DIR / 'media'

# ── DRF ──────────────────────────────────────────────────────────────────────

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12,
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        *(['rest_framework.renderers.BrowsableAPIRenderer'] if DEBUG else []),
    ],
}

# ── CORS ──────────────────────────────────────────────────────────────────────

if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
else:
    CORS_ALLOW_ALL_ORIGINS = False
    CORS_ALLOWED_ORIGINS = env.list(
        'CORS_ALLOWED_ORIGINS',
        default=[
            'https://tinahstore.co.ke',
            'https://www.tinahstore.co.ke',
            'https://tinahstore.pages.dev',
            'https://tinahstore.store',
            'https://admin-tinahstore.pages.dev',
        ]
    )

CORS_ALLOW_CREDENTIALS = True

# ── Security headers (production only) ───────────────────────────────────────

if not DEBUG:
    SECURE_PROXY_SSL_HEADER        = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT            = True
    SESSION_COOKIE_SECURE          = True
    CSRF_COOKIE_SECURE             = True
    SECURE_HSTS_SECONDS            = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD            = True
    SECURE_CONTENT_TYPE_NOSNIFF    = True

# ── Business logic ────────────────────────────────────────────────────────────

DEPOSIT_PERCENTAGE      = env('DEPOSIT_PERCENTAGE')
DELIVERY_FEE            = env('DELIVERY_FEE')
FREE_DELIVERY_THRESHOLD = env('FREE_DELIVERY_THRESHOLD')

# ── M-PESA Daraja ─────────────────────────────────────────────────────────────

MPESA_CONSUMER_KEY    = env('MPESA_CONSUMER_KEY')
MPESA_CONSUMER_SECRET = env('MPESA_CONSUMER_SECRET')
MPESA_SHORTCODE       = env('MPESA_SHORTCODE')
MPESA_PASSKEY         = env('MPESA_PASSKEY')
MPESA_CALLBACK_URL    = env('MPESA_CALLBACK_URL')
MPESA_ENV             = env('MPESA_ENV', default='sandbox')

# ── Telegram alerts ───────────────────────────────────────────────────────────

TELEGRAM_BOT_TOKEN = env('TELEGRAM_BOT_TOKEN', default='')
TELEGRAM_CHAT_IDS  = env.list('TELEGRAM_CHAT_IDS', default=[])

# ── Google OAuth / allauth ────────────────────────────────────────────────────

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

SITE_ID = 1

ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_EMAIL_VERIFICATION = "none"

GOOGLE_OAUTH_CLIENT_ID     = env('GOOGLE_OAUTH_CLIENT_ID',     default='')
GOOGLE_OAUTH_CLIENT_SECRET = env('GOOGLE_OAUTH_CLIENT_SECRET', default='')
GOOGLE_OAUTH_CALLBACK_URL  = env(
    'GOOGLE_OAUTH_CALLBACK_URL',
    default='http://localhost:5173/auth/callback/'
)

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id': GOOGLE_OAUTH_CLIENT_ID,
            'secret':    GOOGLE_OAUTH_CLIENT_SECRET,
            'key':       ''
        },
        'SCOPE':       ['profile', 'email'],
        'AUTH_PARAMS': {'access_type': 'online'},
        'CALLBACK_URL': GOOGLE_OAUTH_CALLBACK_URL,
    }
}

REST_AUTH = {
    'SESSION_LOGIN': False,
    'TOKEN_MODEL':   'rest_framework.authtoken.models.Token',
}

SOCIALACCOUNT_STORE_TOKENS = True

# ── Misc ──────────────────────────────────────────────────────────────────────

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'