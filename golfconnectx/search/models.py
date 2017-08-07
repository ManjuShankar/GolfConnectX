from django.db import models

# Create your models here.
class SearchIndex(models.Model):
	title =  models.CharField(max_length=250)
	#description = models.CharField(max_length=250)
	object_id = models.IntegerField(null=True)
	object_url = models.CharField(max_length=250,null=True)
	object_type = models.CharField(max_length=100,null=True)
	object_image_url = models.CharField(max_length=250,null=True)

	content = models.TextField(null=True)
	private = models.BooleanField(default = False)

	def __unicode__(self):
		return self.title
