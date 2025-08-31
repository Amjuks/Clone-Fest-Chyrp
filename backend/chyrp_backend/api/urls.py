from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views
from .views import CommentViewSet, LikeViewSet

# Define your router and register your viewsets
router = DefaultRouter()
router.register(r'comments', CommentViewSet, basename='comments')
router.register(r'likes', LikeViewSet, basename='likes')

# Existing Django URL patterns
urlpatterns = [
    path('home/', views.HomeView.as_view(), name='home'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('me/', views.me_view, name='me'),
    path('csrf/', views.get_csrf_token, name='csrf'), 
    path('posts/create/', views.create_post_view, name='create-post'),
    path('categories/', views.category_list, name='category-list'),
    path('posts/', views.list_posts, name='list-posts'),
    path('posts/<int:post_id>/', views.get_post, name='get-post'),
]

urlpatterns += router.urls