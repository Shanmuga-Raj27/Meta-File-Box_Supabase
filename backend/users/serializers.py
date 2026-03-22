from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    dateJoined = serializers.DateTimeField(source='date_joined', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'firstName', 'lastName', 'dateJoined')

class RegisterSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name', required=False, allow_blank=True)
    lastName = serializers.CharField(source='last_name', required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'firstName', 'lastName')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user
