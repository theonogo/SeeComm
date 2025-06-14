from django.db import models
import uuid
from django.contrib.auth import get_user_model

User = get_user_model()

class Tutorial(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tutorials')
    transcript = models.JSONField()
    video_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255)
    body = models.JSONField()

    def __str__(self):
        return self.title