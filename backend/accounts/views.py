from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from allauth.socialaccount.models import SocialAccount

@login_required
def user_info(request):
    """Get current user information"""
    user = request.user
    
    github_account = None
    try:
        github_account = SocialAccount.objects.get(user=user, provider='github')
        github_data = github_account.extra_data
    except SocialAccount.DoesNotExist:
        github_data = {}
    
    return JsonResponse({
        'id': user.id,
        'email': user.email,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_authenticated': True,
        'github_username': github_data.get('login', ''),
        'github_avatar': github_data.get('avatar_url', ''),
    })

@ensure_csrf_cookie
def auth_status(request):
    """Check if user is authenticated"""
    if request.user.is_authenticated:
        return user_info(request)
    else:
        return JsonResponse({
            'is_authenticated': False
        })

@require_http_methods(["POST"])
def logout_view(request):
    """Logout user"""
    from django.contrib.auth import logout
    logout(request)
    return JsonResponse({'success': True})
