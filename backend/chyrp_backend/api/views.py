import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.views import View

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import User, Post, Category, Hashtag, PostFile, Comment, Like
from .serializers import CommentSerializer, LikeSerializer, PostSerializer

@method_decorator(login_required, name='dispatch')
class HomeView(View):
    def get(self, request):
        return JsonResponse({'display_name': request.user.display_name or request})

@login_required
def me_view(request):
    user = request.user
    return JsonResponse({
        'username': user.username,
        'display_name': user.display_name,
        'profile_pic': user.profile_pic.url if user.profile_pic else None,
    })

def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})

@csrf_exempt
@require_POST
def login_view(request):
    data = json.loads(request.body.decode('utf-8'))
    username = data.get('username')
    password = data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({'message': 'Login successful'})
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=400)


@csrf_exempt
@require_POST
def register_view(request):
    data = json.loads(request.body.decode('utf-8'))
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return JsonResponse({'error': 'Username and password required'}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({'error': 'Username already exists'}, status=400)

    user = User.objects.create_user(username=username, password=password, display_name=username)
    login(request, user)
    return JsonResponse({'message': 'Registration successful'})


@csrf_exempt
@require_POST
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logged out successfully'})

from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.core.exceptions import ValidationError

@login_required
@require_http_methods(["POST"])
@csrf_exempt  # You still handle CSRF manually in React
def create_post_view(request):
    user = request.user
    title = request.POST.get('title')
    content = request.POST.get('content')
    category_id = request.POST.get('category')
    hashtags = request.POST.get('hashtags', '')  # comma-separated

    image = request.FILES.get('image')
    video = request.FILES.get('video')
    files = request.FILES.getlist('attachments')  # Multiple attachments

    if not title or not content:
        return JsonResponse({'error': 'Title and content are required.'}, status=400)

    category = Category.objects.filter(id=category_id).first()

    post = Post.objects.create(
        user=user,
        title=title,
        content=content,
        category=category,
        image=image,
        video=video,
        created_at=timezone.now()
    )

    # Hashtag logic
    for tag in [t.strip().lower().lstrip('#') for t in hashtags.split(',') if t.strip()]:
        hashtag, _ = Hashtag.objects.get_or_create(name=tag)
        post.hashtags.add(hashtag)

    # Handle up to 3 attachments
    for f in files[:3]:
        PostFile.objects.create(post=post, file=f)

    return JsonResponse({'message': 'Post created successfully'})

def category_list(request):
    categories = Category.objects.all().values('id', 'name')
    return JsonResponse(list(categories), safe=False)

def list_posts(request):
    posts = Post.objects.select_related('user', 'category').all().order_by('-created_at')
    data = [
        {
            'id': post.id,
            'title': post.title,
            'content': post.content[:200] + ('...' if len(post.content) > 200 else ''),
            'username': post.user.username,
            'display_name': post.user.display_name,
            'profile_pic': post.user.profile_pic.url if post.user.profile_pic else None,
            'image': post.image.url if post.image else None,
            'category': post.category.name if post.category else None,
            'created_at': post.created_at.strftime('%Y-%m-%d %H:%M'),
        }
        for post in posts
    ]
    return JsonResponse(data, safe=False)

def get_post(request, post_id):
    post = get_object_or_404(Post.objects.select_related('user', 'category'), pk=post_id)
    serializer = PostSerializer(post, context={"request": request})
    return JsonResponse(serializer.data, safe=False)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by("sent_at")
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        post_id = self.request.query_params.get("post")
        if post_id:
            return Comment.objects.filter(post_id=post_id).order_by("sent_at")
        return Comment.objects.none()


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        post_id = self.request.query_params.get("post")
        if post_id:
            return Like.objects.filter(post_id=post_id)
        return Like.objects.none()

    def create(self, request, *args, **kwargs):
        post_id = request.data.get("post")
        if Like.objects.filter(user=request.user, post_id=post_id).exists():
            return Response({"detail": "Already liked"}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)

    @action(detail=False, methods=["delete"], permission_classes=[permissions.IsAuthenticated])
    def unlike(self, request):
        post_id = request.data.get("post")
        like = Like.objects.filter(user=request.user, post_id=post_id).first()
        if like:
            like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "Like not found"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path="toggle")
    def toggle_like(self, request):
        post_id = request.data.get("post_id")
        post = Post.objects.get(id=post_id)
        user = request.user

        like, created = Like.objects.get_or_create(user=user, post=post)
        if not created:
            like.delete()
            return Response({
                "liked": False,
                "like_count": post.likes.count()
            })
        return Response({
            "liked": True,
            "like_count": post.likes.count()
        })
    
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by("-created_at")
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
