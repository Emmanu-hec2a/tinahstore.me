# core/serializers.py
from dj_rest_auth.registration.serializers import RegisterSerializer

class CustomRegisterSerializer(RegisterSerializer):
    username = None

    def get_cleaned_data(self):
        # Using .get() with fallback strings ensures the serializer never
        # crashes if passwords or usernames are omitted during social signup
        return {
            'email': self.validated_data.get('email', ''),
            'password1': self.validated_data.get('password1', ''),
            'password2': self.validated_data.get('password2', ''),
        }
