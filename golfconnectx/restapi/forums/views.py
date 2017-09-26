import json
from datetime import datetime

from django.shortcuts import render
from django.core import serializers
from django.views.generic import View
from django.http import HttpResponse, Http404
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from forums.models import Topics, ForumCategory, ForumConversation, ForumCommments
from courses.models import Courses

from forums.serializers import TopicSerializer, CategorySerializer, AddNewConversationSerializer, \
ForumConversationSerializer, CommentSerializer, NewCommentSerializer
from courses.serializers import CourseListSerializer

class ForumsHome(APIView):
    """
    List all posts, or create a new course.
    """
    def get(self, request, format=None):
        topics = Topics.objects.all().order_by('id')
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data)

forums_home = ForumsHome.as_view()

class ForumDetails(APIView):

	def get_object(self, slug):
		try:
			return Topics.objects.get(slug=slug)
		except Topics.DoesNotExist:
			raise Http404

	def get(self, request, slug, format=None):
		topic = self.get_object(slug)
		categories = ForumCategory.objects.filter(topic=topic)
		serializer = CategorySerializer(categories, many=True)
		return Response(serializer.data)

forum_detail = ForumDetails.as_view()

class AddNewCategory(APIView):
	serializer_class = CategorySerializer

	def get_object(self, slug):
		try:
			return Topics.objects.get(slug=slug)
		except Topics.DoesNotExist:
			raise Http404

	def post(self, request, slug, format=None):
		topic = self.get_object(slug)

		serializer = CategorySerializer(data=request.data)
		if serializer.is_valid():
			name = request.data['name']
			category = ForumCategory(
					name = name,
					topic = topic,
				)
			category.save()
			serializer = CategorySerializer(category)
			return Response(serializer.data, status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

forum_add_category = AddNewCategory.as_view()

class ForumSearchCategory(APIView):

	def get_object(self, slug):
		try:
			return Topics.objects.get(slug=slug)
		except Topics.DoesNotExist:
			raise Http404

	def get(self, request, slug, format=None):
		topic = self.get_object(slug)
		keyword = self.request.GET.get('kw')

		categories = ForumCategory.objects.filter(name__icontains=keyword,topic=topic)
		serializer = CategorySerializer(categories,many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)

forum_search_category = ForumSearchCategory.as_view()

class CategoryDetails(APIView):
	serializer_class = AddNewConversationSerializer

	def get_object(self, slug, cid):
		try:
			return ForumCategory.objects.get(pk=cid)
		except ForumCategory.DoesNotExist:
			raise Http404

	def get(self, request, slug, cid, format=None):
		category = self.get_object(slug,cid)
		serializer = CategorySerializer(category)

		return Response(serializer.data)

forum_category_details = CategoryDetails.as_view()


class ListCategoryConversations(APIView):
	serializer_class = AddNewConversationSerializer

	def get_object(self, slug, cid):
		try:
			return ForumCategory.objects.get(pk=cid)
		except ForumCategory.DoesNotExist:
			raise Http404

	def get(self, request, slug, cid, format=None):
		category = self.get_object(slug,cid)

		conversations = ForumConversation.objects.filter(category = category)
		serializer = ForumConversationSerializer(conversations, many=True)

		return Response(serializer.data)

	def post(self, request, slug, cid, format=None):
		category = self.get_object(slug,cid)
		serializer = AddNewConversationSerializer(data=request.data)

		if serializer.is_valid():

			subject = request.data['subject_line']

			con = ForumConversation()
			con.created_by = request.user
			con.subject_line = subject
			con.category = category
			con.save()
			serializer = ForumConversationSerializer(con)
			
			return Response(serializer.data, status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

forum_list_category_conversations = ListCategoryConversations.as_view()

class SearchCategoryConversations(APIView):

	def get_object(self, slug, cid):
		try:
			return ForumCategory.objects.get(pk=cid)
		except ForumCategory.DoesNotExist:
			raise Http404

	def get(self, request, slug, cid, format=None):
		category = self.get_object(slug,cid)
		keyword = self.request.GET.get('kw')

		q =(Q(subject_line__icontains=keyword))

		conversations = ForumConversation.objects.filter(q,category = category)
		serializer = ForumConversationSerializer(conversations, many=True)

		return Response(serializer.data)

forum_search_category_conversations = SearchCategoryConversations.as_view()

class ConverationDetails(APIView):

	def get(self, request, slug, cid, id, format=None):
		conversation = ForumConversation.objects.get(id = id)
		serializer = ForumConversationSerializer(conversation)
		return Response(serializer.data)

	def delete(self, request, slug, cid, id, format=None):
		conversation = ForumConversation.objects.get(id = id)
		conversation.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

forum_category_conversation_details = ConverationDetails.as_view()

class AddNewCategoryComment(APIView):
	serializer_class = NewCommentSerializer

	def get(self, request, slug, cid, id, format=None):
		con = ForumConversation.objects.get(id = id)

		comments = con.comments.all()

		serializer = CommentSerializer(comments,many = True)
		return Response(serializer.data)

	def post(self, request, slug, cid, id, format=None):
		con = ForumConversation.objects.get(id = id)

		serializer = NewCommentSerializer(data=request.data)

		if serializer.is_valid():
			body = request.data['body']

			com = ForumCommments(
					body = body,
					created_by = request.user
				)
			com.save()

			con.comments.add(com)

			serializer = CommentSerializer(com)

			return Response(serializer.data, status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

forum_category_new_comment = AddNewCategoryComment.as_view()


class ConverationCommentDetails(APIView):

	def get(self, request, slug, cid, id, cmid,format=None):
		comment = ForumCommments.objects.get(id = cmid)
		serializer = CommentSerializer(comment)
		return Response(serializer.data)

	def delete(self, request, slug, cid, id, cmid, format=None):
		comment = ForumCommments.objects.get(id = cmid)
		comment.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

forum_category_comment_details = ConverationCommentDetails.as_view()
