from datetime import datetime

from django.conf import settings
from django.db import models
#from usermgmt.models import User

from . import consts

User = settings.AUTH_USER_MODEL

SMTP_AUTH_TYPES = (('TLS','TLS'),('SSL','SSL'),('None','None'))

class Campus(models.Model):
	name = models.CharField(max_length=150,unique=True)
	google_key = models.CharField(max_length=150,null=True)
	
	def __unicode__(self):
		return self.name

class BubbleTag(models.Model):

    name = models.CharField(max_length=64)
    bubble_count = models.IntegerField(default=0)
    post_count = models.IntegerField(default=0)
    view_count = models.IntegerField(default=0)

    def __unicode__(self):
        return self.name

class BubbleCategory(models.Model):
	name = models.CharField(max_length=150,unique=True)
	verified = models.BooleanField(default=False,blank=False)
	color = models.CharField(max_length=20,default='orange')
	membership = models.BooleanField(default=False,blank=False)

	def __unicode__(self):
		return self.name

	def get_bubble_count(self):
		from bubbles.models import Bubble
		return Bubble.objects.filter(category = self).count()

class File(models.Model):
	mode = models.IntegerField(default=consts.MODE_FILE)
	url = models.CharField(max_length=512)
	name = models.CharField(max_length=256,null=False)
	type = models.CharField(max_length=128,null=False)
	size = models.IntegerField(null=False)
	server = models.CharField(max_length=32)
	uploaded = models.DateField(auto_now_add = True)
	present = models.BooleanField(default=True,blank=False)
	aws_key = models.CharField(max_length=32)
	#user = models.ForeignKey('usermgmt.GolfUser')

	def __unicode__(self):
		return self.name


class SmtpConfigurations(models.Model):
    email_host = models.CharField(max_length = 100)  
    email_port = models.CharField(max_length = 100)  
    email_host_user = models.CharField(max_length = 100)  
    email_host_password = models.CharField(max_length = 120) 
    is_secure = models.BooleanField(default = True) 
    secure_type = models.CharField(max_length = 5, choices = SMTP_AUTH_TYPES) 
    default_from_mail = models.CharField(max_length = 100)
    created_by  =  models.ForeignKey(User)  

class SocialMedia(models.Model):
	name = models.CharField(max_length=128,null=False)
	is_enabled = models.BooleanField(null=False,default=True)

class Settings(models.Model):
	invite_expiration = models.IntegerField(default=1)
	invite_enabled = models.BooleanField(null=False,default=True)
	password_expiration = models.IntegerField(default=1)
	registration_enabled = models.BooleanField(null=False,default=True)

	email_mask = models.CharField(max_length=500)
	email_mask_text = models.CharField(max_length=500)
	delete_orphoned_text = models.IntegerField(default=1)
	is_deployed = models.BooleanField(null=False,default=False)
	is_public_deployment = models.BooleanField(null=False,default=False)

	brand_name = models.CharField(max_length=70)
	school_name = models.CharField(max_length=70)
	app_title = models.CharField(max_length=70)
	app_description = models.CharField(max_length=160)
	img_url = models.CharField(max_length=255,null=True)

	bubble_notification = models.IntegerField(default=1)
	timezone = models.CharField(max_length=100,null=True)

	update_feed_url = models.CharField(max_length=255,null=True)
	landing_header = models.CharField(max_length=250,null=True)
	landing_subtitle = models.CharField(max_length=250,null=True)

	onboard_usga = models.BooleanField(default=False)
	onboard_disclaimer = models.CharField(max_length=500,null=True)

	login_page_message = models.CharField(max_length=500,null=True)
	login_page_link = models.CharField(max_length=255,null=True)

	disable_secret_bubbles = models.BooleanField(default=False)
	login_input_text = models.CharField(max_length=250,null=True)
	login_instruction = models.TextField(null=True)
	enable_rewards = models.BooleanField(default=False)
	checkin_reward_points = models.IntegerField(default=0,null=True)

class Skills(models.Model):
	name = models.CharField(max_length=128,null=False)
	content_type = models.CharField(max_length=128,null=False)

	def __unicode__(self):
		return self.name


