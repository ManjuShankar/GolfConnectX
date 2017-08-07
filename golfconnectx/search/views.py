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

from search.models import SearchIndex
from common.mixins import LoginRequiredMixin

class SearchView(LoginRequiredMixin,View):
	template_name = 'search/search.html'

	def get(self, request):
		data = {}
		keyword = request.GET.get('kw')

		q =(Q(title__icontains=keyword)|Q(content__icontains=keyword))
		search_objects = SearchIndex.objects.filter(q).order_by('id')

		data['objects'] = search_objects
		return render(request,self.template_name,data)

search_view = SearchView.as_view()
