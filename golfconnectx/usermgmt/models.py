import os
import uuid
from easy_thumbnails.files import get_thumbnailer

from datetime import datetime

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from django.conf import settings as mysettings 

from common.models import BubbleTag, BubbleCategory, File, Campus

USER_NORMAL = 0
USER_VENDOR = 1
USER_MODERATOR = 2
USER_ADMIN = 10

# User Group types
USER_GROUP_TYPE_USER = 'user'
USER_GROUP_TYPE_BUBBLE = 'bubble'
USER_GROUP_TYPE_CATEGORY = 'category'
USER_GROUP_TYPE_CAMPUS = 'campus'
USER_GROUP_TYPE_USER_BIO = 'bio'

USER_GROUP_OPERATOR_AND = 'and'
USER_GROUP_OPERATOR_OR = 'or'

# Enrollment status types
UNDECIDED_USER_STATUS = 1
NOT_ENROLLED_USER_STATUS = 2
ENROLLED_USER_STATUS = 3

USER_TYPES = set([USER_NORMAL, USER_VENDOR, USER_MODERATOR, USER_ADMIN])

DEFAULT_SKILL = 'Beginner'
DEFAULT_PROFILE_TYPE = 'PU'
DEFAULT_GOLFER_TYPE = 'Amateur'
CONVERSATION_TYPE = (('P','Personal'),('G','Group'))

GOLFER_SKILLS = (('B','Beginner'),('I','Intermediate'),('A','Advance'),('E','Expert'))

def get_user_image_path(instance, filename):
	ext = filename.split('.')[-1]
	filename = "%s.%s" % (uuid.uuid4(), ext)
	return os.path.join('user/images', filename)

class UserRole(models.Model):
	name = models.CharField(max_length=150,unique=True)
	is_student = models.BooleanField(default=False,blank=False)
	resume_enabled = models.BooleanField(default=True,blank=False)

	def __unicode__(self):
		return self.name

class UserGroup(models.Model):
	name = models.CharField(max_length=64,unique=True)
	rules = models.TextField()
	users = models.IntegerField(null=True,default=0)
	created = models.DateField(auto_now_add = True)
	category = models.ForeignKey(BubbleCategory)
	is_editable = models.BooleanField(null=False,default=True)

	def __unicode__(self):
		return self.name

class UserImage(models.Model):
	name = models.CharField(max_length=256,null=True)
	image = models.ImageField(upload_to=get_user_image_path,null=True,blank=True)

	def get_image_url(self):
		options = {'size': (144, 144), 'crop': True}
		image_url = get_thumbnailer(self.image).get_thumbnail(options).url
		return str(mysettings.SITE_URL)+image_url

class GolfUserManager(BaseUserManager):

    def create_user(self, email, first_name, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        now = timezone.now()
        
        user = self.model(email=GolfUserManager.normalize_email(email))
        user.first_name = first_name
        user.email = email
        user.set_password(password)
        user.last_login = user.date_joined = user.last_attempt = now
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, password):
        user = self.create_user(email=email,
            first_name=first_name, password=password)
        user.email = email
        user.first_name = first_name
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

class GolfUser(AbstractBaseUser,PermissionsMixin):
	first_name = models.CharField(max_length=150)
	last_name = models.CharField(max_length=150,null=True)
	email = models.EmailField(unique=True)
	phone = models.CharField(max_length=100,null=True)

	profile_image = models.ForeignKey(UserImage,null=True,related_name="user_profile_image")
	cover_image = models.ForeignKey(UserImage,null=True,related_name="user_cover_image")
	images = models.ManyToManyField(UserImage)
	
	is_active = models.BooleanField(default=True)
	is_private = models.BooleanField(default=False)
	is_staff = models.BooleanField(default=False)

	user_role = models.ForeignKey(UserRole,null=True,related_name="user_role")

	skill_level = models.CharField(max_length='50',default=DEFAULT_SKILL)#B=Beginner,I-Intermediatte,E-Expert
	profile_type = models.CharField(max_length='10',default=DEFAULT_PROFILE_TYPE)#PU=Public,PR=Private
	#handicap = models.IntegerField(null=False,default=0)
	handicap = models.FloatField(default=0.0)
	golfer_type = models.CharField(max_length='50',default=DEFAULT_GOLFER_TYPE)

	zipcode = models.CharField(max_length='10',null=True)
	#Notifications Settings
	notify_like_post = 	models.BooleanField(default=True)#Like your post
	notify_comment_post = models.BooleanField(default=True)#Comments on your post
	notify_share_post = models.BooleanField(default=True)#Shares your post
	notify_comment_discussion = models.BooleanField(default=True)#Comments on your group discussion
	notify_invite_event = models.BooleanField(default=True)#Invites you to an event
	notify_accept_invitation = models.BooleanField(default=True)#Accept your invitation
	notify_event_join = models.BooleanField(default=True)#Joins an event you're attending
	notify_event_updates = models.BooleanField(default=True)#Email Updates
	notify_group_updates = models.BooleanField(default=True)#Group Updates

	#Email Settings
	email_invitation = models.BooleanField(default=False)#Invitations
	email_messages = models.BooleanField(default=False)#Messages
	email_notifications = models.BooleanField(default=False)#Notifications
	email_site_messages = models.BooleanField(default=False)#GolfConnectX Messages

	created_on = models.DateTimeField(auto_now_add = True)
	modified_on = models.DateTimeField(auto_now = True)

	friends = models.ManyToManyField('GolfUser')

	fb_id = models.CharField(max_length='20',null=True)

	notifications_count = models.IntegerField(null=True,default=0)
	friends_ids = models.TextField(null=True)

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['first_name']
	objects = GolfUserManager()

	def __unicode__(self):
		return self.first_name

	def get_short_name(self):
		return self.first_name

	def get_full_name(self):
		if self.last_name:
			full_name = self.first_name +" "+ self.last_name
		else:
			full_name = self.first_name
		return full_name

	def initials(self):
		if self.last_name:
			full_name = self.first_name[0].title() + self.last_name[0].title()
		else:
			full_name = self.first_name[0].title()
		return full_name

	def get_initials(self):
		if self.last_name:
			full_name = self.first_name[0].title() +" "+ self.last_name[0].title()
		else:
			full_name = self.first_name[0].title()
		return full_name

	def get_profile_image_url(self):
		if self.profile_image:
			image_url = "/site_media/"+str(self.profile_image.image)
		else:
			image_url = "/static/themes/img/default_profile_image.png"
		return image_url

	def get_api_profile_image_url(self):
		options = {'size': (144, 144), 'crop': True}
		if self.profile_image:
			try:
				image_url = get_thumbnailer(self.profile_image.image).get_thumbnail(options).url
			except:
				image_url = "/site_media/"+str(self.profile_image.image)
		else:
			image_url = "/static/themes/img/default_profile_image.png"
		return str(mysettings.SITE_URL)+image_url

class FriendRequest(models.Model):
	to_user = models.ForeignKey(GolfUser,related_name='to_user')
	from_user = models.ForeignKey(GolfUser,related_name='from_user')
	requested_on = models.DateTimeField(auto_now_add = True)
	status = models.CharField(max_length=10,default='P')#A=Accepted,R=Rejected,P=Pending

	def get_object_url(self):
		return mysettings.SITE_URL+'/api/directory/'+str(self.from_user.id)

	def get_submit_url(self):
		return mysettings.SITE_URL+'/api/directory/'+str(self.from_user.id)+'/respond-friend-request/'

class Notification(models.Model):
	user = models.ForeignKey(GolfUser,db_index=True,related_name="notified_user",null=True)
	created_by = models.ForeignKey(GolfUser,related_name="notified_by",null=True)
	created_on = models.DateTimeField(auto_now_add = True)
	
	notification_type = models.CharField(max_length=10,null=True)
	
	object_id = models.IntegerField(null=True)
	object_type = models.CharField(max_length=20,null=True)
	object_name = models.CharField(max_length=50,null=True)

	read = models.BooleanField(default=False)
	message = models.CharField(max_length=100,null=True)

class Messages(models.Model):
	message = models.TextField()
	created_on = models.DateTimeField(auto_now_add = True)
	created_by = models.ForeignKey(GolfUser,db_index=True)

class Conversation(models.Model):
	created_on = models.DateTimeField(auto_now_add = True)
	modified_on = models.DateTimeField(auto_now = True)
	participants = models.ManyToManyField(GolfUser,db_index=True)
	ctype = models.CharField(max_length=10,default='P',choices=CONVERSATION_TYPE)
	messages = models.ManyToManyField(Messages,db_index=True)
	name = models.CharField(max_length=100,null=True)

	def get_participants(self,user):
		from usermgmt.serializers import UserSerializer
		participants = self.participants.all().exclude(id = user.id)
		serializer = UserSerializer(participants,many=True)
		return serializer.data

	def get_ajax_participants(self,user):
		participants = self.participants.all().exclude(id = user.id)
		return participants
		
	def get_conversation_name(self,user):
		if self.ctype == 'G':
			name = self.name
		else:
			try:
				participant = self.participants.all().exclude(id = user.id)[0]
				name = participant.get_full_name()
			except:
				name = "no name"
		return name

	def get_first_message(self):
		try:
			if self.messages.all():
				message = self.messages.all().order_by('-id')[0]
				return message.message
		except:
			return "No message"

class ConversationStatus(models.Model):
	user = models.ForeignKey(GolfUser)
	status = models.CharField(max_length=10,default='A')
	conversation = models.ForeignKey(Conversation)
	modified_on = models.DateTimeField(auto_now = True)

class Invite(models.Model):
	token = models.CharField(max_length=20,unique=True)
	name = models.CharField(max_length=150,null=True)
	email = models.EmailField(null=True)
	accepted = models.BooleanField(default=False,blank=False)
	
	object_id = models.IntegerField(null=True)
	object_type = models.CharField(max_length=20,null=True)
	object_name = models.CharField(max_length=150,null=True)

	invited_by = models.ForeignKey(GolfUser,related_name="InviteUser",null=True)

class PasswordReset(models.Model):
	user = models.ForeignKey(GolfUser,related_name="reset_requests",null=True)
	otp = models.CharField(max_length=10,unique=True)
	created_on = models.DateTimeField(auto_now_add=True)

'''
class PasswordResetTicket(models.Model):
	user = models.ForeignKey(GolfUser,related_name="reset_requests",null=True)
	email_sent = models.BooleanField(default=False,blank=False)
	expiration = models.DateField(null = False)
	closed = models.BooleanField(default=False,blank=False)
'''
class UserLog(models.Model):
	user = models.ForeignKey(GolfUser,related_name="logs",null=True)
	date = models.DateField(null = False,auto_now = True,)
	success = models.BooleanField(default=False,blank=False)

class ScheduledEmails(models.Model):
	user = models.ForeignKey(GolfUser,related_name="email_user",null=True)
	message = models.TextField(null=True)
	subject = models.CharField(max_length=250,null=True)
	created_on = models.DateTimeField(auto_now_add=True)
	


