from rest_framework import serializers
from django.utils.translation import ugettext_lazy as _

from forums.models import Topics, ForumCategory, ForumConversation, ForumCommments

class TopicSerializer(serializers.ModelSerializer):

	class Meta:
		model = Topics
		fields = ('id','name','slug')

class CategorySerializer(serializers.ModelSerializer):

	class Meta:
		model = ForumCategory
		fields = ('id','name')

class NewCommentSerializer(serializers.ModelSerializer):

	class Meta:
		model = ForumCommments
		fields = ('id','body')
		
class CommentSerializer(serializers.ModelSerializer):
	created_on = serializers.DateTimeField('%I:%M%p %b %d, %Y')
	created_by = serializers.StringRelatedField()

	class Meta:
		model = ForumCommments
		fields = ('id','body','created_by','created_on')

class AddNewConversationSerializer(serializers.ModelSerializer):

	class Meta:
		model = ForumConversation
		fields = ('id','subject_line')

class ForumConversationSerializer(serializers.ModelSerializer):
	comments = CommentSerializer(many = True)
	created_on = serializers.DateTimeField('%I:%M%p %b %d, %Y')
	created_by = serializers.StringRelatedField()

	class Meta:
		model = ForumConversation
		fields = ('id','subject_line','created_by','created_on','comments')
