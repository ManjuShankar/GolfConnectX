from rest_framework import serializers

from common.models import Skills

class ContentSerializer(serializers.ModelSerializer):

	class Meta:
		model = Skills
		fields = ('name',)