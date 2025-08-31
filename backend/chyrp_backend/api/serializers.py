# serializers.py
from rest_framework import serializers
from .models import Comment, Like

class CommentSerializer(serializers.ModelSerializer):
    user_display_name = serializers.CharField(source='user.display_name', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'user_display_name', 'post', 'message', 'sent_at']
        read_only_fields = ['user', 'sent_at', 'user_display_name']

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'post']
        read_only_fields = ['user']
