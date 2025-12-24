from django.db import models
from django.contrib.auth import get_user_model
from orgs.models import Organization

User = get_user_model()

class Document(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="documents")
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="created_documents")
    created_at = models.DateTimeField(auto_now_add=True)
