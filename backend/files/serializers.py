from rest_framework import serializers
# Use a simple import to avoid circular dependency if possible, 
# although settings.AUTH_USER_MODEL is already used in models.
from .models import File

class FileSerializer(serializers.ModelSerializer):
    fileName = serializers.CharField(source='file_name')
    fileURL = serializers.URLField(source='file_url')
    fileType = serializers.CharField(source='file_type', required=False, allow_blank=True)
    uploadDate = serializers.DateTimeField(source='upload_date', read_only=True)
    isFavourite = serializers.BooleanField(source='is_favourite', default=False)
    lastOpened = serializers.DateTimeField(source='last_opened', read_only=True)

    class Meta:
        model = File
        fields = (
            'id', 'fileName', 'category', 'tags', 'description', 
            'fileURL', 'fileType', 'uploadDate', 'isFavourite', 'lastOpened'
        )
