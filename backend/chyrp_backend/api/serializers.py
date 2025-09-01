# app/serializers.py
from rest_framework import serializers
from .models import Comment, Like, User, Post, PostFile

class UserInlineSerializer(serializers.ModelSerializer):
    profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "display_name", "profile_pic"]

    def get_profile_pic(self, obj):
        return obj.profile_pic.url if obj.profile_pic else None


class CommentSerializer(serializers.ModelSerializer):
    user = UserInlineSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "post", "user", "message", "sent_at"]
        read_only_fields = ["id", "user", "sent_at"]


class LikeSerializer(serializers.ModelSerializer):
    user = UserInlineSerializer(read_only=True)

    class Meta:
        model = Like
        fields = ["id", "post", "user"]
        read_only_fields = ["id", "user"]

class PostFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostFile
        fields = ['file']

class PostSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField()
    liked_by_me = serializers.SerializerMethodField()
    display_name = serializers.CharField(source="user.display_name", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    profile_pic = serializers.SerializerMethodField()
    files = PostFileSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            "id", "title", "content", "image", "video", "category", "created_at", "hashtags",
            "display_name", "username", "profile_pic",
            "like_count", "liked_by_me", "files"
        ]

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_liked_by_me(self, obj):
        user = self.context["request"].user
        if user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False

    def get_profile_pic(self, obj):
        return obj.user.profile_pic.url if obj.user.profile_pic else None
