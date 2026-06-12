from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    full_name = serializers.CharField()

    class Meta:
        model = User
        fields = ['email', 'full_name', 'password', 'confirm_password']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        full_name = validated_data.pop('full_name')
        email = validated_data['email']

        user = User.objects.create_user(
            username=email,
            email=email,
            password=validated_data['password'],
            first_name=full_name.split(' ')[0],
            last_name=' '.join(full_name.split(' ')[1:]) if len(full_name.split(' ')) > 1 else '',
        )
        # Create an empty profile placeholder
        Profile.objects.create(user=user, full_name=full_name, age=0)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ProfileSerializer(serializers.ModelSerializer):
    previous_diseases = serializers.SerializerMethodField()
    allergies_list = serializers.SerializerMethodField()
    current_medications_list = serializers.SerializerMethodField()

    # Write fields
    previous_diseases_input = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )
    allergies_input = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )
    current_medications_input = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )

    class Meta:
        model = Profile
        fields = [
            'id', 'full_name', 'phone_number', 'emergency_contact_name',
            'emergency_contact_phone', 'age', 'gender', 'blood_group',
            'previous_diseases', 'allergies_list', 'current_medications_list',
            'previous_diseases_input', 'allergies_input', 'current_medications_input',
            'profile_completed', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_previous_diseases(self, obj):
        return obj.get_previous_diseases()

    def get_allergies_list(self, obj):
        return obj.get_allergies()

    def get_current_medications_list(self, obj):
        return obj.get_current_medications()

    def update(self, instance, validated_data):
        if 'previous_diseases_input' in validated_data:
            instance.set_previous_diseases(validated_data.pop('previous_diseases_input'))
        if 'allergies_input' in validated_data:
            instance.set_allergies(validated_data.pop('allergies_input'))
        if 'current_medications_input' in validated_data:
            instance.set_current_medications(validated_data.pop('current_medications_input'))

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.profile_completed = True
        instance.save()
        return instance

    def create(self, validated_data, **kwargs):
        previous_diseases = validated_data.pop('previous_diseases_input', [])
        allergies = validated_data.pop('allergies_input', [])
        medications = validated_data.pop('current_medications_input', [])

        profile = Profile(**validated_data)
        user = kwargs.get('user')
        if user is not None:
            profile.user = user
        profile.set_previous_diseases(previous_diseases)
        profile.set_allergies(allergies)
        profile.set_current_medications(medications)
        profile.profile_completed = True
        profile.save()
        return profile


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'profile']
