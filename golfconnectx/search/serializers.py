from rest_framework import serializers

from search.models import SearchIndex

class SearchResultSerializer(serializers.ModelSerializer):

	class Meta:
		model = SearchIndex
		fields = ('title','content','object_id','object_type','object_image_url')