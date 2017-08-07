from rest_framework import serializers

from posts.models import Post, PostComment, Videos, PostFiles
from usermgmt.serializers import UserSerializer

class PostAddSerializer(serializers.ModelSerializer):

	class Meta:
		model = Post
		fields = ('id','title','body')

class VideosSerializer(serializers.ModelSerializer):

	class Meta:
		model = Videos
		fields = ('id','video_url','type')

class PostImageSerializer(serializers.ModelSerializer):
	image = serializers.SerializerMethodField()
	thumbnail = serializers.SerializerMethodField()

	def get_image(self, obj):
		return obj.get_image_url()

	def get_thumbnail(self, obj):
		return obj.get_thumbnail_url()

	class Meta:
		model = PostFiles
		fields= ('id','name','image','thumbnail')

class CommentSerializer(serializers.ModelSerializer):
	author = UserSerializer()
	created = serializers.DateTimeField('%b %d @ %I:%M %p')

	created_since = serializers.SerializerMethodField('time_since')
	images = PostImageSerializer(many=True)

	def time_since(self,obj):
		from django.utils.timesince import timesince
		return timesince(obj.created)
		
	class Meta:
		model = PostComment
		fields = ('id','body','created','author','created_since','images')

class CommentAddSerializer(serializers.ModelSerializer):

	class Meta:
		model = PostComment
		fields= ('body',)

class PostSerializer(serializers.ModelSerializer):
	author = UserSerializer()
	comments = CommentSerializer(many = True)
	created = serializers.DateTimeField('%b %d')
	has_like = serializers.SerializerMethodField('has_user_liked')

	created_since = serializers.SerializerMethodField('time_since')
	images = PostImageSerializer(many=True)

	def has_user_liked(self,obj):
		user = self.context['request'].user
		if user in obj.liked_users.all():
			like = True
		else:
			like = False
		return like

	def time_since(self,obj):
		from django.utils.timesince import timesince
		return timesince(obj.created)


	class Meta:
		model = Post
		fields = ('id','title','body','author','likes_count','created','comments','created_since',
			'has_like','object_id','object_type','object_name','images')
