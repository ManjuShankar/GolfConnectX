import uuid
import os

from django.db import models

from usermgmt.models import GolfUser
from courses.models import Courses
from posts.models import Post
from events.models import Events
from django.conf import settings as mysettings 
from PIL import Image

from easy_thumbnails.files import get_thumbnailer

def get_group_image_path(instance, filename):
	ext = filename.split('.')[-1]
	filename = "%s.%s" % (uuid.uuid4(), ext)
	return os.path.join('groups/images', filename)

def get_group_file_path(instance, filename):
	ext = filename.split('.')[-1]
	filename = "%s.%s" % (uuid.uuid4(), ext)
	return os.path.join('groups/files', filename)

class GroupImages(models.Model):
	name = models.CharField(max_length=256,null=True)
	image = models.ImageField(upload_to=get_group_image_path,null=True,blank=True)
	uploaded_on = models.DateTimeField(auto_now=True)
	uploaded_by = models.ForeignKey(GolfUser,null=True)
	width = models.IntegerField(default=0)
	height = models.IntegerField(default=0)

	def __unicode__(self):
		return '%s%s' %(str(self.id),self.name)
	'''
	def get_image_url(self):
		with Image.open(self.image) as img:
			width, height = img.size

		if width > 1020 or height > 250:
			options = {'size': (1020, 250), 'crop': True}
			thumbnail_url = get_thumbnailer(self.image).get_thumbnail(options).url
		else:
			thumbnail_url = "/site_media/"+str(self.image)

		data={
			'image_url':str(mysettings.SITE_URL)+thumbnail_url,
			'height':height,
			'width':width
		}
		return data
	'''
	def get_image_url(self):
		return str(mysettings.SITE_URL)+'/site_media/'+str(self.image)

	def get_ajax_image_url(self):
		return '/site_media/'+str(self.image)

	def get_cover_thumbnail_url(self):
		options = {'size': (1200,280), 'crop': False}
		try:
			thumbnail_url = mysettings.SITE_URL+get_thumbnailer(self.image).get_thumbnail(options).url
		except:
			thumbnail_url = str(mysettings.SITE_URL)+'/site_media/'+str(self.image)
		return thumbnail_url

	def get_thumbnail_url(self):
		options = {'size': (110,0), 'crop': False}
		try:
			thumbnail_url = mysettings.SITE_URL+get_thumbnailer(self.image).get_thumbnail(options).url
		except:
			thumbnail_url = str(mysettings.SITE_URL)+'/site_media/'+str(self.image)
		return thumbnail_url

class GroupFiles(models.Model):
	name = models.CharField(max_length=256,null=True)
	file = models.FileField(upload_to=get_group_file_path,null=True,blank=True)
	uploaded_on = models.DateTimeField(auto_now=True)
	uploaded_by = models.ForeignKey(GolfUser,null=True)

	def __unicode__(self):
		return '%s%s' %(str(self.id),self.name)

	def get_file_url(self):
		return mysettings.SITE_URL+'/site_media/'+str(self.file)


class Groups(models.Model):
	name = models.CharField(max_length=256,null=False)
	description = models.TextField()

	is_active = models.BooleanField(null=False,default=True)
	course = models.ForeignKey(Courses,related_name='home_course',null=True)

	cover_image = models.ForeignKey(GroupImages,null=True,related_name='group_cover_image',on_delete=models.SET_NULL)
	images = models.ManyToManyField(GroupImages)
	files = models.ManyToManyField(GroupFiles)

	created_by = models.ForeignKey(GolfUser,related_name='group_created_by')
	modified_by = models.ForeignKey(GolfUser,related_name='group_modified_by')

	created_on = models.DateTimeField(auto_now_add=True)
	modified_on = models.DateTimeField(auto_now=True)

	members = models.ManyToManyField(GolfUser,related_name='group_members')
	admins = models.ManyToManyField(GolfUser,related_name='group_admins')

	posts = models.ManyToManyField(Post)
	events = models.ManyToManyField(Events)

	is_private = models.BooleanField(default=False)

	def __unicode__(self):
		return self.name

	def get_members_count(self):
		return self.members.all().count()

	def get_posts_count(self):
		return self.posts.all().count()

	def get_admins_count(self):
		return self.admins.all().count()

	def get_api_cover_image_url(self):
		if self.cover_image:
			thumbnail_url = mysettings.SITE_URL+'/site_media/'+str(self.cover_image.image)
		else:
			thumbnail_url = mysettings.SITE_URL+'/static/themes/img/coverimg.png'
		return thumbnail_url

	def get_api_crop_cover_image_url(self):
		options = {'size': (110, 110), 'crop': True}
		if self.cover_image:
			thumbnail_url = mysettings.SITE_URL+get_thumbnailer(self.cover_image.image).get_thumbnail(options).url
			#thumbnail_url = mysettings.SITE_URL+'/site_media/'+str(self.cover_image.image)
		else:
			thumbnail_url = mysettings.SITE_URL+'/static/themes/img/golf_group_profile.png'
		return thumbnail_url

	def get_search_crop_cover_image_url(self):
		options = {'size': (110, 110), 'crop': True}
		if self.cover_image:
			thumbnail_url = mysettings.SITE_URL+get_thumbnailer(self.cover_image.image).get_thumbnail(options).url
		else:
			thumbnail_url = mysettings.SITE_URL+'/static/themes/img/search/group.png'
		return thumbnail_url

	def get_cover_image_url(self):
		options = {'size': (110, 110), 'crop': True}
		if self.cover_image:
			thumbnail_url = get_thumbnailer(self.cover_image.image).get_thumbnail(options).url
			#thumbnail_url = '/site_media/'+str(self.cover_image.image)
		else:
			thumbnail_url = '/static/themes/img/golf_group_profile.png'
		return thumbnail_url

	def is_group_admin(self,user):
		if user in self.admins.all():
			return True
		else:
			return False


class GroupsAccess(models.Model):
	group = models.ForeignKey(Groups)
	user = models.ForeignKey(GolfUser)
	access = models.BooleanField(default=False)
	attending = models.CharField(max_length=10,default='M')#Y=Yes,N=No,M=Maybe

class GroupsRequestInvitation(models.Model):
	group = models.ForeignKey(Groups)
	created_by = models.ForeignKey(GolfUser,related_name='group_invitation_creator')
	to = models.ForeignKey(GolfUser)
	date = models.DateTimeField(auto_now_add=True)
	accept = models.CharField(max_length=10,default='M')#Y=Yes,N=No,M=Responding
	type = models.CharField(max_length=10,default='M')#I=Invitation,R=Request

	def get_submit_url(self):
		return mysettings.SITE_URL+'/api/groups/'+str(self.group.id)+'/grant-membership/'+str(self.created_by.id)+'/'

	def get_accept_url(self):
		return mysettings.SITE_URL+'/api/groups/'+str(self.group.id)+'/accept-invite/'

	def get_object_url(self):
		return mysettings.SITE_URL+'/api/groups/'+str(self.group.id)



