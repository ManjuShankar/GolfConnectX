from django.utils import timezone
from haystack import indexes
from courses.models import Courses

class CourseIndex(indexes.SearchIndex, indexes.Indexable):

	text = indexes.CharField(document=True, use_template=True)
	title = indexes.CharField(model_attr='name', boost=9)
	order_date=indexes.DateTimeField(model_attr='created_on')
	description=indexes.CharField(model_attr='description',null=True)

	def get_model(self):
		return Courses

	def index_queryset(self, using=None):
		"""Used when the entire index for model is updated."""
		return self.get_model().objects.all()





