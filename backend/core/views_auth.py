from django.conf import settings
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    # In production, this MUST match the authorized redirect URI in Google Console
    # and what the frontend is actually using.
    callback_url = getattr(settings, 'GOOGLE_OAUTH_CALLBACK_URL', "http://localhost:5173/auth/callback/")
    client_class = OAuth2Client
