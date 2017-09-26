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

from usermgmt.models import Notification, FriendRequest
from events.models import EventRequestInvitation, Events, EventsAccess

class NotificationsView(LoginRequiredMixin,View):
	template_name = 'usermgmt/notifications/notifications.html'

	def get(self, request):
		data = {}
		notifications = Notification.objects.filter(user = request.user).order_by('-id')
		data['notifications'] = notifications
		return render(request, self.template_name,data)

notifications = NotificationsView.as_view()

class NotificationsCountView(LoginRequiredMixin,View):
	model = Notification

	def get(self, request, *args, **kwargs):
		user = request.user

		notifications_count = user.notifications_count
		
		data = {'notifications_count':notifications_count}
		
		return HttpResponse(json.dumps(data), content_type='application/x-json')

notifications_count = NotificationsCountView.as_view()

class NotificationDetailsView(LoginRequiredMixin,View):
	template_name = 'usermgmt/notifications/notification-details.html'

	def get_object(self, pk):
		try:
			return Notification.objects.get(pk=pk)
		except Notification.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		notification = self.get_object(pk)
		
		nobject = get_notification_object(notification.notification_type,notification.object_id)
		user = request.user
		if not notification.read:
			notification.read = True
			notification.save()
			user.notifications_count -= 1
			user.save()

		data = {
			'notification': notification,
			'nobject':nobject
		}

		return render(request, self.template_name,data)

notification_details = NotificationDetailsView.as_view()

def get_notification_object(type,object_id):
	if type == 'EURA':
		notificationobject = EventRequestInvitation.objects.get(id=object_id)
		nobject = {
			'id' : str(notificationobject.id),
			'objecturl':notificationobject.get_object_url(),
			'submiturl':notificationobject.get_submit_url(),
		}
	elif type == 'UFRS':
		notificationobject = FriendRequest.objects.get(id=object_id)
		nobject = {
			'id' : str(notificationobject.id),
			'objecturl':notificationobject.get_object_url(),
			'submiturl':notificationobject.get_submit_url(),
		}
	elif type == 'EUGA':
		notificationobject = EventsAccess.objects.get(id=object_id)
		nobject = {
			'id' : str(notificationobject.id),
			'objecturl':notificationobject.get_object_url(),
		}
	else:
		nobject = False
	return nobject