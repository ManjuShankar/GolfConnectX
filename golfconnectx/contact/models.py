#models.py

from django.db import models

from usermgmt.models import GolfUser
# Create your models here.

class Contact(models.Model):
	name = models.CharField(max_length=100,null=False)

	message = models.TextField()

	phone = models.CharField(max_length=20,null=True)
	email = models.EmailField(max_length=75,null=True)
	created = models.DateTimeField(auto_now_add = True)
	
	def __unicode__(self):
		return self.name
