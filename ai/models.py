from django.db import models
from django.contrib.auth import get_user_model
from documents.models import Document

User = get_user_model()

class AIConversation(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name="ai_conversations")
    asked_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="ai_questions")
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
