# core/serializers.py
from dj_rest_auth.registration.serializers import RegisterSerializer
from allauth.account.utils import setup_user_email

class CustomRegisterSerializer(RegisterSerializer):
    # Hide the username field from the API payload validation
    username = None

    def get_cleaned_data(self):
        return {
            'email': self.validated_data.get('email', ''),
        }

    def save(self, request):
        # 1. Instantiate the default user instance
        user = super().save(request)

        # 2. Extract the prefix of the email to populate Django's required username field
        email = self.cleaned_data.get('email')
        base_username = email.split('@')[0]

        # 3. Handle duplicates by appending a suffix if the username already exists
        User = user.__class__
        username = base_username
        num = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}_{num}"
            num += 1

        user.username = username
        user.save()
        return user
