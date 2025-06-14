from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.user_info, name='user_info'),
    path('status/', views.auth_status, name='auth_status'),
    path('logout/', views.logout_view, name='logout'),
]