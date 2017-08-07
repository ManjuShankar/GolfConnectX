import json

from django.shortcuts import render
from django.template import Template
from django.template.response import TemplateResponse
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.core.exceptions import ObjectDoesNotExist
from django.views.generic import ListView, CreateView, UpdateView, View, DetailView
from django.db.models import Q

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from common.mixins import LoginRequiredMixin

class Home(LoginRequiredMixin,View):
	template_name = 'common/home.html'

	def get(self, request, *args, **kwargs):
		data = {}
		data['user'] = request.user
		return render(request,self.template_name,data)


site_home = Home.as_view()

@api_view(['GET'])
def api_root(request, format=None):
	return Response({
		'courses': reverse('courses_home', request=request, format=format),
		'events': reverse('events_home', request=request, format=format),
		'posts': reverse('posts_home', request=request, format=format),
		'profile': reverse('profile_details', request=request, format=format),
		'groups': reverse('groups_home', request=request, format=format),
		'messages': reverse('conversations', request=request, format=format),
		'notifications': reverse('notifications', request=request, format=format),
		'directory':reverse('user_profiles', request=request, format=format),

	})