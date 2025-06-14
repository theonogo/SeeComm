from django.urls import path
from .views import TutorialDetailView, TutorialListCreateView, TutorialValidateView, HelloWorldView

urlpatterns = [
    path('hello/', HelloWorldView.as_view(), name='hello-world'),
    path('tutorials/', TutorialListCreateView.as_view(), name='tutorial-list-create'),
    path('tutorials/<uuid:pk>/', TutorialDetailView.as_view(), name='tutorial-detail'),
    path('tutorials/validate/', TutorialValidateView.as_view(), name='tutorial-validate'),
]