from django.db import models
from django.conf import settings

class File(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='files'
    )
    file_name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, default='Other')
    tags = models.JSONField(default=list, blank=True)
    description = models.TextField(blank=True, default='')
    file_url = models.URLField(max_length=1000)
    file_type = models.CharField(max_length=50, blank=True)
    upload_date = models.DateTimeField(auto_now_add=True)
    is_favourite = models.BooleanField(default=False)
    last_opened = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.file_name} ({self.user.email})"

    class Meta:
        ordering = ['-upload_date']
