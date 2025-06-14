from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone

# Choices for user type
USER_TYPE_CHOICES = (
    ('patient', 'Patient'),
    ('doctor', 'Doctor'),
    ('hospital', 'Hospital/Clinic'),
)

class CustomUserManager(BaseUserManager):
    def create_user(self, mobile_number, password=None, **extra_fields):
        if not mobile_number:
            raise ValueError('The Mobile Number is required')
        user = self.model(mobile_number=mobile_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, mobile_number, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(mobile_number, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    mobile_number = models.CharField(max_length=15, unique=True,blank=False)
    name = models.CharField(max_length=100,blank=False)
    email = models.EmailField(blank=True, null=True)
    password = models.CharField(max_length=128,blank=False)
    age = models.PositiveIntegerField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    verification = models.BooleanField(default=False,blank=False)
    created_at = models.DateTimeField(default=timezone.now,blank=False)
    updated_at = models.DateTimeField(auto_now=True,blank=False)
    featured = models.BooleanField(default=False,blank=False)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES,blank=False,default='Patient')

    # Required by Django
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'mobile_number'
    REQUIRED_FIELDS = []  # phone is used for login

    objects = CustomUserManager()

    def __str__(self):
        return self.mobile_number
