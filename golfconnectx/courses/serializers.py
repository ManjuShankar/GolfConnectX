from rest_framework import serializers
from django.utils.timesince import timesince

from courses.models import Courses, CourseScores, CourseUserDetails, CourseImages
from usermgmt.models import GolfUser

from usermgmt.serializers import UserSerializer, UserListSerializer
from posts.serializers import PostSerializer

DATEFORMAT=['%m/%d/%Y']

class ImageSerializer(serializers.ModelSerializer):
	image = serializers.SerializerMethodField('get_thumbnail_url')

	def get_thumbnail_url(self, obj):
		return obj.get_image_url()

	class Meta:
		model = CourseImages
		fields = ('id','image','height','width')

class ScoreImageSerializer(serializers.ModelSerializer):
	src = serializers.SerializerMethodField('get_image_url')
	thumbnail = serializers.SerializerMethodField('get_method_thumbnail_url')
	thumbnail_height = serializers.SerializerMethodField('get_mthumbnail_height')
	thumbnail_width = serializers.SerializerMethodField('get_mthumbnail_width')

	def get_image_url(self, obj):
		return obj.get_image_url()

	def get_method_thumbnail_url(self, obj):
		return obj.get_thumbnail_url()

	def get_mthumbnail_height(self,obj):
		return obj.height

	def get_mthumbnail_width(self,obj):
		return obj.width

	class Meta:
		model = CourseImages
		fields = ('id','src','thumbnail_height','thumbnail_width','thumbnail')

class CourseUserDetailsSerializer(serializers.ModelSerializer):

	latest_score_date = serializers.DateField('%m/%d/%Y')
	top_score_date = serializers.DateField('%m/%d/%Y')

	is_following_date = serializers.SerializerMethodField('time_since')
	images = ScoreImageSerializer(many=True)
	
	def time_since(self,obj):
		if obj.is_following_date:
			return timesince(obj.is_following_date)
		else:
			return None
			
	class Meta:
		model = CourseUserDetails
		fields = ('course','is_following','is_favorite','is_played','is_visited','latest_score',
			'top_score','latest_score_date','top_score_date','notes','is_following_date','images')

class CourseMinSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = Courses
		fields = ('id','name')

class CourseSerializer(serializers.ModelSerializer):
	#posts = PostSerializer(many = True)
	#posts = serializers.SerializerMethodField('course_posts')
	admin = UserListSerializer()
	cover_image = serializers.SerializerMethodField()

	def get_cover_image(self,obj):
		return obj.get_cover_image()
	
	def course_posts(self,obj):
		posts = obj.posts.all()
		serializer = PostSerializer(posts,context={'request': self.context['request']})
		return serializer.data

	class Meta:
		model = Courses
		fields = ('id','name','description','address1','address2','city',
			'zip_code','state','phone','mobile','email','is_premium','lat','lon',
			'zoom','created_by','admin','cover_image')

class CourseEditSerializer(serializers.ModelSerializer):
	cover_image = ImageSerializer(required=False)

	class Meta:
		model = Courses
		fields = ('id','name','description','address1','address2','city','state',
			'zip_code','phone','mobile','email','cover_image')

class CourseListSerializer(serializers.ModelSerializer):
	created_on = serializers.SerializerMethodField('time_since')

	def time_since(self,obj):
		return timesince(obj.created_on)

	class Meta:
		model = Courses
		fields = ('id','name','is_premium','created_by','city','state','created_on')

class ProfileCourseListSerializer(serializers.ModelSerializer):
	created_on = serializers.SerializerMethodField('time_since')
	following_since = serializers.SerializerMethodField('following_time_since')
	cover_image = serializers.SerializerMethodField()

	def get_cover_image(self,obj):
		return obj.get_cover_image()

	def following_time_since(self,obj):
		user = self.context['request'].user
		cud = obj.get_user_details(user)
		if cud.is_following_date:
			return timesince(cud.is_following_date)
		else:
			return None

	def time_since(self,obj):
		return timesince(obj.created_on)

	class Meta:
		model = Courses
		fields = ('id','name','is_premium','created_by','city','state','created_on',
			'following_since','cover_image')

class CourseScoreSerializer(serializers.ModelSerializer):
	played_on = serializers.DateField('%m/%d/%Y')
	images = ScoreImageSerializer(many=True)
	user = UserListSerializer()
	
	class Meta:
		model = CourseScores
		fields = ('id','played_on','score','notes','images','user')

class GroupCourseListSerializer(serializers.ModelSerializer):

	class Meta:
		model = Courses
		fields = ('id','name','city','state')

class CourseSettingsSerializer(serializers.ModelSerializer):

	class Meta:
		model = CourseUserDetails
		fields = ('is_favorite','is_visited','notes')

