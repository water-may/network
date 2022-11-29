from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    poster = models.ForeignKey("User", on_delete=models.CASCADE, related_name="posts")
    text = models.CharField(max_length=1000)
    time = models.DateTimeField(auto_now_add=True)
    # likers = models.ManyToManyField("User", related_name="posts_liked", blank=True)
    def serialize(self):
        return {
            "id": self.id,
            "poster": self.poster.username,
            "text": self.text,
            "time": self.time.strftime("%b %d %Y, %I:%M %p")
        }

class Follow(models.Model):
    followie = models.ForeignKey("User", on_delete=models.CASCADE, related_name="user")
    follower = models.ForeignKey("User", on_delete=models.CASCADE, related_name="follower")

class Like(models.Model):
    post = models.ForeignKey("Post", on_delete=models.CASCADE, related_name="post")
    liker = models.ForeignKey("User", on_delete=models.CASCADE, related_name="liker")
