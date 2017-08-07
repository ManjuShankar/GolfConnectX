import json
from datetime import datetime
from easy_thumbnails.files import get_thumbnailer

from django.shortcuts import render
from django.template import Template
from django.template.response import TemplateResponse
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.core.exceptions import ObjectDoesNotExist
from django.core import serializers
from django.views.generic import ListView, CreateView, UpdateView, View, DetailView
from django.db.models import Q

from rest_framework import status

from usermgmt.models import GolfUser
from courses.models import Courses, CourseScores, CourseUserDetails, CourseImages
from posts.models import Post
from groups.models import Groups
from events.models import Events

from usermgmt.serializers import UserSerializer, GolferSkillsSettingsSerializer
from courses.serializers import CourseListSerializer, CourseScoreSerializer, \
CourseUserDetailsSerializer, CourseSettingsSerializer, ProfileCourseListSerializer, \
ImageSerializer, ScoreImageSerializer
from posts.serializers import PostSerializer
from groups.serializers import GroupSerializer
from events.serializers import EventListSerializer

from courses.adminforms import CourseScoreForm

from rest_framework.views import APIView
from rest_framework.response import Response

class ProfileDetailView(APIView):
	model = GolfUser

	def get(self, request, *args, **kwargs):
		data = {}
		user = request.user
		serializer = UserSerializer(user)
		skillserializer = GolferSkillsSettingsSerializer(user)

		data = {
			'profile':serializer.data,
			'skills':skillserializer.data
		}
		return Response(data)

profile_details = ProfileDetailView.as_view()

class ProfileCoursesView(APIView):

	def get(self, request, *args, **kwargs):
		key = {}
		order = request.GET.get('order')

		if order == 'played':
			q = (Q(is_played=True))
		elif order == 'following':
			q = (Q(is_following=True))
		else:
			q = (Q(is_following=True)|Q(is_played=True))


		cuds = CourseUserDetails.objects.filter(q,user=request.user).values_list('course')
		courses = Courses.objects.filter(id__in=cuds).distinct()

		serializer = ProfileCourseListSerializer(courses, many=True,context={'request': request})

		return Response(serializer.data)

profile_courses = ProfileCoursesView.as_view()

class ProfilePostsView(APIView):

	def get(self, request, *args, **kwargs):
		posts = Post.objects.filter(author = request.user).order_by('-created')
		serializer = PostSerializer(posts, many=True, context={'request': request})

		return Response(serializer.data)

profile_posts = ProfilePostsView.as_view()

class ProfileGroupsView(APIView):

	def get(self, request, *args, **kwargs):
		groups = Groups.objects.filter(created_by = request.user).order_by('name')
		serializer = GroupSerializer(groups, many=True)

		serializedgroups = serializer.data

		if(groups.count() > 7):
			groups_list1 = serializedgroups[0:7]
			groups_lists = [serializedgroups[x:x+8] for x in range(7, (groups.count()),8)]
			groups_lists.insert(0,groups_list1)
		else:
			groups_lists = [serializedgroups[x:x+7] for x in range(0, (groups.count()),7)]

		return Response(groups_lists)

profile_groups = ProfileGroupsView.as_view()

class ProfileSearchGroupsView(APIView):

	def get(self, request, *args, **kwargs):
		keyword = request.GET['kw']

		#q =(Q(name__icontains=keyword)|Q(description__icontains=keyword))
		
		groups = Groups.objects.filter(name__icontains=keyword,created_by = request.user).order_by('name')
		
		serializer = GroupSerializer(groups, many=True)

		serializedgroups = serializer.data

		if(groups.count() > 7):
			groups_list1 = serializedgroups[0:7]
			groups_lists = [serializedgroups[x:x+8] for x in range(7, (groups.count()),8)]
			groups_lists.insert(0,groups_list1)
		else:
			groups_lists = [serializedgroups[x:x+7] for x in range(0, (groups.count()),7)]

		return Response(groups_lists)

profile_search_groups = ProfileSearchGroupsView.as_view()

class ProfileFriendsView(APIView):

	def get(self, request, *args, **kwargs):
		friends = request.user.friends.all()
		friends = GolfUser.objects.filter(id__in = friends).order_by('first_name')
		serializer = UserSerializer(friends, many=True)

		return Response(serializer.data)

profile_friends = ProfileFriendsView.as_view()

class ProfileSearchFriendsView(APIView):

	def get(self, request, *args, **kwargs):
		keyword = request.GET['kw']

		q =(Q(first_name__icontains=keyword)|Q(last_name__icontains=keyword)|Q(email__icontains=keyword))
		
		friends = request.user.friends.filter(q)
		friends = GolfUser.objects.filter(id__in = friends).order_by('first_name')
		
		serializer = UserSerializer(friends, many=True)

		return Response(serializer.data)

profile_search_friends = ProfileSearchFriendsView.as_view()

class ProfileEventsView(APIView):

	def get(self, request, *args, **kwargs):
		today = datetime.today()
		events = Events.objects.filter(created_by = request.user,end_date__gte=today.date).order_by('start_date')
		serializer = EventListSerializer(events, many=True)

		return Response(serializer.data)

profile_events = ProfileEventsView.as_view()

class ProfileCourseScoreView(APIView):
	serializer_class = CourseScoreSerializer

	def get(self, request, pk,*args, **kwargs):
		course = Courses.objects.get(id = pk)
		scores = CourseScores.objects.filter(user = request.user,course=course).order_by('-id')
		serializer = CourseScoreSerializer(scores, many=True)

		return Response(serializer.data)

	def post(self, request, pk, format=None):
		data = {}
		course = Courses.objects.get(id = pk)
		cform = CourseScoreForm(request.data)

		if cform.is_valid():
			cs = cform.save(commit=False)
			cs.user = request.user
			cs.course = course
			cs.save()

			cud = CourseUserDetails.objects.get(course=course,user=request.user)

			cud.is_played = True
			cud.latest_score = cs.score
			cud.latest_score_date = cs.played_on
			cud.save()

			if cs.score < cud.top_score or cud.top_score == None:
				cud.top_score = cs.score
				cud.top_score_date = cs.played_on
				cud.save()

			serializer = CourseUserDetailsSerializer(cud)

			return Response(serializer.data, status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

profile_course_scores = ProfileCourseScoreView.as_view()

class ProfileCourseScoreDetailsView(APIView):
	serializer_class = CourseScoreSerializer

	def get(self, request, pk, cid, *args, **kwargs):

		score = CourseScores.objects.get(id = cid)
		serializer = CourseScoreSerializer(score)

		return Response(serializer.data)

	def post(self, request, pk, cid, *args, **kwargs):
		score = CourseScores.objects.get(id = cid)
		notes = request.data.get('notes')

		score.notes = notes
		score.save()

		serializer = CourseScoreSerializer(score)

		return Response(serializer.data)

	def delete(self, request, pk, cid, *args, **kwargs):
		score = CourseScores.objects.get(id = cid)
		score.delete()
		
		return Response(status=status.HTTP_204_NO_CONTENT)

profile_course_scores_details = ProfileCourseScoreDetailsView.as_view()


class ProfileCourseSettingsView(APIView):
	serializer_class = CourseSettingsSerializer

	def get(self, request, pk,*args, **kwargs):
		course = Courses.objects.get(id = pk)

		cud = CourseUserDetails.objects.get(course=course,user=request.user)

		serializer = CourseUserDetailsSerializer(cud)

		return Response(serializer.data)

	def put(self, request, pk, *args, **kwargs):
		course = Courses.objects.get(id = pk)
		cud = CourseUserDetails.objects.get(course=course,user=request.user)

		serializer = CourseSettingsSerializer(cud, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data,status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

profile_course_settings = ProfileCourseSettingsView.as_view()


'''
class ProfileCourseScoreGallery(APIView):

	def get(self, request,pk, format=None):
		course = Courses.objects.get(id = pk)

		cud = CourseUserDetails.objects.get(course=course,user=request.user)

		serializer = CourseUserDetailsSerializer(cud)

		images = cud.images.all().order_by('-id')
		serializer = ScoreImageSerializer(images, many=True)

		return Response(serializer.data)

	def post(self,request,pk, format=None):
		data = {}
		course = Courses.objects.get(id = pk)
		cud = CourseUserDetails.objects.get(course=course,user=request.user)
		try:
			images = request.data.getlist('images')
			for image in images:
				image_obj = CourseImages(
					name=image.name,
					image=image,
					uploaded_by=request.user
				)
				image_obj.save()
				cud.images.add(image_obj)

			images = cud.images.all().order_by('-id')
			serializer = ScoreImageSerializer(images, many=True)
			#thumbnail_url = get_thumbnailer(image_obj.image).get_thumbnail(options).url
			
			return Response(serializer.data,status=status.HTTP_200_OK)
		except:
			data['status'] = 0
			return Response(json.dumps(data), status=status.HTTP_400_BAD_REQUEST)
'''
class ProfileCourseScoreGallery(APIView):

	def get_object(self, cid):
		try:
			return CourseScores.objects.get(id = cid)
		except CourseScores.DoesNotExist:
			raise Http404

	def get(self, request,pk,cid, format=None):
		cs = self.get_object(cid)

		images = cs.images.all().order_by('-id')
		serializer = ScoreImageSerializer(images, many=True)

		return Response(serializer.data)

	def post(self,request,pk,cid, format=None):
		data = {}
		cs = self.get_object(cid)
		try:
			images = request.data.getlist('images')
			for image in images:
				image_obj = CourseImages(
					name=image.name,
					image=image,
					uploaded_by=request.user
				)
				image_obj.save()
				cs.images.add(image_obj)

			images = cs.images.all().order_by('-id')
			serializer = ScoreImageSerializer(images, many=True)
			#thumbnail_url = get_thumbnailer(image_obj.image).get_thumbnail(options).url
			
			return Response(serializer.data,status=status.HTTP_200_OK)
		except:
			data['status'] = 0
			return Response(json.dumps(data), status=status.HTTP_400_BAD_REQUEST)


profile_course_scores_gallery = ProfileCourseScoreGallery.as_view()

class CourseScoreImageDetails(APIView):
	
	def get(self,request,pk,cid, iid, format=None):
		cimage = CourseImages.objects.get(id=iid)
		serializer = ScoreImageSerializer(cimage)

		return Response(serializer.data,status=status.HTTP_200_OK)

	def delete(self,request,pk,cid, iid, format=None):
		cimage = CourseImages.objects.get(id=iid)
		cimage.delete()
		
		return Response(status=status.HTTP_204_NO_CONTENT)

profile_course_scores_image = CourseScoreImageDetails.as_view()