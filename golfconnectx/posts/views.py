import json
from datetime import datetime
from sys import exc_info

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
from courses.models import Courses,CourseUserDetails
from events.models import EventsAccess, Events
from groups.models import Groups
from posts.models import Post

from posts.adminforms import PostForm

class CreatePost(LoginRequiredMixin,View):

	def get(self, request):
		data = {}
		try:
			cuds = CourseUserDetails.objects.filter(user=request.user,is_following=True).values_list('course')
			courses = Courses.objects.filter(id__in=cuds).distinct().order_by('name')

			q = (Q(created_by=self.request.user)|Q(members = self.request.user)|Q(admins = self.request.user))
			groups = Groups.objects.filter(q).order_by('-id').distinct().order_by('name')

			today = datetime.today()
			event_access = EventsAccess.objects.filter(user = request.user).values_list('event', flat=True)
			q = (Q(created_by=request.user)|Q(id__in = event_access))
			events = Events.objects.filter(q,end_date__gte=today.date).order_by('name').distinct()

			sdata = {'courses':courses,'groups':groups,'events':events}

			data['html'] = render_to_string('posts/ajax_add_post.html',sdata,context_instance=RequestContext(request))
			data['status'] = 1
		except:
			data['error'] = str(exc_info())
			data['status'] = 0
		return HttpResponse(json.dumps(data), content_type='application/x-json')

	def post(self,request):
		data = {}
		try:
			post_form = PostForm(request.POST)
			post = post_form.save(commit=False)
			post.author = request.user
			post.save()

			parent_module = request.POST.get('post_parent_module')
			if parent_module == 'groups':
				groups_ids = request.POST.getlist('groups')
				groups = Groups.objects.filter(id__in = groups_ids)
				for group in groups:
					group.posts.add(post)
					group.save()
			elif parent_module == 'courses':
				course_ids = request.POST.getlist('courses')
				courses = Courses.objects.filter(id__in=course_ids)
				for course in courses:
					course.posts.add(post)
					course.save()
			elif parent_module == 'events':
				event_ids = request.POST.getlist('events')
				events = Events.objects.filter(id__in=event_ids)
				for event in events:
					event.posts.add(post)
					event.save()

			data['status'] = 1
		except:
			data['error'] = str(exc_info())
			data['status'] = 0
		return HttpResponse(json.dumps(data), content_type='application/x-json')


posts_create = CreatePost.as_view()

class FeedHomeView(LoginRequiredMixin,View):
	template_name = 'posts/feedHome.html'

	def get(self, request):
		data = {}
		posts = Post.objects.all().order_by('-created')
		data['posts'] = posts
		return render(request, self.template_name,data)

feeds_home = FeedHomeView.as_view()

class FeedSearchView(LoginRequiredMixin,View):
	template_name = 'posts/feedHome.html'

	def get(self, request):
		data = {}

		keyword = request.GET.get('keyword')
		q =(Q(title__icontains=keyword)|Q(body__icontains=keyword))
		posts = Post.objects.filter(q).order_by('-created')

		sdata = {'posts':posts}

		data['html'] = render_to_string('posts/ajax_feed_list.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1

		return HttpResponse(json.dumps(data), content_type='application/x-json')

search_posts = FeedSearchView.as_view()

class FeedLoadPosts(LoginRequiredMixin,View):

	def get(self, request):
		data = {}
		posts = Post.objects.all().order_by('-created')
		sdata = {'posts':posts}

		data['html'] = render_to_string('posts/ajax_feed_list.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1

		return HttpResponse(json.dumps(data), content_type='application/x-json')

load_posts = FeedLoadPosts.as_view()
