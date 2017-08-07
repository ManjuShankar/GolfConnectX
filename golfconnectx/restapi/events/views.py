import json
import datetime
from datetime import datetime, timedelta
from time import strptime
from PIL import Image
from random import choice
from easy_thumbnails.files import get_thumbnailer

from django.shortcuts import render
from django.template import Template, Context
from django.template.response import TemplateResponse
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.core.exceptions import ObjectDoesNotExist
from django.core import serializers
from django.views.generic import ListView, CreateView, UpdateView, View, DetailView
from django.db.models import Q
from django.conf import settings as mysettings 
from django.core.mail import EmailMessage
from django.template.loader import get_template

from events.models import Events, EventRequestInvitation, EventsAccess, EventImages, EventFiles
from events.serializers import EventSerializer, EventListSerializer, EventAddSerializer, \
EventInviteSerializer, EventAccessSerializer, EventImageSerializer, FileSerializer, \
CalendarEventSerializer
from events.adminforms import EventAddForm

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from groups.models import Groups
from courses.models import Courses
from usermgmt.serializers import UserSerializer
from usermgmt.permissions import OnlyAPIPermission
from usermgmt.models import GolfUser, Notification, Invite
from restapi.search.views import IndexObject
from restapi.usermgmt.views import SendMail

from posts.models import Post, PostFiles
from posts.serializers import PostSerializer, PostAddSerializer
from posts.adminforms import PostForm

rand = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'

US_STATES = [{'name': 'ALABAMA', 'value': 'AL'}, {'name': 'ALASKA', 'value': 'AK'}, {'name': 'ARIZONA ', 'value': 'AZ'}, {'name': 'ARKANSAS', 'value': 'AR'}, {'name': 'CALIFORNIA ', 'value': 'CA'}, {'name': 'COLORADO ', 'value': 'CO'}, {'name': 'CONNECTICUT', 'value': 'CT'}, {'name': 'DELAWARE', 'value': 'DE'}, {'name': 'FLORIDA', 'value': 'FL'}, {'name': 'GEORGIA', 'value': 'GA'}, {'name': 'HAWAII', 'value': 'HI'}, {'name': 'IDAHO', 'value': 'ID'}, {'name': 'ILLINOIS', 'value': 'IL'}, {'name': 'INDIANA', 'value': 'IN'}, {'name': 'IOWA', 'value': 'IA'}, {'name': 'KANSAS', 'value': 'KS'}, {'name': 'KENTUCKY', 'value': 'KY'}, {'name': 'LOUISIANA', 'value': 'LA'}, {'name': 'MAINE', 'value': 'ME'}, {'name': 'MARYLAND', 'value': 'MD'}, {'name': 'MASSACHUSETTS', 'value': 'MA'}, {'name': 'MICHIGAN', 'value': 'MI'}, {'name': 'MINNESOTA', 'value': 'MN'}, {'name': 'MISSISSIPPI', 'value': 'MS'}, {'name': 'MISSOURI', 'value': 'MO'}, {'name': 'MONTANA', 'value': 'MT'}, {'name': 'NEBRASKA', 'value': 'NE'}, {'name': 'NEVADA', 'value': 'NV'}, {'name': 'NEW HAMPSHIRE', 'value': 'NH'}, {'name': 'NEW JERSEY', 'value': 'NJ'}, {'name': 'NEW MEXICO', 'value': 'NM'}, {'name': 'NEW YORK', 'value': 'NY'}, {'name': 'NORTH CAROLINA', 'value': 'NC'}, {'name': 'NORTH DAKOTA', 'value': 'ND'}, {'name': 'OHIO', 'value': 'OH'}, {'name': 'OKLAHOMA', 'value': 'OK'}, {'name': 'OREGON', 'value': 'OR'}, {'name': 'PENNSYLVANIA', 'value': 'PA'}, {'name': 'RHODE ISLAND', 'value': 'RI'}, {'name': 'SOUTH CAROLINA', 'value': 'SC'}, {'name': 'SOUTH DAKOTA', 'value': 'SD'}, {'name': 'TENNESSEE', 'value': 'TN'}, {'name': 'TEXAS', 'value': 'TX'}, {'name': 'UTAH', 'value': 'UT'}, {'name': 'VERMONT', 'value': 'VT'}, {'name': 'VIRGINIA ', 'value': 'VA'}, {'name': 'WASHINGTON', 'value': 'WA'}, {'name': 'WEST VIRGINIA', 'value': 'WV'}, {'name': 'WISCONSIN', 'value': 'WI'}, {'name': 'WYOMING', 'value': 'WY'}]

'''
class EventsHome(View):

	def get(self, request, *args, **kwargs):
		data = {}

		events = serializers.serialize("json", list(Events.objects.all()),fields=('name','start_date','end_date'))

		return HttpResponse(events)

class EventDetailView(View):
	model = Events

	def get(self, request, *args, **kwargs):
		data = {}
		event = Events.objects.get(id = int(self.kwargs['pk']))
		data = serializers.serialize("json", [event,] )

		return HttpResponse(data)
'''
class EventsHome(APIView):
	permission_classes = (IsAuthenticated,)
	serializer_class = EventSerializer

	def get(self, request, format=None):
		today = datetime.today()

		event_access = EventsAccess.objects.filter(user = request.user).values_list('event', flat=True)

		q = (Q(created_by=request.user)|Q(id__in = event_access))
		events = Events.objects.filter(q,end_date__gte=today.date).order_by('start_date').distinct()
		serializer = EventListSerializer(events, many=True)

		return Response(serializer.data)

events_home = EventsHome.as_view()

class PublicEvents(APIView):
	permission_classes = (IsAuthenticated,)
	serializer_class = EventSerializer

	def get(self, request, format=None):
		today = datetime.today()

		event_access = EventsAccess.objects.filter(user = request.user).values_list('event', flat=True)

		q = (Q(created_by=request.user)|Q(id__in = event_access))

		events = Events.objects.filter(end_date__gte=today.date,is_private=False).exclude(q).order_by('start_date').distinct()
		serializer = EventListSerializer(events, many=True)

		return Response(serializer.data)

public_events = PublicEvents.as_view()

class PublicCalendarEventsView(APIView):

	def get(self, request, format=None):
		try:
			evdate = request.GET.get('date')
			evdate = datetime.strptime(evdate, '%m/%d/%Y')
		except:
			evdate = datetime.today()
			evdate = evdate.date()

		nextdate = evdate + timedelta(days=1)
		
		event_access = EventsAccess.objects.filter(user = request.user).values_list('event', flat=True)
		q = (Q(created_by=request.user)|Q(id__in = event_access))

		queryevents = Events.objects.filter(start_date__lte=evdate,end_date__gte=evdate).exclude(q)
		serializer = CalendarEventSerializer(queryevents, many=True)

		return Response(serializer.data)

public_calendar_events = PublicCalendarEventsView.as_view()

class PublicCalendarListEventsView(APIView):

	def get(self, request, format=None):
		from django.db.models import Count
		import calendar

		data = {}
		events_list = []
		try:
			month = int(request.GET['month'])
			year = int(request.GET['year'])
		except:
			today = datetime.today()
			year,month = today.year,today.month

		num_days = calendar.monthrange(year, month)[1]

		days = [datetime(year, month, day).date() for day in range(1, num_days+1)]

		event_access = EventsAccess.objects.filter(user = request.user).values_list('event', flat=True)
		q = (Q(created_by=request.user)|Q(id__in = event_access))

		for evdate in days:

			count = Events.objects.filter(start_date__lte=evdate,end_date__gte=evdate).exclude(q).count()
			if count > 0:
				events_list.append(evdate)
		
		return Response(events_list)

public_calendar_list_events = PublicCalendarListEventsView.as_view()

class EventsCreate(APIView):
	serializer_class = EventAddSerializer

	def get(self,request,format=None):
		data = {}
		states = json.dumps(US_STATES)
		data['states'] = json.loads(states)
		return Response(data)


	def post(self, request, format=None):
		form  = EventAddForm(request.data)
		if form.is_valid():

			obj = form.save(commit=False)
			user = request.user

			obj.created_by = obj.modified_by = user
			
			obj.save()

			try:
				coverImageId = request.data.get('cover_image')
				if coverImageId:
					cover_image = EventImages.objects.get(id = int(coverImageId))
					obj.cover_image = cover_image
					obj.save()
			except:
				pass

			try:
				fileId = request.data.get('teetime_file')
				if fileId:
					tee_file = EventFiles.objects.get(id = int(fileId))
					obj.files.add(tee_file)
					obj.save()
			except:
				pass

			try:
				groupId = request.data.get('group_id')
				if groupId:
					group = Groups.objects.get(id = int(groupId))
					group.events.add(obj)
					obj.event_group_id = group.id
					obj.save()
			except:
				pass

			is_course = request.data.get('is_course')
			if is_course:
				course_id = request.data.get('venue_course')
				course = Courses.objects.get(id = int(course_id))
				course.events.add(obj)
				obj.venue = course.name
				obj.venue_course_id = course.id
				obj.save()

			searchindex = IndexObject('event',obj.id)

			serializer = EventSerializer(obj,context={'request': request})
			return Response(serializer.data, status=status.HTTP_200_OK)
		
		print '+++++++++++++++',form.errors,"++++++++++++++++"
		errors = json.dumps(form.errors)
		return Response(errors, status=status.HTTP_400_BAD_REQUEST)
		
events_create = EventsCreate.as_view()

class EventDetailView(APIView):
	serializer_class = EventAddSerializer

	def get_object(self, pk):
		try:
			return Events.objects.get(pk=pk)
		except Events.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		data={}
		event = self.get_object(pk)
		serializer = EventSerializer(event,context={'request': request})
		return Response(serializer.data)

	def put(self, request, pk, format=None):
		event = self.get_object(pk)
		
		if event.venue_course_id:
			old_course = event.venue_course_id
		else:
			old_course = False
			
		form  = EventAddForm(request.data,instance=event)

		if form.is_valid():
			obj = form.save(commit=False)
			user = request.user

			obj.modified_by = user
			
			try:
				coverImageId = request.data.get('cover_image')
				if coverImageId:
					cover_image = EventImages.objects.get(id = int(coverImageId))
					obj.cover_image = cover_image
					obj.save()
			except:
				pass

			try:
				fileId = request.data.get('teetime_file')
				if fileId:
					tee_file = EventFiles.objects.get(id = int(fileId))
					if not tee_file in obj.files.all():
						obj.files.add(tee_file)
						obj.save()
			except:
				pass

			try:
				groupId = request.data.get('group_id')
				if groupId:
					group = Groups.objects.get(id = int(groupId))
					group.events.add(obj)
					obj.event_group_id = group.id
					obj.save()
			except:
				pass

			is_course = request.data.get('is_course')
			if is_course:
				course_id = request.data.get('venue_course')
				course = Courses.objects.get(id = int(course_id))
				course.events.add(obj)
				obj.venue = course.name
				obj.venue_course_id = course.id
				obj.save()

			else:
				obj.venue_course_id = None

			if old_course:
				course = Courses.objects.get(id = old_course)
				course.events.remove(obj)

			obj.save()
			searchindex = IndexObject('event',obj.id)

			event_access = EventsAccess.objects.filter(event = event,attending='Y').values_list('user', flat=True)
			q = (Q(id__in=event_access)|Q(id=event.created_by.id))
			users = GolfUser.objects.filter(q).distinct()

			subject = 'GolfConnectx Event - '+str(obj.name)
			message = 'Event details has been updated by '+str(request.user.first_name)
			for user in users:
				if user.notify_event_updates:
					notification = Notification(
							user = user,
							created_by = request.user,
							notification_type = 'EUN',
							object_id = event.id,
							object_type = 'Event Update',
							object_name = event.name,
							message = request.user.first_name+' updated the event '+event.name
						)
					notification.save()

			serializer = EventSerializer(obj,context={'request': request})
			return Response(serializer.data, status=status.HTTP_200_OK)

		data = {'errors':dict(form.errors.items())}
		errors = json.dumps(data)
		errors = json.loads(errors)

		return Response(errors, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk, format=None):
		event = self.get_object(pk)
		event.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)
		
event_details = EventDetailView.as_view()

class EventSearchView(APIView):

	def get(self, request, *args, **kwargs):
		data = {}
		
		keyword = request.GET.get('kw')
		
		if keyword:
			q =(Q(name__icontains=keyword)|Q(venue__icontains=keyword)|Q(description__icontains=keyword)|Q(category__name__icontains=keyword))
			queryevents = Events.objects.filter(q,is_private=False)
		
		evdate = request.GET.get('date')
		
		if evdate:
			evdate = request.GET.get('date')
			evdate = datetime.datetime.strptime(evdate, '%m/%d/%Y')
			queryevents = Events.objects.filter(start_date__lte=evdate,end_date__gte=evdate,is_private=False)

		serializer = EventListSerializer(queryevents, many=True)

		return Response(serializer.data)

events_search = EventSearchView.as_view()

class UpcomingEventsView(APIView):

    def get(self, request, format=None):
    	today = datetime.today()

    	event_access = EventsAccess.objects.filter(user = request.user).values_list('event', flat=True)

    	q = (Q(created_by=request.user)|Q(id__in = event_access))

        events = Events.objects.filter(q,end_date__gte=today.date).order_by('start_date').distinct()
        serializer = EventListSerializer(events, many=True)
        return Response(serializer.data)

upcoming_events = UpcomingEventsView.as_view()

class PastEventsView(APIView):

    def get(self, request, format=None):
    	today = datetime.today()
    	q = (Q(created_by=request.user)|Q(attendees = request.user))
        events = Events.objects.filter(q,end_date__lt=today.date).order_by('start_date')
        serializer = EventListSerializer(events, many=True)
        return Response(serializer.data)

past_events = PastEventsView.as_view()

class CalendarListEventsView(APIView):

	def get(self, request, format=None):
		from django.db.models import Count
		import calendar

		data = {}
		events_list = []
		try:
			month = int(request.GET['month'])
			year = int(request.GET['year'])
		except:
			today = datetime.today()
			year,month = today.year,today.month

		num_days = calendar.monthrange(year, month)[1]

		days = [datetime(year, month, day).date() for day in range(1, num_days+1)]

		event_access = EventsAccess.objects.filter(user = request.user).values_list('event', flat=True)
		q = (Q(created_by=request.user)|Q(id__in = event_access))

		for evdate in days:

			count = Events.objects.filter(q,start_date__lte=evdate,end_date__gte=evdate).count()
			if count > 0:
				events_list.append(evdate)
		
		return Response(events_list)

calendar_list_events = CalendarListEventsView.as_view()

class CalendarEventsView(APIView):

	def get(self, request, format=None):
		try:
			evdate = request.GET.get('date')
			evdate = datetime.strptime(evdate, '%m/%d/%Y')
		except:
			evdate = datetime.today()
			evdate = evdate.date()

		nextdate = evdate + timedelta(days=1)
		
		event_access = EventsAccess.objects.filter(user = request.user).values_list('event', flat=True)
		q = (Q(created_by=request.user)|Q(id__in = event_access))

		queryevents = Events.objects.filter(q,start_date__lte=evdate,end_date__gte=evdate)
		serializer = CalendarEventSerializer(queryevents, many=True)

		return Response(serializer.data)

calendar_events = CalendarEventsView.as_view()

class CalendarDoubleEventsView(APIView):

	def get(self, request, format=None):
		try:
			evdate = request.GET.get('date')
			evdate = datetime.strptime(evdate, '%m/%d/%Y')
		except:
			evdate = datetime.today()
			evdate = evdate.date()

		nextdate = evdate + timedelta(days=1)
		
		queryevents = Events.objects.filter(start_date__lte=evdate,end_date__gte=evdate,created_by=request.user)
		today_serializer = CalendarEventSerializer(queryevents, many=True)

		queryevents = Events.objects.filter(start_date__lte=nextdate,end_date__gte=nextdate,created_by=request.user)
		tom_serializer = CalendarEventSerializer(queryevents, many=True)

		data ={
			'first':today_serializer.data,
			'next':tom_serializer.data
		}
		return Response(data)

calendar_double_events = CalendarDoubleEventsView.as_view()

class UploadEventCoverImage(APIView):

	def post(self,request):
		data = {}
		
		try:
			image = request.data['image']
			try:
				imageid = request.data['imageid']
				image_obj = EventImages.objects.get(id = int(imageid))
			except:
				image_obj = EventImages()
			
			image_obj.name = image.name
			image_obj.image = image
			image_obj.save()

			with Image.open(image_obj.image) as img:
				width, height = img.size
			
			image_obj.width = width
			image_obj.height = height
			image_obj.save()

			serializer = EventImageSerializer(image_obj)
			
			return Response(serializer.data, status=status.HTTP_200_OK)
		except:
			from sys import exc_info
			data['exc_info'] = str(exc_info())
			data['status'] = 0
			return Response(json.dumps(data), status=status.HTTP_400_BAD_REQUEST)
	
upload_event_cover_image = UploadEventCoverImage.as_view()

class AddEventTeetimeFile(APIView):

	def post(self,request, format=None):
		data = {}
		try:
			file = request.data['file']
			
			file_obj = EventFiles()
			file_obj.name = file.name
			file_obj.file = file
			file_obj.save()
			
			serializer = FileSerializer(file_obj)
			return Response(serializer.data,status=status.HTTP_200_OK)
		except:
			from sys import exc_info
			data['status'] = 0
			return Response(json.dumps(data), status=status.HTTP_400_BAD_REQUEST)

upload_event_teetime_file = AddEventTeetimeFile.as_view()

class DeleteEventImage(APIView):

	def get(self,request,pk, format=None):
		data = {}
		try:
			eimage = EventImages.objects.get(id = pk)
			eimage.delete()
			data['status']=True
			res_status = status.HTTP_200_OK
		except:
			data['status']=False
			res_status = status.HTTP_400_BAD_REQUEST

		send_data = json.dumps(data)
		send_json = json.loads(send_data)

		return Response(send_data, status=res_status)

delete_event_image = DeleteEventImage.as_view()

class DeleteEventTeeTimeFile(APIView):

	def get(self,request,pk, format=None):
		data = {}
		try:
			efile = EventFiles.objects.get(id = pk)
			efile.delete()
			data['status']=True
			res_status = status.HTTP_200_OK
		except:
			data['status']=False
			res_status = status.HTTP_400_BAD_REQUEST

		send_data = json.dumps(data)
		send_json = json.loads(send_data)

		return Response(send_data, status=res_status)

delete_event_teetime_file = DeleteEventTeeTimeFile.as_view()

class AttendingEvent(APIView):

	def get_object(self, pk):
		try:
			return Events.objects.get(pk=pk)
		except Events.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		data = {}
		event = self.get_object(pk)
		user = request.user
		try:
			event_access = EventsAccess.objects.get(event=event,user=request.user)
			if event_access.attending:
				event_access.attending = True
			else:
				event_access.attending = False

			event_access.save()
			serializer = EventAccessSerializer(event_access)
			return Response(serializer.data,status=status.HTTP_200_OK)
		except:
			message = 'You havent requested access to this event'
			return Response(message,status=status.HTTP_400_BAD_REQUEST)

attend_event = AttendingEvent.as_view()

class EventAttendees(APIView):

	def get_object(self, pk):
		try:
			return Events.objects.get(pk=pk)
		except Events.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		event = self.get_object(pk)

		event_access = EventsAccess.objects.filter(event = event,attending='Y').values_list('user', flat=True)

		q = (Q(id__in=event_access)|Q(id=event.created_by.id))

		users = GolfUser.objects.filter(q).distinct()
		serializer = UserSerializer(users,many=True)
		return Response(serializer.data)

event_attendees = EventAttendees.as_view()

class EventMayAttend(APIView):

	def get_object(self, pk):
		try:
			return Events.objects.get(pk=pk)
		except Events.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		event = self.get_object(pk)
		event_access = EventRequestInvitation.objects.filter(event=event,type='I',accept='M').values_list('to', flat=True)
		#event_access = EventsAccess.objects.filter(event = event,attending='M').values_list('user', flat=True)

		users = GolfUser.objects.filter(id__in=event_access).distinct()
		serializer = UserSerializer(users,many=True)
		return Response(serializer.data)

event_may_attend = EventMayAttend.as_view()

class EventNotAttendees(APIView):

	def get_object(self, pk):
		try:
			return Events.objects.get(pk=pk)
		except Events.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		event = self.get_object(pk)

		event_access = EventsAccess.objects.filter(event = event,attending='N').values_list('user', flat=True)

		users = GolfUser.objects.filter(id__in=event_access).distinct()
		serializer = UserSerializer(users,many=True)
		return Response(serializer.data)

event_not_attendees = EventNotAttendees.as_view()

class EventAttendeesStats(APIView):

	def get_object(self, pk):
		try:
			return Events.objects.get(pk=pk)
		except Events.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		event = self.get_object(pk)

		event_access = EventsAccess.objects.filter(event = event)

		attending = event_access.filter(attending='Y').count()
		notattending = event_access.filter(attending='N').count()
		maybe = event_access.filter(attending='M').count()

		data = {
			'attending':attending,
			'notattending':notattending,
			'maybe':maybe,
		}
		return Response(data)

event_attendees_stats = EventAttendeesStats.as_view()

class EventFriendsAttending(APIView):

	def get_object(self, pk):
		try:
			return Events.objects.get(pk=pk)
		except Events.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		event = self.get_object(pk)
		
		friends = request.user.friends.all()

		event_access = EventsAccess.objects.filter(event = event,user=friends,attending='Y').values_list('user', flat=True)

		users = GolfUser.objects.filter(id__in=event_access)
		serializer = UserSerializer(users,many=True)
		return Response(serializer.data)

friends_attending = EventFriendsAttending.as_view()

class EventGallery(APIView):
	def get_object(self, pk):
		try:
			return Events.objects.get(pk=pk)
		except Events.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		event = self.get_object(pk)
		images = event.images.all().order_by('-id')

		serializer = EventImageSerializer(images, many=True)
		return Response(serializer.data)

	def post(self, request, pk, format=None):
		event = self.get_object(pk)
		
		images = request.data.getlist('images')

		for image in images:
			image_obj = EventImages()
			image_obj.name = image.name
			image_obj.image = image
			#image_obj.uploaded_by = request.user
			image_obj.save()
			event.images.add(image_obj)

		images = event.images.all()
		serializer = EventImageSerializer(images, many=True)
		return Response(serializer.data)

event_gallery = EventGallery.as_view()

class EventTeeTimeFiles(APIView):
	
	def get_object(self, pk):
		try:
			return Events.objects.get(pk=pk)
		except Events.DoesNotExist:
			raise Http404

	def get(self,request,pk, format=None):
		event = self.get_object(pk)

		files = event.files.all().order_by('-id')
		serializer = FileSerializer(files,many=True)
		return Response(serializer.data,status=status.HTTP_200_OK)

	def post(self,request,pk, format=None):
		event = self.get_object(pk)

		file = request.data['file']
		file_obj = EventFiles()
		file_obj.name = file.name
		file_obj.file = file
		file_obj.uploaded_by = request.user
		file_obj.save()

		event.files.add(file_obj)

		serializer = FileSerializer(file_obj)
		return Response(serializer.data,status=status.HTTP_200_OK)
		
event_tee_time_files = EventTeeTimeFiles.as_view()

class EventPosts(APIView):
	serializer_class = PostAddSerializer
	def get_object(self, pk):
		try:
			return Events.objects.get(pk=pk)
		except Events.DoesNotExist:
			raise Http404
	
	def get(self, request, pk, format=None):
		event = self.get_object(pk)
		posts = event.posts.all().order_by('-id')
		serializer = PostSerializer(posts, many=True, context={'request': request})
		return Response(serializer.data)

	def post(self, request, pk, format=None):
		event = self.get_object(pk)

		postform  = PostForm(request.data)
		if postform.is_valid():
			post = postform.save(commit=False)
			post.author = request.user
			post.object_id = event.id
			post.object_name = event.name
			post.object_type = 'Event'
			post.object_is_private = event.is_private
			post.save()
			try:
				image_ids = request.data['images']
				images = PostFiles.objects.filter(id__in=image_ids)
				for image in images:
					post.images.add(image)
			except:
				pass

			event.posts.add(post)

			searchindex = IndexObject('post',post.id)

			serializer = PostSerializer(post, context={'request': request})

			return Response(serializer.data,status=status.HTTP_201_CREATED)
		return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

event_posts = EventPosts.as_view()

#######################################EVENT ACCESS###############################################

class EventRequestAccess(APIView):

	def get_object(self, pk):
		try:
			return Events.objects.get(pk=pk)
		except Events.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		event = self.get_object(pk)
		data = {}
		try:
			eventRequest = EventRequestInvitation.objects.get(event=event,created_by=request.user,type='R',accept='M')
			message = 'You have already requested for access.'
			request_status = False
		except:
			eventRequest = EventRequestInvitation(
					event = event,
					created_by = request.user,
					to = event.created_by,
					type = 'R'
				)
			eventRequest.save()

			ownernotification = Notification(
					user = event.created_by,
					created_by = request.user,
					notification_type = 'EURA',
					object_id = eventRequest.id,
					object_type = 'Event Invitation',
					object_name = event.name,
					message = request.user.first_name+' Requested access to the event '+event.name
				)
			ownernotification.save()
			request_status = True
			message = 'Successfully sent request event owner'

		data['response_message'] = message
		data['request_status'] = request_status

		send_data = json.dumps(data)
		send_json = json.loads(send_data)

		return Response(send_json,status=status.HTTP_200_OK)

event_request_access = EventRequestAccess.as_view()

class EventCancelRequest(APIView):
	def get_object(self, pk):
		try:
			return Events.objects.get(pk=pk)
		except Events.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		event = self.get_object(pk)
		data = {}
		try:
			eventRequest = EventRequestInvitation.objects.get(event=event,created_by=request.user,type='R',accept='M')
			eventRequest.accept = 'N'
			eventRequest.save()

			message = 'You have cancelled requested for access.'
			request_status = True
		except:
			message = 'Your request has been processed.'
			request_status = False

		data['response_message'] = message
		data['request_status'] = request_status

		send_data = json.dumps(data)
		send_json = json.loads(send_data)

		return Response(send_json,status=status.HTTP_200_OK)

event_cancel_request = EventCancelRequest.as_view()

class EventGrantAccess(APIView):

	def get_object(self, pk):
		try:
			return Events.objects.get(pk=pk)
		except Events.DoesNotExist:
			raise Http404

	def get(self, request, pk, id, format=None):
		event = self.get_object(pk)
		data = {}
		try:
			eventRequest = EventRequestInvitation.objects.get(event=event,created_by__id=id,type='R',accept='M')
			if eventRequest.accept == 'N':
				message = 'User rejected the request to this event.'
				request_status = False
			else:
				try:
					eventaccess = EventsAccess.objects.get(event=event,user=eventRequest.created_by)
					message = 'User already has access to this event'
					request_status = False
				except:
					access = request.GET.get('accept')
					
					if access=='true':
						eventaccess = EventsAccess(
							event = event,
							user = eventRequest.created_by,
							access = True
						)
						eventaccess.save()
						message = event.created_by.first_name + ' granted access the event '+event.name
						eventRequest.accept = 'Y'
					else:
						message = event.created_by.first_name + ' declined access the event '+event.name
						eventRequest.accept = 'N'

					eventRequest.save()
					usernotification = Notification(
							user = eventRequest.created_by,
							created_by = request.user,
							notification_type = 'EUGA',
							object_id = eventRequest.id,
							object_type = 'Event Invitation',
							object_name = event.name,
							message = message
						)
					usernotification.save()

					request_status = True
		except:
			message = 'This request has already been processed.'
			request_status = False
			
		data['response_message'] = message
		data['request_status'] = request_status

		send_data = json.dumps(data)
		send_json = json.loads(send_data)

		return Response(send_json,status=status.HTTP_200_OK)
		
event_grant_access = EventGrantAccess.as_view()

#######################################EVENT INVITE##############################################
from restapi.usermgmt.directoryviews import send_friend_request, send_friend_request_via_mail

class SendInviteView(APIView):
	serializer_class = EventInviteSerializer

	def get_object(self, pk):
		try:
			return Events.objects.get(pk=pk)
		except Events.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		event = self.get_object(pk)
		keyword = request.GET.get('kw')

		userids = [er.to.id for er in EventRequestInvitation.objects.filter(event=event,type = 'I')]
		userids.append(event.created_by.id)

		if keyword:
			q = (Q(first_name__icontains=keyword)|Q(last_name__icontains=keyword))
			users = GolfUser.objects.filter(q).exclude(id__in=userids).order_by('first_name')
		else:
			users = GolfUser.objects.all().exclude(id__in=userids).order_by('first_name')
		
		serializer = UserSerializer(users, many=True)

		return Response(serializer.data)

	def post(self, request, pk, format=None):
		event = self.get_object(pk)
		#serializer = EventSerializer(data=request.data)
		is_friend = request.data.get('is_friend')
		try:
			user_ids = request.data.get('users')
			if user_ids:
				for userid in user_ids:
					user = GolfUser.objects.get(id = int(userid))
					if is_friend:
						req_stat = send_friend_request(request,user)
					try:
						eventRequest = EventRequestInvitation.objects.get(event=event,created_by=event.created_by,to=user,type = 'I')
					except:
						eventRequest = EventRequestInvitation(
								event = event,
								created_by = event.created_by,
								to = user,
								type = 'I'
							)
						eventRequest.save()

						if user.notify_invite_event:
							usernotification = Notification(
									user = user,
									created_by = request.user,
									notification_type = 'EURI',
									object_id = eventRequest.id,
									object_type = 'Event Invitation',
									object_name = event.name,
									message = event.created_by.first_name + ' Sent Invite to attend the event '+event.name
								)
							usernotification.save()

			useremails = request.data.get('useremails')
			try:
				message = request.data['message']
			except:
				message = ''

			mail_message = ''
			if useremails:
				for email in useremails:
					try:
						user = GolfUser.objects.get(email=email)
						if is_friend:
							req_stat = send_friend_request(request,user)
						try:
							eventRequest = EventRequestInvitation.objects.get(event=event,created_by=event.created_by,to=user,type = 'I')
						except:
							eventRequest = EventRequestInvitation(
								event = event,
								created_by = event.created_by,
								to = user,
								type = 'I'
							)
							eventRequest.save()
							
							if user.notify_invite_event:
								usernotification = Notification(
										user = user,
										created_by = request.user,
										notification_type = 'EURI',
										object_id = eventRequest.id,
										object_type = 'Event Invitation',
										object_name = event.name,
										message = event.created_by.first_name + ' Sent Invite to attend the event '+event.name
									)
								usernotification.save()
						mail_message = mail_message + str(email) +" -user is already part of the system.\n"
					except:
						if is_friend:
							req_stat = send_friend_request_via_mail(request,email)
						try:
							invite = Invite.objects.get(email=email,object_id=event.id,object_type='Event')
							mail_message = mail_message + str(email) +" -invite has already been sent.\n"
						except:
							invite = Invite(
									email = email,
									object_id = event.id,
									object_name = event.name,
									object_type = 'Event',
								)
							token = ''.join([choice(rand) for i in range(6)])
							invite.token = token

						invite.invited_by=request.user
						invite.save()

						try:
							to_email=[email]
							name = email.split('@')[0]
							sdata = {'invite': invite,'message':message,'name':name}

							email_message = get_template('common/invite_mail.html').render(Context(sdata))

							subject = 'You have been invited to GolfConnectX'
							email= EmailMessage(subject,email_message,mysettings.DEFAULT_FROM_EMAIL,to_email)
							email.content_subtype = "html"
							email.send()
							mail_message = mail_message + str(email) +" -invite sent successfully.\n"
						except:
							mail_message = mail_message + str(email) +" -failed to send invite.\n"

			return Response('Invitation send successfully', status=status.HTTP_200_OK)
		except:
			return Response("Error while sending invitation", status=status.HTTP_400_BAD_REQUEST)

send_invite_view = SendInviteView.as_view()

class AcceptInviteView(APIView):

	def get_object(self, pk):
		try:
			return Events.objects.get(pk=pk)
		except Events.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		data = {}
		event = self.get_object(pk)
		eventRequest = EventRequestInvitation.objects.get(event = event,to=request.user,type='I')
		accept = request.GET.get('accept')

		if accept=='true':
			eventRequest.accept = 'Y'
			eventaccess = EventsAccess(
				event = event,
				user = request.user,
				access = True
			)
			eventaccess.save()
			data['response_message'] = 'You have successfully accepted the invitation.'
			data['request_status'] = True
			message = request.user.first_name+" have accepted your invitation to the event "+event.name
		else:
			eventRequest.accept = 'N'
			data['response_message'] = 'You have successfully declined the invitation.'
			data['request_status'] = False
			message = request.user.first_name+" have declined your invitation to the event "+event.name
		eventRequest.save()
		
		if event.created_by.notify_accept_invitation:
			usernotification = Notification(
				user = event.created_by,
				created_by = request.user,
				notification_type = 'EUAI',
				object_id = event.id,
				object_type = 'Event',
				object_name = event.name,
				message = message
			)
			usernotification.save()

		send_data = json.dumps(data)
		send_json = json.loads(send_data)
		return Response(send_json, status=status.HTTP_200_OK)

accept_invite_view = AcceptInviteView.as_view()

class AttendingStatusView(APIView):

	def get_object(self, pk):
		try:
			return Events.objects.get(pk=pk)
		except Events.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		data = {}
		event = self.get_object(pk)
		astatus = request.GET.get('status')
		eventaccess = EventsAccess.objects.get(event=event,user=request.user)
		eventaccess.attending = astatus
		eventaccess.save()

		if status == 'Y':
			message = 'am attending.'
		else:
			message = 'am not attending.'

		data['response_message'] = 'You have successfully changed the status to '+message
		data['request_status'] = True
		data['attendee_count'] = EventsAccess.objects.filter(event=event,attending='Y').count() + 1

		send_data = json.dumps(data)
		send_json = json.loads(send_data)
		return Response(send_json, status=status.HTTP_200_OK)

attending_status_view = AttendingStatusView.as_view()

class SendInviteViaMailView(APIView):

	def get_object(self, pk):
		try:
			return Events.objects.get(pk=pk)
		except Events.DoesNotExist:
			raise Http404

	def post(self, request, pk, format=None):
		event = self.get_object(pk)
		data = {}
		useremails = request.data['useremails']
		try:
			message = request.data['message']
		except:
			message = ''

		for email in useremails:
			try:
				invite = Invite.objects.get(email=email,object_id=event.id,object_type='Event')
			except:
				invite = Invite(
						email = email,
						object_id = event.id,
						object_name = event.name,
						object_type = 'Event',
					)
				token = ''.join([choice(rand) for i in range(6)])
				invite.token = token

			invite.invited_by=request.user
			invite.save()

			try:
				to_email=[email]
				name = email.split('@')[0]
				sdata = {'invite': invite,'message':message,'name':name}

				email_message = get_template('common/invite_mail.html').render(Context(sdata))

				subject = 'You have been invited to GolfConnectX'
				email= EmailMessage(subject,email_message,mysettings.DEFAULT_FROM_EMAIL,to_email)
				email.content_subtype = "html"
				email.send()
				data = {'success':True,'message':'Invitation sent successfully!!!'}
			except:
				data = {'success':False,'message':'Error occurred while sending email.'}

		data['response_message'] = 'Invite sent successfully'
		data['request_status'] = False

		send_data = json.dumps(data)
		send_json = json.loads(send_data)

		return Response(send_json, status=status.HTTP_200_OK)

send_invite_via_mail_view = SendInviteViaMailView.as_view()




