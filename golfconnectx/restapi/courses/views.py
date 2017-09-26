import json
import StringIO
from datetime import datetime
from PIL import Image
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
from django.conf import settings as mysettings
from django.core.files.uploadedfile import InMemoryUploadedFile

from courses.models import Courses, CourseUserDetails, CourseImages
from courses.serializers import CourseSerializer, CourseListSerializer, CourseUserDetailsSerializer, \
CourseMinSerializer, CourseEditSerializer, ImageSerializer
from events.serializers import EventSerializer, EventListSerializer
from events.models import Events
from posts.serializers import PostSerializer, PostAddSerializer
from posts.adminforms import PostForm
from usermgmt.serializers import UserSerializer
from usermgmt.models import GolfUser
from groups.models import Groups
from groups.serializers import GroupSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from restapi.search.views import IndexObject

from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import generics

PER_PAGE = 1

class OldCoursesHome(generics.ListAPIView):
	serializer_class = CourseListSerializer

	def get_queryset(self):
		courses = Courses.objects.extra(select={'Premium': "is_premium = True", 'Basic': "is_premium = False"})
		courses = courses.extra(order_by = ['Basic', 'Premium','name'])

		try:
			keyword = self.request.GET.get('kw')
			q =(Q(name__icontains=keyword)|Q(description__icontains=keyword)|Q(category__name__icontains=keyword))
			courses = courses.filter(q)
		except:
			pass

		return courses

old_courses_home= OldCoursesHome.as_view()

class CoursesHome(APIView):
	serializer_class = CourseMinSerializer

	def get(self,request):
		data = {}
		try:
			keyword = request.GET.get('kw')
			q =(Q(name__icontains=keyword)|Q(description__icontains=keyword)|Q(category__name__icontains=keyword))
			courses = Courses.objects.filter(q).order_by('name')
		except:
			courses = Courses.objects.all().order_by('name')

		serializer = CourseMinSerializer(courses, many=True)
			
		return Response(serializer.data)
		
courses_home = CoursesHome.as_view()


class CourseDetailView(APIView):
	#permission_classes = (IsAuthenticated,IsAdminUser)
	serializer_class = CourseSerializer
	def get_object(self, pk):
		try:
			return Courses.objects.get(pk=pk)
		except Courses.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		course = self.get_object(pk)
		serializer = CourseSerializer(course)
		user_details = course.get_user_details(request.user)
		cudserializer = CourseUserDetailsSerializer(user_details)
		data = {
			'course':serializer.data,
			'course_user_details':cudserializer.data,
		}
		return Response(data)

	def put(self, request, pk, format=None):
		course = self.get_object(pk)
		serializer = CourseSerializer(course, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk, format=None):
		course = self.get_object(pk)
		course.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

course_details = CourseDetailView.as_view()

class CourseEditView(APIView):
	serializer_class = CourseEditSerializer

	def get_object(self, pk):
		try:
			return Courses.objects.get(pk=pk)
		except Courses.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		course = self.get_object(pk)
		serializer = CourseEditSerializer(course)
		return Response(serializer.data)

	def post(self, request, pk, format=None):
		course = self.get_object(pk)
		serializer = CourseEditSerializer(course, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

course_edit = CourseEditView.as_view()

class UploadCourseCoverImage(APIView):

	def get_object(self, pk):
		try:
			return Courses.objects.get(pk=pk)
		except Courses.DoesNotExist:
			raise Http404

	def post(self,request,pk,format=None):
		data = {}
		course = self.get_object(pk)
		try:
			image = request.data['image']
			try:
				imageid = request.data['imageid']
				image_obj = CourseImages.objects.get(id = int(imageid))
			except:
				image_obj = CourseImages()
			
			image_obj.name = image.name
			image_obj.image = image
			image_obj.save()

			with Image.open(image_obj.image) as img:
				width, height = img.size
				image_obj.width,image_obj.height = width,height
				if width < 680 or height < 180:
					static_path = mysettings.STATICFILES_DIRS[0]
					bgimage = Image.open(static_path+"/img/bg-course-grey.png")
					bg_w, bg_h = bgimage.size
					offset = ((bg_w - width) / 2, (bg_h - height) / 2)
					bgimage.paste(img, offset)
					bgimage.save('out.png')

					tempfile = bgimage
					tempfile_io =StringIO.StringIO()
					tempfile.save(tempfile_io, format='PNG')

					image_file = InMemoryUploadedFile(tempfile_io, None, 'gimage.png','image/png',tempfile_io.len, None)
					image_obj.image = image_file
			
					image_obj.width,image_obj.height = bg_w,bg_h

			image_obj.save()

			course.cover_image = image_obj
			course.save()
			
			serializer = ImageSerializer(image_obj)
			return Response(serializer.data, status=status.HTTP_200_OK)
		except:
			from sys import exc_info
			data['exc_info'] = str(exc_info())
			data['status'] = 0
			return Response(json.dumps(data), status=status.HTTP_400_BAD_REQUEST)
	
upload_course_cover_image = UploadCourseCoverImage.as_view()

class CourseSearchView(generics.ListAPIView):
	serializer_class = CourseListSerializer

	def get_queryset(self):
		keyword = self.request.GET.get('kw')
		q =(Q(name__icontains=keyword)|Q(description__icontains=keyword)|Q(category__name__icontains=keyword))

		courses = Courses.objects.extra(select={'Premium': "is_premium = True", 'Basic': "is_premium = False"})
		courses = courses.extra(order_by = ['Basic', 'Premium','name'])
		courses = courses.filter(q)

		return courses

course_search = CourseSearchView.as_view()

class CourseAdminViews(APIView):
	serializer_class = CourseEditSerializer

	def get(self,request,*args,**kwargs):
		courses = Courses.objects.filter(admin = request.user).order_by('name')
		serializer = CourseEditSerializer(courses,many=True)

		return Response(serializer.data)

course_admin_courses = CourseAdminViews.as_view()

class CoursesEvents(APIView):

	def get_object(self, pk):
		try:
			return Courses.objects.get(pk=pk)
		except Courses.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		course = self.get_object(pk)
		today = datetime.today()

		events = course.events.all().order_by('start_date')

		pevents = events.filter(end_date__lte=today.date,is_private=False)
		uevents = events.filter(end_date__gt=today.date,is_private=False)

		pserializer = EventListSerializer(pevents, many=True)
		userializer = EventListSerializer(uevents, many=True)
		data = {
			'uevents':userializer.data,
			'pevents':pserializer.data,
		}

		return Response(data)

course_events = CoursesEvents.as_view()

class CoursesUpcomingEvents(APIView):

	def get(self, request, pk, format=None):
		course = Courses.objects.get(id = pk)
		today = datetime.today()
		events = course.events.filter(end_date__gte=today.date,is_private=False).order_by('start_date')
		serializer = EventListSerializer(events, many=True)
		return Response(serializer.data)

course_upcoming_events = CoursesUpcomingEvents.as_view()

class CoursesPastEvents(APIView):

	def get(self, request, pk, format=None):
		course = Courses.objects.get(id = pk)
		today = datetime.today()
		events = course.events.filter(end_date__lt=today.date,is_private=False).order_by('start_date')
		serializer = EventListSerializer(events, many=True)
		return Response(serializer.data)

course_past_events = CoursesPastEvents.as_view()

class CoursesGroups(APIView):

	def get(self, request, pk, format=None):
		data = {}
		course = Courses.objects.get(id = pk)
		groups = Groups.objects.filter(course = course)
		serializer = GroupSerializer(groups, many=True)
		return Response(serializer.data)

course_groups = CoursesGroups.as_view()

class FollowCourse(APIView):

	def get(self, request, *args, **kwargs):
		data = {}
		course = Courses.objects.get(id = int(self.kwargs['pk']))

		user = request.user

		cud = CourseUserDetails.objects.get(user=user,course=course)
		
		if cud.is_following == True:
			cud.is_following =False
			cud.is_following_date = None

			data['follow'] = True
			data['success'] = True
		else:
			cud.is_following =True
			cud.is_following_date = datetime.now()

			data['follow'] = False

		serializer = CourseUserDetailsSerializer(cud)

		cud.save()

		return Response(serializer.data,status=status.HTTP_200_OK)

follow_course = FollowCourse.as_view()

class CourseFollowers(APIView):

	def get_object(self, pk):
		try:
			return Courses.objects.get(pk=pk)
		except Courses.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		data = {}
		course = self.get_object(pk=pk)
		cuds = CourseUserDetails.objects.filter(course=course,is_following=True).values_list('user')

		followers = GolfUser.objects.filter(id__in=cuds)
		serializer = UserSerializer(followers,many=True)
		return Response(serializer.data)

course_followers = CourseFollowers.as_view()

class CoursePosts(APIView):
	serializer_class = PostAddSerializer
	
	def get(self, request, pk, format=None):
		course = Courses.objects.get(id = pk)
		posts = course.posts.all().order_by('id')
		serializer = PostSerializer(posts, many=True,context={'request': request})
		return Response(serializer.data)

	def post(self, request, pk, format=None):
		course = Courses.objects.get(id=pk)

		postform  = PostForm(request.data)
		if postform.is_valid():
			post = postform.save(commit=False)
			post.author = request.user
			post.object_id = course.id
			post.object_name = course.name
			post.object_type = 'Course'
			post.object_is_private = course.is_private
			post.save()

			try:
				image_ids = request.data['images']
				images = PostFiles.objects.filter(id__in=image_ids)
				for image in images:
					post.images.add(image)
			except:
				pass

			searchindex = IndexObject('post',post.id)

			course.posts.add(post)

			serializer = PostSerializer(post,context={'request': request})
			return Response(serializer.data,status=status.HTTP_201_CREATED)
		return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

course_posts = CoursePosts.as_view()

class CourseSearchPosts(APIView):
	def get(self, request, pk, format=None):
		course = Courses.objects.get(id = pk)
		keyword = self.request.GET.get('kw')
		q =(Q(title__icontains=keyword))

		posts = course.posts.filter(q).order_by('id')
		serializer = PostSerializer(posts, many=True,context={'request': request})
		return Response(serializer.data)

course_search_posts = CourseSearchPosts.as_view()

class AddCourseScore(APIView):
	serializer_class = CourseUserDetailsSerializer

	def get(self, request, pk, format=None):
		course = Courses.objects.get(id = pk)
		cud = course.get_user_details(request.user)
		serializer = CourseUserDetailsSerializer(cud)
		return Response(serializer.data)

	def post(self,request, pk, format=None):
		course = Courses.objects.get(id = pk)
		cud = course.get_user_details(request.user)
		serializer = CourseUserDetailsSerializer(cud,data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

add_course_score = AddCourseScore.as_view()


