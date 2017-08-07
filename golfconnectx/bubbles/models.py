from django.db import models
from datetime import datetime

from django.contrib.postgres.fields import ArrayField

import consts
from common.models import BubbleTag, BubbleCategory, Campus, File
from usermgmt.models import GolfUser

class CategoryMembershipRoles(models.Model):
	category = models.ForeignKey(BubbleCategory,related_name='membership_role')
	name = models.CharField(max_length=256)
	required = models.BooleanField(default=False)
	max_count = models.IntegerField(null=True,default=0)
	position = models.IntegerField(null=True)

	def __unicode__(self):
		return self.name

class Bubble(models.Model):
	name = models.CharField(max_length=256,null=False)
	description = models.TextField()
	color = models.CharField(max_length=20,default='orange')
	category = models.ForeignKey(BubbleCategory,related_name='bubbles')
	campus = models.ForeignKey(Campus,related_name='campus_bubble',null=True,on_delete=models.SET_NULL)
	active = models.BooleanField(null=False,default=True)
	bubble_type = models.IntegerField(null=False,default=consts.BUBBLE_TYPE_NORMAL)
	icon = models.CharField(max_length=32,null=True)
	image = models.ForeignKey(File,related_name='bubble_image',null=True,on_delete=models.SET_NULL)
	cover = models.ForeignKey(File,related_name='bubble_cover_image',null=True,on_delete=models.SET_NULL)
	tags = models.ManyToManyField(BubbleTag)
	suggested = models.BooleanField(null=False,default=False)
	creation_date = models.DateTimeField(null=False,auto_now_add = True)
	allow_leaving = models.BooleanField(null=False,default=False)
	read_only = models.BooleanField(null=False,default=False)
	last_activity = models.DateTimeField(null=False,auto_now=True)
	
	contact_name = models.CharField(max_length=128)
	contact_email = models.CharField(max_length=128)
	contact_url = models.CharField(max_length=256)

	last_email_notification = models.DateTimeField(null=True)
	updates_delayed = models.BooleanField(null=False,default=False)

	member_count = models.IntegerField(null=False,default=0)
	post_count = models.IntegerField(null=False,default=0)
	view_count = models.IntegerField(null=False,default=0)
	posts_view_count = models.IntegerField(null=False,default=0)

	def __unicode__(self):
		return self.name

	def get_category_name(self):
		return self.category.name

	def get_bubble_type(self):
		type = {0:'Private',1:'Open',2:'Secret'}
		return type[self.bubble_type]


class BubbleRole(models.Model):
	user = models.ForeignKey(GolfUser,related_name='bubble_roles',null=True,on_delete=models.SET_NULL)
	bubble = models.ForeignKey(Bubble,related_name='roles',null=True,on_delete=models.SET_NULL)
	status = models.IntegerField(null=False,default=consts.BUBBLE_ROLE_INVITEE)
	updates_enabled = models.BooleanField(null=False,default=True)
	updates_delayed = models.BooleanField(null=False,default=False)
	created_by = models.ForeignKey(GolfUser,related_name='role_created_by')
	membership_role = models.ForeignKey(CategoryMembershipRoles,null=True,on_delete=models.SET_NULL)

'''
class BubblePost(models.Model):
	title = models.CharField(max_length=256)
	body = models.TextField()

	author = models.ForeignKey(GolfUser,related_name='post_user',null=True,on_delete=models.SET_NULL)
	post_type = models.IntegerField(default=consts.POST_TYPE_DISCUSSION)
	
	post_images = models.ManyToManyField(File)
	tags = models.ManyToManyField(BubbleTag)

	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)

	#Files
	files = models.ManyToManyField(File,related_name='post_files')

	#Counts
	view_count = models.IntegerField()
	comment_count = models.IntegerField()
	likes_count = models.IntegerField()

	#Flags
	deleted = models.BooleanField(null=False,default=False)
	post_edited = models.BooleanField(default=False)
	notification_sent = models.BooleanField(default = False)

	def __unicode__(self):
		return self.title

class BubblePostBubble(models.Model):
	post = models.ForeignKey(BubblePost,related_name='bubbles',null=True,on_delete=models.SET_NULL)
	bubble = models.ForeignKey(Bubble,related_name='bubble_posts',null=True,on_delete=models.SET_NULL)
	view_count = models.IntegerField(default=0)

class BubblePostFlag(models.Model):
	post = models.ForeignKey(BubblePost,null=True,on_delete=models.SET_NULL)
	requestor = models.ForeignKey(GolfUser,related_name='flag_requestor')

	post_title = models.CharField(max_length=255)
	reason = models.CharField(max_length=256)

	status = models.IntegerField(default=consts.BUBBLE_FLAG_PENDING)

	moderator = models.ForeignKey(GolfUser,related_name='flag_moderator')
	created = models.DateTimeField(auto_now_add=True)

class BubblePostComment(models.Model):
	post = models.ForeignKey(BubblePost,related_name='comments',null=True,on_delete=models.SET_NULL)
	author = models.ForeignKey(GolfUser,related_name='bubble_post_comments',null=True,on_delete=models.SET_NULL)
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)
	body = models.TextField()
	likes_count = models.IntegerField(null=False,default=0)

class BubblePostAttendee(models.Model):
	post = models.ForeignKey(BubblePost,related_name='attendees',null=True,on_delete=models.SET_NULL)
	user = models.ForeignKey(GolfUser,related_name='bubble_attending_posts',null=True,on_delete=models.SET_NULL)

class BubblePostReminder(models.Model):
	time = models.DateTimeField(null=False)
	type = models.IntegerField(null=False)
	done = models.BooleanField(default=False)
	user = models.ForeignKey(GolfUser,related_name='reminders',null=True,on_delete=models.SET_NULL)
	post = models.ForeignKey(BubblePost,related_name='bubble_post_reminders',null=True,on_delete=models.SET_NULL)

class BubblePostLike(models.Model):
	post = models.ForeignKey(BubblePost,related_name='likes',null=True,on_delete=models.SET_NULL)
	user = models.ForeignKey(GolfUser,related_name='bubble_liked_posts',null=True,on_delete=models.SET_NULL)

class BubblePostCommentLike(models.Model):
	comment = models.ForeignKey(BubblePostComment,related_name='likes',null=True,on_delete=models.SET_NULL)
	user = models.ForeignKey(GolfUser,related_name='bubble_liked_comments',null=True,on_delete=models.SET_NULL)

class BubblePostViewer(models.Model):
	post = models.ForeignKey(BubblePost,related_name='viewers',null=True,on_delete=models.SET_NULL)
	user = models.ForeignKey(GolfUser,related_name='bubble_posts_viewers',null=True,on_delete=models.SET_NULL)

class BubblePostVideo(models.Model):
	post = models.ForeignKey(BubblePost,related_name='post_videos',null=True,on_delete=models.SET_NULL)
	service = models.IntegerField(null=False,default=consts.POST_VIDEO_SERVICE_YOUTUBE)
	token = models.CharField(max_length=128,null=False)

# Promoted bubbles and stats
class PromotedBubble(models.Model):
	bubble = models.ForeignKey(Bubble,related_name='promoted',null=True,on_delete=models.SET_NULL)

class PromotedCommunityBubble(models.Model):
	bubble = models.ForeignKey(Bubble,related_name='community',null=True,on_delete=models.SET_NULL)

class BubbleStat(models.Model):
	bubble = models.ForeignKey(Bubble,related_name='stats',null=True,on_delete=models.SET_NULL)
	member = models.IntegerField()
	rank = models.IntegerField()

class BubbleApplication(models.Model):

	# Application properties
	status = models.IntegerField(null=False,default=consts.APPLICATION_STATUS_PENDING)
	requested_by_user = models.ForeignKey(GolfUser,related_name='requested_user')
	processed_by_user = models.ForeignKey(GolfUser,related_name='processed_user')
	created = models.DateTimeField(auto_now_add=True)

	bubble = models.ForeignKey(Bubble,related_name='application',null=True,on_delete=models.SET_NULL)

	# Properties for the bubble to be created
	name = models.CharField(max_length=128)
	description = models.TextField()
	category = models.ForeignKey(BubbleCategory,null=False)
	bubble_type = models.IntegerField(null=False,default=consts.BUBBLE_TYPE_NORMAL)
	tags = ArrayField(ArrayField(models.CharField(max_length=64),size=8),size=8)
	read_only = models.BooleanField(default=False)
	email = ArrayField(ArrayField(models.CharField(max_length=128),size=8),size=8)
	
	image = models.ForeignKey(File,related_name='application_image')
	cover = models.ForeignKey(File,related_name='application_cover')
	campus = models.ForeignKey(Campus)
	verification_reason = models.TextField()

	def __unicode__(self):
		return self.name

class BubbleApplicationMember(models.Model):
	bubble_application = models.ForeignKey(BubbleApplication,related_name='members',null=True,on_delete=models.SET_NULL)
	user = models.ForeignKey(GolfUser,null=True,on_delete=models.SET_NULL)
	membership_role = models.ForeignKey(CategoryMembershipRoles,related_name='application_members',null=True,on_delete=models.SET_NULL)

class UserTagNotifications(models.Model):
	bubble = models.ForeignKey(Bubble,null=True,on_delete=models.SET_NULL)
	comment = models.ForeignKey(BubblePostComment,related_name='user_tags',null=True,on_delete=models.SET_NULL)
	user = models.ForeignKey(GolfUser,null=True,on_delete=models.SET_NULL)
'''







