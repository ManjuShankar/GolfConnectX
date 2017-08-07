import uuid
import os

from django.db import models
from usermgmt.models import GolfUser
from common.models import File, BubbleTag
from django.conf import settings as mysettings
from easy_thumbnails.files import get_thumbnailer
# Create your models here.

def get_post_image_path(instance, filename):
	ext = filename.split('.')[-1]
	filename = "%s.%s" % (uuid.uuid4(), ext)
	return os.path.join('post/images', filename)

def get_post_file_path(instance, filename):
	ext = filename.split('.')[-1]
	filename = "%s.%s" % (uuid.uuid4(), ext)
	return os.path.join('post/files', filename)

class Videos(models.Model):
	video_url = models.CharField(max_length=1024,null=False)
	type = models.CharField(max_length=2,default='Y')

class PostFiles(models.Model):
	name = models.CharField(max_length=256,null=True)
	image = models.ImageField(upload_to=get_post_image_path,null=True,blank=True)
	file = models.FileField(upload_to=get_post_image_path,null=True,blank=True)
	file_type = models.CharField(max_length=10,default='I')#I=Image,F=File

	def get_image_url(self):
		return str(mysettings.SITE_URL)+'/site_media/'+str(self.image)

	def get_thumbnail_url(self):
		options = {'size': (110,0), 'crop': False}
		try:
			thumbnail_url = mysettings.SITE_URL+get_thumbnailer(self.image).get_thumbnail(options).url
		except:
			thumbnail_url = str(mysettings.SITE_URL)+'/site_media/'+str(self.image)
		return thumbnail_url

class PostComment(models.Model):
	author = models.ForeignKey(GolfUser,related_name='bubble_comment_author',null=True,on_delete=models.SET_NULL)
	
	body = models.TextField()
	
	likes_count = models.IntegerField(null=False,default=0)
	liked_users = models.ManyToManyField(GolfUser)
	images = models.ManyToManyField(PostFiles,blank=True,related_name='comment_images')

	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)

class Post(models.Model):
	title = models.CharField(max_length=256,null=False)
	body = models.TextField(null=True)

	author = models.ForeignKey(GolfUser,related_name='author_post')
	post_type = models.CharField(max_length=10,default='G')

	images = models.ManyToManyField(PostFiles,blank=True,related_name='post_images')
	files = models.ManyToManyField(PostFiles,blank=True,related_name='post_files')	
	
	tags = models.ManyToManyField(BubbleTag,blank=True)
	videos = models.ManyToManyField(Videos,blank=True)
	
	liked_users = models.ManyToManyField(GolfUser)

	view_count = models.IntegerField(default=0)
	comment_count = models.IntegerField(default=0)
	likes_count = models.IntegerField(default=0)

	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)

	post_edited = models.BooleanField(default=False)

	object_id = models.IntegerField(null=True)
	object_type = models.CharField(max_length=20,null=True)
	object_name = models.CharField(max_length=150,null=True)
	object_is_private = models.BooleanField(default=False)

	comments = models.ManyToManyField(PostComment,related_name='post_comments')
	
	def __unicode__(self):
		return self.title

