import json
import csv

from django.template import Template, RequestContext
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from django.template.loader import render_to_string
from django.core.mail import EmailMessage

from django.views.generic import ListView, CreateView, UpdateView, View
from django.conf import settings as my_settings

from events.models import Events, EventCategory, EventImages
from events.adminforms import EventForm, EventCategoryForm
from courses.models import Courses

class EventsCategoryListView(ListView):
	"""
    List the Campuses in the site.
    """
	template_name = 'admin/events/category_list.html'
	
	def get_queryset(self):
		return EventCategory.objects.all().order_by('id')

event_category_list_view = EventsCategoryListView.as_view()

class EventsCategoryAddView(CreateView):
	"""
	Adds a new campus to the site.
	"""
	model = EventCategory
	form_class = EventCategoryForm
	template_name = 'admin/events/category_form.html'

	def get_success_url(self):
		return reverse('event_categories_list')

	def form_valid(self, form):
		return super(EventsCategoryAddView, self).form_valid(form)

event_category_add_view = EventsCategoryAddView.as_view()

class EventsCategoryUpdateView(UpdateView):
	"""
	Updates the bubble category information on the site.
	"""
	model = EventCategory
	form_class = EventCategoryForm
	template_name = 'admin/events/category_form.html'

	def get_success_url(self):
		return reverse('event_categories_list')

event_category_edit_view = EventsCategoryUpdateView.as_view()

class EventsCategoryDeleteView(View):
	"""
	Delets the selected campus
	"""
	model = EventCategory

	def get_success_url(self):
		return reverse('event_categories_list')

	def get(self, request, *args, **kwargs):
		try:
			category = EventCategory.objects.get(id = kwargs['pk'])
			category.delete()
			return HttpResponseRedirect(self.get_success_url())
		except ObjectDoesNotExist:
			raise Http404

event_category_delete_view = EventsCategoryDeleteView.as_view()

class EventsListView(ListView):
	"""
    List the Events in the site.
    """
	template_name = 'admin/events/events_list.html'
	
	def get_queryset(self):
		return Events.objects.all()

events_list_view = EventsListView.as_view()

def upload_event_cover_image(request):
	data = {}
	
	image = request.FILES['images']

	try:
		image_obj = EventImages()
		image_obj.name = image.name
		image_obj.image = image
		image_obj.save()
		sdata = {'image':image_obj}

		data['html']=render_to_string('admin/events/include_event_cover_image.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1
	except:
		data['status'] = 0
	return HttpResponse(json.dumps(data))

def delete_event_cover_image(request):
	
    data={}
    id = request.GET.get('image_id')
    image = EventImages.objects.get(id = int(id))
    image.delete()    
    data['status'] = 1
    return HttpResponse(json.dumps(data),content_type='application/x-json')

class EventsAddView(CreateView):
	model = Events
	form_class = EventForm
	template_name = 'admin/events/events_form.html'

	def get_success_url(self):
		return reverse('events')

	def get_context_data(self, **kwargs):
		context = super(EventsAddView, self).get_context_data(**kwargs)
		context['categories'] = EventCategory.objects.all()
		return context

	def post(self,request):
		data = {}

		form  = EventForm(request.POST)
		
		if form.is_valid():
			obj = form.save(commit=False)
			user = request.user

			obj.created_by = obj.modified_by = user
			
			obj.save()

			venue_course = request.POST.get('venue_course')
			if venue_course:
				course = Courses.objects.get(id = venue_course)
				course.events.add(obj)
				obj.venue_course_id = venue_course
				obj.save()

			coverImageId = request.POST.get('cover_image')
			if coverImageId:
				cover_image = EventImages.objects.get(id = int(coverImageId))
				obj.cover_image = cover_image
				obj.save()

			return HttpResponseRedirect(self.get_success_url())

		return render(request, self.template_name, {'form': form})

events_add_view = EventsAddView.as_view()

class EventsUpdateView(UpdateView):
	model = Events
	form_class = EventForm
	template_name = 'admin/events/events_form.html'

	def get_success_url(self):
		return reverse('events')

	def get_context_data(self, **kwargs):
		context = super(EventsUpdateView, self).get_context_data(**kwargs)
		context['categories'] = EventCategory.objects.all()
		return context

	def post(self,request,pk):
		data = {}
		
		event = self.get_object()
		form  = EventForm(request.POST,instance=event)
		if form.is_valid():
			obj = form.save(commit=False)
			user = request.user

			obj.modified_by = user
			obj.save()

			venue_course = request.POST.get('venue_course')
			if venue_course:
				if obj.venue_course_id:
					course = Courses.objects.get(id = obj.venue_course_id)
					course.events.remove(obj)

				course = Courses.objects.get(id = venue_course)
				course.events.add(obj)
				obj.venue_course_id = venue_course
				obj.save()

			coverImageId = request.POST.get('cover_image')
			if coverImageId:
				cover_image = EventImages.objects.get(id = int(coverImageId))
				obj.cover_image = cover_image
				obj.save()

			return HttpResponseRedirect(self.get_success_url())

		return render(request, self.template_name, {'form': form})

events_update_view = EventsUpdateView.as_view()

class EventsDeleteView(View):
	model = Events

	def get_success_url(self):
		return reverse('events')

	def get(self, request, *args, **kwargs):
		try:
			event = Events.objects.get(id = kwargs['pk'])
			event.delete()
			return HttpResponseRedirect(self.get_success_url())
		except ObjectDoesNotExist:
			raise Http404

events_delete_view = EventsDeleteView.as_view()

class EventsLoadCoursesView(View):

	def get(self,request, *args, **kwargs):
		course_list = []
		courses = Courses.objects.all().order_by('name')
		for course in courses:
			coursedict = {'id':course.id,'label':course.name}
			course_list.append(coursedict)

		return HttpResponse(json.dumps(course_list), content_type='application/x-json')

events_load_courses_view = EventsLoadCoursesView.as_view()

class EventsLoadCourseDetailsView(View):

	def get(self, request, *args, **kwargs):
		data = {}
		try:
			id = request.GET.get('id')
			course = Courses.objects.get(id = id)

			data = {
				'address1':course.address1,
				'address2':course.address2,
				'city':course.city,
				'zip_code':course.zip_code,
				'state':course.state,
				'lat':course.lat,
				'lon':course.lon,
				'zoom':course.zoom,
				'id':course.id,
			}

			data['success'] = 1
		except:
			data['success'] = 0
		return HttpResponse(json.dumps(data), content_type='application/x-json')

events_load_course_details_view = EventsLoadCourseDetailsView.as_view()

class ImportEventsView(View):
	template_name = 'admin/events/import_events_csv.html'

	def get_success_url(self):
		return reverse('events')

	def get(self, request, *args, **kwargs):

		return render(request, self.template_name)

	def post(self, request, *args, **kwargs):

		csvfile = request.FILES['eventcsv']
		rows = csv.DictReader(csvfile.file)

		return HttpResponseRedirect(self.get_success_url())

import_events_view = ImportEventsView.as_view()

class SendEmailView(View):

	def get(self, request, *args, **kwargs):
		data = {}
		try:
			to_email=['sandeep.rao@avetoconsulting.com',]

			email_message = 'Welcome to golfconnectx'
			subject = 'Golfconnectx'
			email= EmailMessage(subject,email_message,my_settings.DEFAULT_FROM_EMAIL,to_email)
			email.content_subtype = "html"
			email.send()
		except:
			from sys import exc_info
			print "+++++++++++++++++",exc_info(),"++++++++++++++"
			pass
		return HttpResponse(json.dumps(data), content_type='application/x-json')

send_email_view = SendEmailView.as_view()