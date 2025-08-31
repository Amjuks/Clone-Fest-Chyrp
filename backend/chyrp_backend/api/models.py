from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator, FileExtensionValidator
from django.db import models
from django.utils import timezone


# Custom User model
class User(AbstractUser):
    username_validator = RegexValidator(
        regex=r'^[a-z_]+$',
        message="Username must contain only lowercase letters and underscores."
    )
    username = models.CharField(
        max_length=150,
        unique=True,
        validators=[username_validator],
    )
    display_name = models.CharField(max_length=150)
    profile_pic = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return self.display_name or self.username


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Hashtag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return f'#{self.name}'


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=255)
    content = models.TextField()
    image = models.ImageField(upload_to='post_images/', blank=True, null=True)
    video = models.FileField(
        upload_to='post_videos/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['mp4', 'mov', 'avi', 'webm'])]
    )
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='posts')
    hashtags = models.ManyToManyField(Hashtag, blank=True, related_name='posts')
    is_draft = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class PostFile(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(
        upload_to='post_files/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'docx', 'txt', 'zip', 'rar'])]
    )

    def __str__(self):
        return f"File for: {self.post.title}"

    def save(self, *args, **kwargs):
        if self.post.files.count() >= 3:
            raise ValueError("Cannot upload more than 3 files to a post.")
        super().save(*args, **kwargs)


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.title}"


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')

    class Meta:
        unique_together = ('user', 'post')

    def __str__(self):
        return f"{self.user.username} likes {self.post.title}"