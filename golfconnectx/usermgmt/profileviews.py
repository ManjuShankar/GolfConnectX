import json
from datetime import datetime

from django.shortcuts import render
from django.template import Template, RequestContext
from django.template.response import TemplateResponse
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.core.exceptions import ObjectDoesNotExist
from django.core import serializers
from django.views.generic import ListView, CreateView, UpdateView, View, DetailView
from django.db.models import Q
from django.template.loader import render_to_string

from common.mixins import LoginRequiredMixin
from usermgmt.models import GolfUser
from courses.models import Courses, CourseUserDetails
from groups.models import Groups
from posts.models import Post
from events.models import Events

class ProfileDetails(LoginRequiredMixin,View):
	template_name = 'usermgmt/profile/profile_details.html'

	def get(self, request):
		data = {}
		data['user'] = request.user

		return render(request, self.template_name,data)


profile_details =  ProfileDetails.as_view()

class ProfileCoursesView(LoginRequiredMixin,View):

	def get(self, request):
		data = {}
		cuds = CourseUserDetails.objects.filter(user=request.user,is_following=True).values_list('course')
		courses = Courses.objects.filter(id__in=cuds)
		sdata = {'courses': courses}

		data['html']=render_to_string('usermgmt/profile/ajax_profile_courses_list.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1
		if courses:
			course = courses[0]
			data['course_id'] = course.id

		return HttpResponse(json.dumps(data), content_type='application/x-json')

profile_courses = ProfileCoursesView.as_view()

class ProfileCourseDetails(LoginRequiredMixin,View):

	def get(self, request):
		try:
			data = {}
			id = int(request.GET.get('id'))
			course = Courses.objects.get(id = id)
			cud = course.get_user_details(request.user)

			sdata = {'course':course,'cud':cud}

			data['html']=render_to_string('usermgmt/profile/ajax_course_details.html',sdata,context_instance=RequestContext(request))
			data['status'] = 1
		except:
			from sys import exc_info
			data['error'] = str(exc_info())
			data['status'] = 0
		return HttpResponse(json.dumps(data), content_type='application/x-json')

profile_course_details = ProfileCourseDetails.as_view()

class ProfileGroupsView(LoginRequiredMixin,View):

	def get(self, request):
		data = {}

		q = (Q(created_by=self.request.user)|Q(members = self.request.user)|Q(admins = self.request.user))
		groups = Groups.objects.filter(q).order_by('name').distinct()

		groups_lists = [groups[x:x+7] for x in range(0, (groups.count()),7)]
		glen = range(len(groups_lists))

		sdata = {'groups_lists':groups_lists,'glen':glen}

		data['html']=render_to_string('usermgmt/profile/ajax_profile_groups_list.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1

		return HttpResponse(json.dumps(data), content_type='application/x-json')

profile_groups = ProfileGroupsView.as_view()

class ProfilePostsView(LoginRequiredMixin,View):

	def get(self, request):
		data = {}

		posts = Post.objects.filter(author = request.user).order_by('-created')
		sdata = {'posts': posts}

		data['html']=render_to_string('usermgmt/profile/ajax_profile_posts_list.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1

		return HttpResponse(json.dumps(data), content_type='application/x-json')

profile_posts = ProfilePostsView.as_view()

class ProfileFriendsView(LoginRequiredMixin,View):

	def get(self, request):
		data = {}

		friends = request.user.friends.all()
		sdata = {'friends': friends}

		data['html']=render_to_string('usermgmt/profile/ajax_profile_friends_list.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1

		return HttpResponse(json.dumps(data), content_type='application/x-json')

profile_friends = ProfileFriendsView.as_view()

class ProfileEventsView(LoginRequiredMixin,View):

	def get(self, request):
		data = {}
		today = datetime.today()

		events = Events.objects.filter(created_by=request.user,end_date__lt=today.date).order_by('start_date').distinct()
		sdata = {'events': events}

		data['html']=render_to_string('events/events_list.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1

		if events:
			event = events[0]
			data['event_id'] = event.id

		return HttpResponse(json.dumps(data), content_type='application/x-json')

profile_events = ProfileEventsView.as_view()
