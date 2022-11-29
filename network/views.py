import json
from django.core.paginator import Paginator
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from .models import User, Post, Follow, Like

from django.utils import timezone


def index(request):
    return render(request, "network/index.html")

def following(request):
    return render(request, "network/index.html", {
            "following":  True
        })

@login_required
@csrf_exempt
def post(request, route, page):
    # only take POST requests

    # return all the posts if it is a GET request.
    if request.method == "GET":
        if route.split("=")[0] == "user":
            username = route.split("=")[1]
            user = User.objects.get(username = username)
            posts = Post.objects.filter(poster = user)
        elif route == 'all':
            posts = Post.objects.all()
        elif route == 'following':   
            current = User.objects.get(username=request.user)
            follow_data = Follow.objects.filter(follower=current)
            posts = Post.objects.filter(poster__username__in=[data.followie.username for data in follow_data])

        posts = posts.order_by("-time").all()
        post_page = Paginator(posts, 10)

        if post_page.num_pages > page < 1:
            return JsonResponse({"error": "Invalid Page Num"})

        
        current_page = post_page.page(page)
        return JsonResponse({
            "posts": [post.serialize() for post in current_page.object_list],
            "pagecount": post_page.num_pages,
            "previous": current_page.has_previous(),
            "next": current_page.has_next(),
            "user": str(request.user),
            },
            safe=False)

    # create a post if it is a post request.
    elif request.method == "POST":
        post = request.POST["post"]
        newpost = Post.objects.create(poster=request.user, text=post)
        newpost.save()
        return HttpResponseRedirect(reverse("index"))

    # update the post.
    elif request.method == "PUT":
        if route.split("=")[0] != "id":
            return JsonResponse({"error": "Wrong edit request."}, status=403)


        data =  json.loads(request.body)
        id = int(route.split("=")[1])
       
        if str(request.user) == data["post"]["poster"] and data["post"]["id"] == id:
            poster = User.objects.get(username=request.user)
            try:
                post = Post.objects.get(id=data["post"]["id"], poster=poster)
            except Post.DoesNotExist:
                return JsonResponse({"error": "Email not found."}, status=404)

            post.text = data["newtext"]
            post.save()
            newpost = Post.objects.get(id=data["post"]["id"], poster=poster)
            return JsonResponse({
                "status": "Done",
                "user": str(request.user),
                "post": newpost.serialize(),
                }, 
                status=200)
        else:
            return JsonResponse({"Error": "Only original poster can edit the post"}, status=403)

@login_required
def profile(request, username):
    # condition for follow button on profile
    user = User.objects.get(username=username)
    if request.user == user:
        followed = None
    else:
        # Edit it after adding the box
        followed = False
    
    # data for follower and followed
    followers = Follow.objects.filter(followie=user).count
    following = Follow.objects.filter(follower=user).count

    # getting all the posts for current users 
    posts = Post.objects.filter(poster=user)
    posts = posts.order_by("-time").all()
    
    return render(request, "network/profile.html", {
        "name": username,
        "followers": followers,
        "following": following,
        "followed": followed,
        })

@login_required
@csrf_exempt
def like(request):
    if request.method != "POST" and request.method != "PUT":
        return JsonResponse({"error": "Sorry, this request is invalid."}, status=403)

    user = request.user
    body = json.loads(request.body)
    user = User.objects.get(username=str(user))
    postid = body["post"]["id"] 
    post = Post.objects.get(pk=int(postid))
    liked = Like.objects.filter(post=post, liker=user).exists()

    if request.method == "POST":
        if liked:
            return JsonResponse({"liked": True}, status=200)
        else:
            return JsonResponse({"liked": False}, status=200)
    elif request.method == "PUT":
        if liked:
            like = Like.objects.get(post=post, liker=user)
            like.delete()
            return JsonResponse({"liked": False}, status=200)
        else:
            like = Like.objects.create(post=post, liker=user)
            like.save()
            liked = Like.objects.filter(post=post, liker=user).exists()
            return JsonResponse({"liked": liked}, status=200)


    

@login_required
@csrf_exempt
def follow(request, user):
    # follower data
    follower = request.user
    follower = User.objects.get(username=follower)

    # user data
    user = User.objects.get(username=user)

    # chech for if the user is viewing own profile
    if user != follower:
        follow_data = Follow.objects.filter(followie=user, follower=follower).exists()
    else:
        return JsonResponse({"followed": "same"}, status=200)

    if request.method == "GET":
        # for initial request
        if follow_data:
            return JsonResponse({"followed": "true"}, status=200)
        else:
            return JsonResponse({"followed": "false"}, status=200)
    if request.method == "POST":
        # for when (un)follow button is clicked
        if not follow_data:
            f = Follow(follower=follower, followie=user)
            f.save()
            return JsonResponse({"followed": "true"}, status=200)
        else:
            f = Follow.objects.get(follower=follower, followie=user)
            f.delete()
            return JsonResponse({"followed": "false"}, status=200)
 

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
