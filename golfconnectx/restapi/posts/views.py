import json
from datetime import datetime

from django.shortcuts import render
from django.core import serializers
from django.views.generic import View
from django.http import HttpResponse, Http404
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from posts.serializers import PostSerializer, CommentSerializer, PostAddSerializer, VideosSerializer,\
CommentAddSerializer, PostImageSerializer
from posts.models import Post, PostComment, Videos, PostFiles
from posts.adminforms import CommentForm, VideoForm, PostForm

from courses.models import Courses, CourseUserDetails
from courses.serializers import CourseListSerializer

from groups.models import Groups
from groups.serializers import GroupSerializer

from events.models import Events, EventsAccess
from events.serializers import EventListSerializer

from usermgmt.serializers import UserSerializer
from usermgmt.models import Notification

from restapi.search.views import IndexObject

class PostsHome(APIView):
    """
    List all posts, or create a new course.
    """
    def get(self, request, format=None):
    	user = request.user
    	today = datetime.today()

    	gq = (Q(created_by=self.request.user)|Q(admins = self.request.user))
    	gpost_ids = Groups.objects.filter(gq).values_list('posts',flat=True).exclude(posts=None).distinct()

    	event_access = EventsAccess.objects.filter(user = request.user,attending='Y').values_list('event', flat=True)
    	eq = (Q(created_by=request.user)|Q(id__in = event_access))
    	epost_ids = Events.objects.filter(eq,end_date__gte=today.date).values_list('posts',flat=True).exclude(posts=None).distinct()

    	cq = (Q(is_following=True)|Q(is_played=True))
    	cuds = CourseUserDetails.objects.filter(cq,user=request.user).values_list('course',flat=True)
    	cpost_ids = Courses.objects.filter(id__in=cuds).values_list('posts',flat=True).exclude(posts=None).distinct()
    	
    	fpost_ids = Post.objects.filter(author=user.friends.all,object_is_private=False).values_list('id',flat=True)

    	q =(Q(id__in=fpost_ids)|Q(author=user)|Q(comments__author=user)|Q(id__in=gpost_ids)|Q(id__in=epost_ids)|Q(id__in=cpost_ids))

        posts = Post.objects.filter(q).order_by('-id').distinct()
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)

posts_home = PostsHome.as_view()

class PostsSearchView(APIView):
	serializer_class = PostSerializer

	def get_queryset(self):
		keyword = self.request.GET.get('kw')
		q =(Q(title__icontains=keyword)|Q(body__icontains=keyword))

		posts = Post.objects.filter(q)

		return posts

	def get(self, request, *args, **kwargs):
		data = {}
		keyword = request.GET.get('kw')

		posts = self.get_queryset()

		serializer = PostSerializer(posts, many=True, context={'request': request})
		return Response(serializer.data)

posts_search = PostsSearchView.as_view()

class CreatePost(APIView):
	serializer_class = PostAddSerializer

	def get(self, request, format=None):

		q = (Q(created_by=self.request.user)|Q(members = self.request.user)|Q(admins = self.request.user))
		groups = Groups.objects.filter(q).order_by('-id').distinct()
		groupserializer = GroupSerializer(groups, many=True)

		today = datetime.today()
		event_access = EventsAccess.objects.filter(user = request.user).values_list('event', flat=True)
		q = (Q(created_by=request.user)|Q(id__in = event_access))
		events = Events.objects.filter(q,end_date__gte=today.date).order_by('start_date').distinct()
		eventserializer = EventListSerializer(events, many=True)

		data = {
        	'groups':groupserializer.data,
        	'events':eventserializer.data,
        	}

		return Response(data)

	def post(self, request, format=None):
		try:
			post_form = PostForm(request.data)
			post = post_form.save(commit=False)
			post.author = request.user
			post.save()

			parent_module = request.data.get('modal_post')
			if parent_module == 'groups':
				groups_id = request.data.get('group')
				group = Groups.objects.get(id = groups_id)
				group.posts.add(post)
				group.save()
				post.object_id = group.id
				post.object_name = group.name
				post.object_type = 'Group'
				post.object_is_private = group.is_private
			elif parent_module == 'events':
				event_id = request.data.get('event')
				event = Events.objects.get(id=event_id)
				event.posts.add(post)
				event.save()
				post.object_id = event.id
				post.object_name = event.name
				post.object_type = 'Event'
				post.object_is_private = event.is_private

			post.save()

			searchindex = IndexObject('post',post.id)
			serializer= PostAddSerializer(post)
			return Response(serializer.data, status=status.HTTP_200_OK)
		except:
			pass
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

posts_create = CreatePost.as_view()

class PostDetailView(APIView):
	serializer_class = PostAddSerializer
	def get_object(self, pk):
		try:
			return Post.objects.get(pk=pk)
		except Post.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		post = self.get_object(pk)
		serializer = PostSerializer(post, context={'request': request})

		return Response(serializer.data)

	def put(self, request, pk, format=None):
		post = self.get_object(pk)
		serializer = PostAddSerializer(post, data=request.data)
		if serializer.is_valid():
			serializer.save()
			searchindex = IndexObject('post',post.id)
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk, format=None):
		post = self.get_object(pk)
		post.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

posts_detail = PostDetailView.as_view()

class LikePost(APIView):

	def get(self, request, *args, **kwargs):
		data = {}
		post = Post.objects.get(id = int(self.kwargs['pk']))
		user = request.user
		if user not in post.liked_users.all():
			post.liked_users.add(user)
			post.likes_count += 1
			success = True
			if post.author.notify_like_post and not request.user==post.author:
				try:
					notification = Notification.objects.get(created_by=request.user,notification_type='UPL',object_id=post.id)
				except:
					notification = Notification(
						user = post.author,
						created_by = request.user,
						notification_type = 'UPL',
						object_id = post.id,
						object_type = 'Post',
						object_name = post.title,
						message = request.user.first_name+" liked your post "+post.title
					)
					notification.save()

					user = post.author
					user.notifications_count += 1
					user.save()
		else:
			post.liked_users.remove(user)
			post.likes_count -= 1
			success = False
		post.save()


		data={'like':success,'likes_count':post.likes_count}

		send_data = json.dumps(data)
		send_json = json.loads(send_data)

		return Response(send_json,status=status.HTTP_200_OK)

like_post = LikePost.as_view()

class PostLikedUsers(APIView):

	def get_object(self, pk):
		try:
			return Post.objects.get(pk=pk)
		except Post.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		data = {}
		post = self.get_object(pk=pk)

		users = post.liked_users.all()		
		serializer = UserSerializer(users,many=True)
		return Response(serializer.data)

liked_users = PostLikedUsers.as_view()

class PostComments(APIView):
	serializer_class = CommentAddSerializer
	
	def get_object(self, pk):
		try:
			return Post.objects.get(pk=pk)
		except Post.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		post = Post.objects.get(id = pk)
		comments = post.comments.all().order_by('id')
		serializer = CommentSerializer(comments, many=True)
		return Response(serializer.data)

	def post(self, request, pk, format=None):
		post = self.get_object(pk)
		commentform  = CommentForm(request.data)

		if commentform.is_valid():
			comment = commentform.save(commit=False)
			comment.author = request.user
			comment.save()

			post.comments.add(comment)
			post.comment_count = post.comments.count()
			post.save()

			try:
				image_ids = request.data['images']
				images = PostFiles.objects.filter(id__in=image_ids)
				for image in images:
					comment.images.add(image)
			except:
				pass

			if post.author.notify_comment_post and not request.user==post.author:
				notification = Notification(
					user = post.author,
					created_by = request.user,
					notification_type = 'UPC',
					object_id = post.id,
					object_type = 'Post',
					object_name = post.title,
					message = request.user.first_name+" commented on your post "+post.title
				)
				notification.save()
				
				user = post.author
				user.notifications_count += 1
				user.save()

			serializer = CommentSerializer(comment)
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

post_comments = PostComments.as_view()

class CommentDetailView(APIView):
	serializer_class = CommentAddSerializer

	def get_object(self, id):
		try:
			return PostComment.objects.get(pk=id)
		except PostComment.DoesNotExist:
			raise Http404

	def get(self, request,pk, id, format=None):
		comment = self.get_object(id)
		serializer = CommentSerializer(comment)

		return Response(serializer.data)

	def put(self, request,pk, id, format=None):
		comment = self.get_object(id)
		serializer = CommentSerializer(comment, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request,pk, id, format=None):
		comment = self.get_object(id)
		comment.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

comment_detail = CommentDetailView.as_view()

class LikeComment(View):

	def get(self, request, *args, **kwargs):
		data = {}
		comment = PostComment.objects.get(id = int(self.kwargs['id']))
		user = request.user
		if user not in comment.liked_users.all():
			comment.liked_users.add(user)
			comment.likes_count += 1
			status = 1
		else:
			comment.liked_users.remove(user)
			comment.likes_count -= 1
			status = 0
		comment.save()
		return HttpResponse(status)

like_comment = LikeComment.as_view()

class PostVideos(APIView):

	def get_object(self, pk):
		try:
			return Post.objects.get(pk=pk)
		except Post.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		post = Post.objects.get(id = pk)
		videos = post.videos.all().order_by('id')
		serializer = VideosSerializer(videos, many=True)
		return Response(serializer.data)

	def post(self, request, pk, format=None):
		post = self.get_object(pk)
		videoform  = VideoForm(request.data)

		if videoform.is_valid():
			video = videoform.save(commit=False)
			video.save()

			post.videos.add(video)
			post.save()
			serializer = VideosSerializer(video)
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

post_videos = PostVideos.as_view()

class VideoDetailView(APIView):

	def get_object(self, id):
		try:
			return Videos.objects.get(pk=id)
		except Videos.DoesNotExist:
			raise Http404

	def get(self, request,pk, id, format=None):
		video = self.get_object(id)
		serializer = VideosSerializer(video)

		return Response(serializer.data)

	def delete(self, request,pk, id, format=None):
		video = self.get_object(id)
		video.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

video_detail = VideoDetailView.as_view()

class PostAddImages(APIView):

	def post(self,request, format=None):
		images = request.data.getlist('images')

		try:
			postid = request.data['postid']
			post = Post.objects.get(id = int(postid))
			images = post.images.all()
		except:
			post = False

		imageids = []
		for image in images:
			image_obj = PostFiles()
			image_obj.name = image.name
			image_obj.image = image
			image_obj.save()
			imageids.append(image_obj.id)
			if post:
				post.images.add(image_obj)

		images = PostFiles.objects.filter(id__in=imageids)
		serializer = PostImageSerializer(images, many=True)

		return Response(serializer.data)

post_add_images = PostAddImages.as_view()

class PostGallery(APIView):

	def get_object(self, pk):
		try:
			return Post.objects.get(pk=pk)
		except Post.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		post = Post.objects.get(id = pk)
		images = post.images.all().order_by('id')
		serializer = PostImageSerializer(images, many=True)
		return Response(serializer.data)

	def post(self, request, pk, format=None):
		post = Post.objects.get(id = pk)

		images = request.data.getlist('images')

		imageids = []
		for image in images:
			image_obj = PostFiles()
			image_obj.name = image.name
			image_obj.image = image
			image_obj.save()
			post.images.add(image_obj)
			imageids.append(image_obj.id)

		images = PostFiles.objects.filter(id__in=imageids)
		serializer = PostImageSerializer(images, many=True)

		return Response(serializer.data)

post_gallery = PostGallery.as_view()

class CommentAddImages(APIView):

	def post(self,request, format=None):
		images = request.data.getlist('images')

		try:
			commentid = request.data['commentid']
			comment = PostComment.objects.get(id = int(commentid))
		except:
			comment = False

		imageids = []
		for image in images:
			image_obj = PostFiles()
			image_obj.name = image.name
			image_obj.image = image
			image_obj.save()
			imageids.append(image_obj.id)
			if comment:
				comment.images.add(image_obj)

		images = PostFiles.objects.filter(id__in=imageids)
		serializer = PostImageSerializer(images, many=True)

		return Response(serializer.data)

comment_add_images = CommentAddImages.as_view()


class CommentGallery(APIView):

	def get_object(self, pk):
		try:
			return PostComment.objects.get(pk=pk)
		except PostComment.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		comment = PostComment.objects.get(id = pk)
		images = comment.images.all().order_by('id')
		serializer = PostImageSerializer(images, many=True)
		return Response(serializer.data)

	def post(self, request, pk, format=None):
		comment = PostComment.objects.get(id = pk)

		images = request.data.getlist('images')

		imageids = []
		for image in images:
			image_obj = PostFiles()
			image_obj.name = image.name
			image_obj.image = image
			image_obj.save()
			comment.images.add(image_obj)
			imageids.append(image_obj.id)

		images = PostFiles.objects.filter(id__in=imageids)
		serializer = PostImageSerializer(images, many=True)

		return Response(serializer.data)

comment_gallery = CommentGallery.as_view()

class DeletePhoto(APIView):
	def delete(self, request, pk, format=None):
		image = PostFiles.objects.get(id = pk)
		image.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

delete_photo = DeletePhoto.as_view()


