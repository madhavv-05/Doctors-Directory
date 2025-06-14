from django.db import models

# Create your models here.
from django.db import models
from django.utils import timezone

class OTP(models.Model):
    contact = models.CharField(max_length=100)  # phone or email
    code = models.CharField(max_length=6)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def is_expired(self):
        return timezone.now() > self.expires_at




