from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from .models import File
from .serializers import FileSerializer

class FileViewSet(viewsets.ModelViewSet):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Crucial for Data Isolation:
        Always filter by the logged-in user.
        """
        return File.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Automatically assign the logged-in user to the new file record.
        """
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def toggle_favourite(self, request, pk=None):
        file = self.get_object()
        file.is_favourite = not file.is_favourite
        file.save()
        return Response({'is_favourite': file.is_favourite})

    @action(detail=True, methods=['post'])
    def mark_opened(self, request, pk=None):
        file = self.get_object()
        file.last_opened = timezone.now()
        file.save()
        return Response({'last_opened': file.last_opened})
