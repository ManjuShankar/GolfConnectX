from django.db import models

# Create your models here.
from usermgmt.models import GolfUser
from courses.models import Courses

class Topics(models.Model):
	name =  models.CharField(max_length=100)
	slug = models.CharField(max_length=250,null=True)

	def __unicode__(self):
		return self.name

	def get_categories(self):
		categories = Category.objects.filter(topic = self)

class ForumCategory(models.Model):
	name = models.CharField(max_length=250)
	topic = models.ForeignKey(Topics,null=False)

	def __unicode__(self):
		return self.name

class ForumCommments(models.Model):
	body = models.TextField()
	
	created_on = models.DateTimeField(auto_now_add = True)
	created_by = models.ForeignKey(GolfUser)

class ForumConversation(models.Model):
	created_on = models.DateTimeField(auto_now_add = True)
	modified_on = models.DateTimeField(auto_now = True)

	subject_line = models.CharField(max_length=250)
	
	category = models.ForeignKey(ForumCategory,null=True)
	course = models.ForeignKey(Courses,null=True)

	comments = models.ManyToManyField(ForumCommments)
	created_by = models.ForeignKey(GolfUser,null=True)

	def __unicode__(self):
		return self.subject_line
		

