import json
from datetime import datetime
from sys import exc_info

from django.contrib.auth.decorators import login_required
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

from events.models import Events, EventsAccess, EventImages, EventFiles
from events.forms import EventAddForm
from common.mixins import LoginRequiredMixin
from courses.models import Courses
from groups.models import Groups

class EventsList(LoginRequiredMixin,View):
	template_name = 'events/eventsHome.html'

	def get(self, request):
		data = {}

		return render(request, self.template_name,data)

event_list = EventsList.as_view()

class UpcomingEvents(LoginRequiredMixin,View):

	def get(self, request):
		try:
			data = {}
			today = datetime.today()

			event_access = EventsAccess.objects.filter(user = request.user).values_list('event', flat=True)

			q = (Q(created_by=request.user)|Q(id__in = event_access))
			events = Events.objects.filter(q,end_date__gte=today.date).order_by('start_date').distinct()

			sdata = {'events':events}

			data['html']=render_to_string('events/events_list.html',sdata,context_instance=RequestContext(request))
			data['status'] = 1

			if events:
				event = events[0]
				data['event_id'] = event.id
		except:
			data['error'] = str(exc_info())
			data['status'] = 0
		return HttpResponse(json.dumps(data), content_type='application/x-json')

upcoming_events = UpcomingEvents.as_view()

class PastEvents(LoginRequiredMixin,View):

	def get(self, request):
		try:
			data = {}
			today = datetime.today()

			event_access = EventsAccess.objects.filter(user = request.user).values_list('event', flat=True)

			q = (Q(created_by=request.user)|Q(id__in = event_access))
			events = Events.objects.filter(q,end_date__lt=today.date).order_by('start_date').distinct()

			sdata = {'events':events}

			data['html']=render_to_string('events/events_list.html',sdata,context_instance=RequestContext(request))
			data['status'] = 1

			if events:
				event = events[0]
				data['event_id'] = event.id
		except:
			data['error'] = str(exc_info())
			data['status'] = 0
		return HttpResponse(json.dumps(data), content_type='application/x-json')

past_events = PastEvents.as_view()

class EventDetails(LoginRequiredMixin,View):

	def get(self, request):
		try:
			data = {}
			id = int(request.GET.get('id'))
			event = Events.objects.get(id = id)
			has_access = False

			sdata = {'event':event,'past':False}

			today = datetime.today()
			if event.end_date < today.date():
				sdata['past'] = True

			data['html']=render_to_string('events/event_details.html',sdata,context_instance=RequestContext(request))
			data['status'] = 1
		except:
			from sys import exc_info
			data['error'] = str(exc_info())
			data['status'] = 0
		return HttpResponse(json.dumps(data), content_type='application/x-json')

event_details = EventDetails.as_view()

class SaveEventView(LoginRequiredMixin,View):

	def get(self,request):
		data = {}
		sdata = {}

		eventid = request.GET.get('eventid')
		if eventid:
			event = Events.objects.get(id = int(eventid))
			sdata['event'] = event
			sdata['form'] = EventAddForm(instance=event)
		else:
			sdata['form'] = EventAddForm()

		q = (Q(created_by=request.user)|Q(members = request.user)|Q(admins = request.user))
		groups = Groups.objects.filter(q).order_by('name').distinct()

		sdata['groups'] = groups

		data['html']=render_to_string('events/event_form.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1
		return HttpResponse(json.dumps(data), content_type='application/x-json')

	def post(self,request):
		data = {}
		try:
			eventid = request.POST.get('eventid')
			if eventid:
				event = Events.objects.get(id = int(eventid))
				form  = EventAddForm(request.POST,instance=event)
				old_course = event.venue_course_id
				old_group = event.event_group_id
			else:
				form  = EventAddForm(request.POST)
				old_course = False
				old_group = False
				
			if form.is_valid():
				obj = form.save(commit=False)
				user = request.user

				obj.created_by = obj.modified_by = user
				
				obj.save()

				coverImageId = request.POST.get('cover_image')
				if coverImageId:
					cover_image = EventImages.objects.get(id = int(coverImageId))
					obj.cover_image = cover_image
					obj.save()

				try:
					fileId = request.POST.get('teetime_file')
					if fileId:
						tee_file = EventFiles.objects.get(id = int(fileId))
						if not tee_file in obj.files.all():
							obj.files.add(tee_file)
							obj.save()
				except:
					pass

				venue_course = request.POST.get('venue_course')
				if venue_course:
					course = Courses.objects.get(id = venue_course)
					course.events.add(obj)
					obj.venue_course_id = venue_course
					obj.save()

					if old_course and old_course != venue_course:
						course = Courses.objects.get(id = old_course)
						course.events.remove(obj)

				associateGroup = request.POST.get('associateGroup')
				if associateGroup:
					group_id = request.POST.get('group')
					group = Groups.objects.get(id = int(group_id))
					group.events.add(obj)
					obj.event_group_id = group_id
					obj.save()

					if old_group and old_group != group_id:
						group = Groups.objects.get(id = int(old_group))
						group.events.remove(obj)

				if not associateGroup and old_group:
					group = Groups.objects.get(id = int(old_group))
					group.events.remove(obj)
					obj.event_group_id = None
					obj.save()
				
				from restapi.search.views import IndexObject
				searchindex = IndexObject('event',obj.id)

				data['status'] = 1
				data['id'] = obj.id
				sdata = {'event':obj}

				data['html']=render_to_string('events/event_details.html',sdata,context_instance=RequestContext(request))
			else:
				data['status'] = 0
		except:
			from sys import exc_info
			print "+++++++++++",exc_info(),"+++++++++++++++"

		
		return HttpResponse(json.dumps(data), content_type='application/x-json')


save_event = SaveEventView.as_view()

from PIL import Image
from easy_thumbnails.files import get_thumbnailer

@login_required
def upload_event_cover_image(request):
	data = {}
	
	image = request.FILES['images']

	try:
		image_obj = EventImages()
		image_obj.name = image.name
		image_obj.image = image
		image_obj.save()

		with Image.open(image_obj.image) as img:
			width, height = img.size

		if width > 650 or height > 105:
			options = {'size': (650, 105), 'crop': True}
			thumbnail_url = get_thumbnailer(image_obj.image).get_thumbnail(options).url
		else:
			thumbnail_url = "/site_media/"+str(image_obj.image)

		data = {"url":thumbnail_url,"id":image_obj.id,"status":1,"height":height,"width":width}
	except:
		data['status'] = 0
	return HttpResponse(json.dumps(data), content_type='application/x-json')

@login_required
def upload_event_teetime_file(request):
	data = {}

	file = request.FILES['file']

	try:
		file_obj = EventFiles()
		file_obj.name = file.name
		file_obj.file = file
		file_obj.save()

		data = {"name":file_obj.name,"id":file_obj.id,"status":1}
	except:
		data['status'] = 0
	return HttpResponse(json.dumps(data), content_type='application/x-json')

@login_required
def delete_event_cover_image(request):
	
    data={}
    id = request.GET.get('image_id')
    image = EventImages.objects.get(id = int(id))
    image.delete()    
    data['status'] = 1
    return HttpResponse(json.dumps(data),content_type='application/x-json')
