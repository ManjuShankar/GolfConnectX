import uuid
import os 
from django.db import models
from django.conf import settings as mysettings 
from easy_thumbnails.files import get_thumbnailer

from datetime import datetime

from usermgmt.models import GolfUser
from events.models import Events
from posts.models import Post
# Create your models here.

def get_course_image_path(instance, filename):
	ext = filename.split('.')[-1]
	filename = "%s.%s" % (uuid.uuid4(), ext)
	return os.path.join('course/images', filename)

class CourseCategory(models.Model):
	name = models.CharField(max_length=100)

	def __unicode__(self):
		return self.name

	def get_courses_count(self):
		return Courses.objects.filter(category = self).count()

class CourseImages(models.Model):
	name = models.CharField(max_length=256,null=True)
	image = models.ImageField(upload_to=get_course_image_path,null=True,blank=True)
	uploaded_on = models.DateTimeField(auto_now=True)
	uploaded_by = models.ForeignKey(GolfUser,null=True)
	width = models.IntegerField(default=0)
	height = models.IntegerField(default=0)

	def __unicode__(self):
		return '%s%s' %(str(self.id),self.name)

	def get_image_url(self):
		return str(mysettings.SITE_URL)+'/site_media/'+str(self.image)

	def get_thumbnail_url(self):
		options = {'size': (110,0), 'crop': False}
		try:
			thumbnail_url = mysettings.SITE_URL+get_thumbnailer(self.image).get_thumbnail(options).url
		except:
			thumbnail_url = str(mysettings.SITE_URL)+'/site_media/'+str(self.image)
		return thumbnail_url

class Courses(models.Model):
	name = models.CharField(db_index=True,max_length=300,null=False)

	address1 = models.CharField(max_length=250,null=False)
	address2 = models.CharField(max_length=100,null=True)
	city = models.CharField(max_length=50,null=False)
	zip_code = models.CharField(max_length=20,null=True)
	state = models.CharField(max_length=50,null=True)
	country = models.CharField(max_length=20,default='USA')
	
	lat = models.FloatField(default=0.0)
	lon = models.FloatField(default=0.0)
	zoom = models.IntegerField(default=0)

	phone = models.CharField(max_length=20,null=True)
	mobile = models.CharField(max_length=20,null=True)
	email = models.EmailField(max_length=75,null=True)

	description = models.TextField()

	is_premium = models.BooleanField(default=False)

	created_on = models.DateTimeField(auto_now_add = True)
	modified_on = models.DateTimeField(auto_now = True)

	created_by = models.ForeignKey(GolfUser,null=False)
	category = models.ForeignKey(CourseCategory,null=True)

	last_activity = models.DateTimeField(null=False,auto_now=True)

	view_count = models.IntegerField(null=False,default=0)

	followers = models.ManyToManyField(GolfUser,related_name='course_followers')
	
	posts = models.ManyToManyField(Post)
	events = models.ManyToManyField(Events)
	images = models.ManyToManyField(CourseImages)

	cover_image = models.ForeignKey(CourseImages,null=True,related_name='course_cover_image')

	admin = models.ForeignKey(GolfUser,null=True,related_name='course_admin',db_index=True)

	is_private = models.BooleanField(default=False)
	
	def __unicode__(self):
		return self.name

	def is_user_following(self):
		return False

	def get_user_details(self,user):

		try:
			cud = CourseUserDetails.objects.get(course=self,user=user)
		except:
			cud = CourseUserDetails()
			cud.course = self
			cud.user = user
			cud.save()

		return cud

	def get_posts(self):
		posts = self.posts.all()
		return posts

	def get_events(self):
		events = self.events.all()
		today = datetime.today()

		pevents = events.filter(end_date__lte=today.date).order_by('start_date')
		uevents = events.filter(end_date__gt=today.date).order_by('start_date')

		data = {
			'pevents':pevents,
			'uevents':uevents
		}
		return data

	def get_groups(self):
		from groups.models import Groups
		groups = Groups.objects.filter(course = self).order_by('name')
		return groups
	
	def get_cover_image(self):
		if self.cover_image:
			thumbnail_url = self.cover_image.get_image_url()
		else:
			thumbnail_url = str(mysettings.SITE_URL)+'/static/themes/img/golf-shadow-creek-03.png'
		return thumbnail_url
		
class CourseScores(models.Model):
	course = models.ForeignKey(Courses,null=False)
	user = models.ForeignKey(GolfUser,null=False)
	played_on = models.DateField(null=False)
	score = models.IntegerField(default=0)
	notes = models.TextField(null=True)

	images = models.ManyToManyField(CourseImages)

class CourseUserDetails(models.Model):
	course = models.ForeignKey(Courses,null=False)
	user = models.ForeignKey(GolfUser,null=False)
	is_premium = models.BooleanField(default=False)
	
	is_following = models.BooleanField(default=False)
	is_favorite = models.BooleanField(default=False)
	is_visited = models.BooleanField(default=False)
	is_played = models.BooleanField(default=False)

	latest_score = models.IntegerField(null=True)
	top_score = models.IntegerField(null=True)

	latest_score_date = models.DateField(null=True)
	top_score_date = models.DateField(null=True)
	
	notes = models.TextField(null=True)
	
	is_following_date = models.DateTimeField(null=True)
	
	distance = models.FloatField(default=0.0)

	images = models.ManyToManyField(CourseImages)