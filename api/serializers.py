from rest_framework import serializers
from .models import SupportForm

class SupportMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportForm
        fields = ['name', 'email', 'message']