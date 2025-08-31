from django.contrib import admin
from .models import User, Post, Category, Hashtag, Comment, Like, PostFile
admin.site.register(User)
admin.site.register(Post)
admin.site.register(Category)
admin.site.register(Hashtag)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(PostFile)
