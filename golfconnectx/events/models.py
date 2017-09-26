import os
import uuid
from PIL import Image
from easy_thumbnails.files import get_thumbnailer

from django.conf import settings as mysettings 
from django.db import models
from datetime import datetime

from usermgmt.models import GolfUser
from posts.models import Post

def get_event_image_path(instance, filename):
	ext = filename.split('.')[-1]
	filename = "%s.%s" % (uuid.uuid4(), ext)
	return os.path.join('events/images', filename)

def get_event_file_path(instance, filename):
	ext = filename.split('.')[-1]
	filename = "%s.%s" % (uuid.uuid4(), ext)
	return os.path.join('events/files', filename)

class EventImages(models.Model):
	name = models.CharField(max_length=256,null=True)
	image = models.ImageField(upload_to=get_event_image_path,null=True,blank=True)
	width = models.IntegerField(default=0)
	height = models.IntegerField(default=0)

	def __unicode__(self):
		return '%s%s' %(str(self.id),self.name)

	def get_calendar_cover_image_url(self):
		options = {'size': (304, 100), 'crop': False}
		if self.image:
			thumbnail_url = mysettings.SITE_URL+get_thumbnailer(self.image).get_thumbnail(options).url
		else:
			thumbnail_url = mysettings.SITE_URL+"/static/themes/img/4th_july_crop.jpg"
		return thumbnail_url

	def get_image_url(self):
		return str(mysettings.SITE_URL)+'/site_media/'+str(self.image)

	def get_thumbnail_url(self):
		try:
			options = {'size': (725,103), 'crop': False}
			thumbnail_url = mysettings.SITE_URL+get_thumbnailer(self.image).get_thumbnail(options).url
		except:
			thumbnail_url = str(mysettings.SITE_URL)+'/site_media/'+str(self.image)
		return thumbnail_url


class EventFiles(models.Model):
	name = models.CharField(max_length=256,null=True)
	file = models.FileField(upload_to=get_event_file_path,null=True,blank=True)
	uploaded_on = models.DateTimeField(auto_now_add=True)
	uploaded_by = models.ForeignKey(GolfUser,null=True)

	def __unicode__(self):
		return '%s%s' %(str(self.id),self.name)

	def get_file_url(self):
		return mysettings.SITE_URL+'/site_media/'+str(self.file)

class EventCategory(models.Model):
	name = models.CharField(max_length=256)

	def __unicode__(self):
		return self.name

	def get_events_count(self):
		return Events.objects.filter(category=self).count()

class Events(models.Model):
	name = models.CharField(max_length=256,null=False)
	
	cover_image = models.ForeignKey(EventImages,null=True,related_name='event_cover_image',on_delete=models.SET_NULL)
	files = models.ManyToManyField(EventFiles)
	
	images = models.ManyToManyField(EventImages)
	
	start_date = models.DateField(null=False)
	end_date	= models.DateField(null=False)
	start_time = models.TimeField(max_length=25, null=True)
	end_time = models.TimeField(max_length=25, null=True)

	venue = models.CharField(max_length=256,null=False)
	address1 = models.CharField(max_length=50,null=False)
	address2 = models.CharField(max_length=50,null=True)
	state = models.CharField(max_length=10,null=True)
	city = models.CharField(max_length=50,null=False)
	zip_code = models.CharField(max_length=20,null=True)

	lat = models.FloatField(default=0.0)
	lon = models.FloatField(default=0.0)
	zoom = models.IntegerField(default=0)

	phone = models.CharField(max_length=20,null=True)
	email = models.EmailField(max_length=75,null=True)

	description = models.TextField()
	attendees = models.ManyToManyField(GolfUser,related_name='event_attendees')#People who are attending the event.
	event_timezone = models.CharField(max_length=100,null=True)
	
	repeat = models.BooleanField(null=False,default=False)
	frequency = models.IntegerField(default=0)	#No of occurrence
	measure = models.CharField(max_length=20,null=True) #(day/week/month)

	category = models.ForeignKey(EventCategory,null=True)

	created_by = models.ForeignKey(GolfUser,related_name='event_owner')
	modified_by = models.ForeignKey(GolfUser,related_name='event_modifier')

	created_on = models.DateTimeField(auto_now_add=True)
	modified_on = models.DateTimeField(auto_now=True)

	is_private = models.BooleanField(default=False)

	venue_course_id = models.IntegerField(null=True)

	event_group_id = models.IntegerField(null=True)
	
	posts = models.ManyToManyField(Post)

	attending = models.IntegerField(null=True)
	notattending = models.IntegerField(null=True)
	mayattend = models.IntegerField(null=True)
	
	def __unicode__(self):
		return self.name

	def get_absolute_url(self):
		return mysettings.SITE_URL+'/api/events/'+str(self.id)

	def get_api_crop_cover_image_url(self):
		options = {'size': (110, 110), 'crop': True}
		if self.cover_image:
			thumbnail_url = mysettings.SITE_URL+get_thumbnailer(self.cover_image.image).get_thumbnail(options).url
			return thumbnail_url
		else:
			thumbnail_url = mysettings.SITE_URL+"/static/themes/img/search/event.png"
			return thumbnail_url

	def get_cover_image_url(self):
		return "/site_media/"+str(self.cover_image.image)

	def get_attendee_stats(self):
		event_access = EventsAccess.objects.filter(event = self)

		attending = event_access.filter(attending='Y').count()
		notattending = event_access.filter(attending='N').count()
		maybe = EventRequestInvitation.objects.filter(event=self,type='I',accept='M').count()

		data = {
			'attending':attending + 1,
			'notattending':notattending,
			'maybe':maybe,
		}
		return data

	def get_selected_group_details(self):
		from groups.models import Groups
		if self.event_group_id:
			group = Groups.objects.get(id = self.event_group_id)
			data = {
				"id":group.id,
				"name":group.name,
				"image_url":group.get_api_crop_cover_image_url()
			}
		else:
			data = None
		return data

class EventsAccess(models.Model):
	event = models.ForeignKey(Events)
	user = models.ForeignKey(GolfUser)
	access = models.BooleanField(default=False)
	attending = models.CharField(max_length=10,default='Y')#Y=Yes,N=No,M=Maybe

	def get_object_url(self):
		return mysettings.SITE_URL+'/api/events/'+str(self.event.id)

class EventRequestInvitation(models.Model):
	event = models.ForeignKey(Events)
	created_by = models.ForeignKey(GolfUser,related_name='invitation_creator')
	to = models.ForeignKey(GolfUser)
	date = models.DateTimeField(auto_now_add=True)
	accept = models.CharField(max_length=10,default='M')#Y=Yes,N=No,M=Responding
	type = models.CharField(max_length=10,default='R')#I=Invitation,R=Request

	def get_submit_url(self):
		return mysettings.SITE_URL+'/api/events/'+str(self.event.id)+'/grant-access/'+str(self.created_by.id)+'/'

	def get_accept_url(self):
		return mysettings.SITE_URL+'/api/events/'+str(self.event.id)+'/accept-invite/'
		
	def get_object_url(self):
		return mysettings.SITE_URL+'/api/events/'+str(self.event.id)

	