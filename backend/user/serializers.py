from django.utils.timezone import localtime
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings

from .models import CustomUser, UserFCMToken, Message, ChatRoom, ChatPreview

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(allow_blank=True, required=False)
    password = serializers.CharField(allow_blank=True, required=False)
    
    class Meta:
        model = CustomUser
        fields = ["id", "username", "password", "email", "whatsapp", "call", "categories"]
        extra_kwargs = {"password":{"write_only":True},}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Fetching customer details
        if isinstance(user, CustomUser):
            token['CustomUser'] = {
                'id':user.id,
                'name': user.username,
                'whatsapp': user.whatsapp,
                'call': user.call,
                'email': user.email,
                'categories': list(user.categories.values_list('name', flat=True)),          
                }
        return token

    
class PermissionTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFCMToken
        fields = ["token"]

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["sender", "receiver", "content", "timestamp"]

class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ["name", "initiator", "initiated"]

class ChatPreviewSerializer(serializers.ModelSerializer):
    time = serializers.SerializerMethodField()

    class Meta:
        model = ChatPreview
        fields = ["latest_message", "sender", "receiver", "time"]

    def get_time(self, obj):
        print(obj)
        if hasattr(obj, 'time') and obj.time:
            return localtime(obj.time).strftime('%H:%M')  # 24-hour format
        return None

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = CustomUser.objects.get(email=value)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("No user is associated with this email.")
        return value
    
    def save(self):
        email = self.validated_data['email']
        user = CustomUser.objects.get(email=email)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        # reset_url = f"https://localhost:3000/resetpassword?uid={uid}&token={token}"
        reset_url = f"https://jalev1.vercel.app/resetpassword?uid={uid}&token={token}"
        send_mail(
            subject="Password Reset",
            message=f"Click here to reset your password: {reset_url}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )