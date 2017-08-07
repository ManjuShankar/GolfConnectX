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

from forums.models import Topics, ForumCategory
from courses.models import Courses

class ForumsView(LoginRequiredMixin,View):
	template_name = 'forums/forums.html'

	def get(self, request):
		data = {}
		topics = Topics.objects.all().order_by('id')
		data['topics'] = topics
		return render(request, self.template_name,data)

forums_list = ForumsView.as_view()

class ForumDetails(View):
	template_name = 'forums/forum_details.html'

	def get_object(self, slug):
		try:
			return Topics.objects.get(slug=slug)
		except Topics.DoesNotExist:
			raise Http404

	def get(self, request, slug, format=None):
		data = {}
		topic = self.get_object(slug)

		if topic.name == 'courses':
			courses = Courses.objects.extra(select={'Premium': "is_premium = True", 'Basic': "is_premium = False"})
			courses = courses.extra(order_by = ['Basic', 'Premium','name'])

			courses = courses[:100]
			data['courses'] = courses
		else:
			categories = ForumCategory.objects.all()
			data['categories'] = categories

		data['topic'] = topic
		return render(request, self.template_name,data)

forum_detail = ForumDetails.as_view()