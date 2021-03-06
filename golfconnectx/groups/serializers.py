from rest_framework import serializers

from groups.models import Groups, GroupImages, GroupFiles
from usermgmt.models import GolfUser
from courses.serializers import CourseListSerializer

class ImageSerializer(serializers.ModelSerializer):
	image = serializers.CharField(source='get_image_url',read_only=True)
	thumbnail = serializers.CharField(source='get_thumbnail_url',read_only=True)

	class Meta:
		model = GroupImages
		fields = ('id','image','height','width','thumbnail')

class CoverImageSerializer(serializers.ModelSerializer):
	image = serializers.CharField(source='get_image_url',read_only=True)
	cover_image_thumbnail = serializers.CharField(source='get_cover_thumbnail_url',read_only=True)

	class Meta:
		model = GroupImages
		fields = ('id','image','height','width','cover_image_thumbnail')


class FileSerializer(serializers.ModelSerializer):
	file = serializers.CharField(source='get_file_url',read_only=True)
	uploaded_on = serializers.DateTimeField('%b %d, %Y')
	uploaded_by = serializers.StringRelatedField()

	class Meta:
		model = GroupFiles
		fields = ('id','file','name','uploaded_on','uploaded_by')

class GroupSerializer(serializers.ModelSerializer):
	cover_image = serializers.CharField(source='get_api_crop_cover_image_url',read_only=True)

	class Meta:
		model = Groups
		fields = ('id','name','course','created_by','cover_image','is_private')

class GroupMemberSerializer(serializers.ModelSerializer):
	profile_image_url = serializers.CharField(source='get_api_profile_image_url',read_only=True)
	joined = serializers.SerializerMethodField('time_since')
	is_admin = serializers.SerializerMethodField('is_user_admin')

	def is_user_admin(self, obj):
		group = self.context['group']
		return group.is_group_admin(obj)

	def time_since(self,obj):
		from django.utils.timesince import timesince
		return timesince(obj.created_on)

	class Meta:
		model = GolfUser
		fields = ('id','first_name','last_name','email','is_private','profile_image_url',
			'joined','is_admin')

class GroupDetailSerializer(serializers.ModelSerializer):
	cover_image = CoverImageSerializer()
	members = GroupMemberSerializer(many = True)
	admins = GroupMemberSerializer(many = True)
	course = CourseListSerializer()

	members_count = serializers.CharField(source='get_members_count',read_only=True)
	admins_count = serializers.CharField(source='get_admins_count',read_only=True)

	is_admin = serializers.SerializerMethodField('is_user_admin')
	is_member = serializers.SerializerMethodField('is_user_member')

	def is_user_admin(self, obj):
		user = self.context['request'].user
		if user in obj.admins.all():
			status = True
		else:
			status = False
		return status

	def is_user_member(self, obj):
		user = self.context['request'].user
		if user in obj.members.all():
			status = True
		else:
			status = False
		return status

	class Meta:
		model = Groups
		fields = ('id','name','course','created_by','description','is_private','cover_image','admins',
			'members','members_count','admins_count','is_admin','is_member')

class GroupCreateSerializer(serializers.ModelSerializer):

	class Meta:
		model = Groups
		fields = ('id','name','course','description','is_private','cover_image')

class GroupAdminSerializer(serializers.ModelSerializer):
	admins = GroupMemberSerializer(many = True)
	
	class Meta:
		model = Groups
		fields = ('id','admins')

class GroupEditInfoSerializer(serializers.ModelSerializer):

	class Meta:
		model = Groups
		fields = ('id','description')
