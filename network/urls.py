
from django.urls import path

from . import views

urlpatterns = [
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("post/<str:route>/<int:page>", views.post, name="post"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("follow/<str:user>", views.follow, name="follow"),
    path("like", views.like, name="like"),
    path("", views.index, name="index"),
    path("following", views.index, name="following")
]
