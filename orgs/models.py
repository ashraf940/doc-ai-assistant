from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Organization(models.Model):
    name = models.CharField(max_length=200, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Membership(models.Model):
    class Role(models.TextChoices):
        ADMIN = "ADMIN"
        MEMBER = "MEMBER"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="memberships")
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="memberships")
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.MEMBER)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "organization")

class UserActiveOrganization(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="active_org")
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="active_users")
