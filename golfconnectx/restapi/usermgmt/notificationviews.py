import json
from datetime import datetime

from django.http import HttpResponse, HttpResponseRedirect, Http404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from usermgmt.models import Notification, FriendRequest
from usermgmt.serializers import NotificationSerializer
from events.models import EventRequestInvitation, Events, EventsAccess
from groups.models import Groups, GroupsRequestInvitation

class NotificationsView(APIView):
	model = Notification

	def get(self, request, *args, **kwargs):
		user = request.user
		notifications = Notification.objects.filter(user = user).order_by('-created_on')
		serializer = NotificationSerializer(notifications,many = True)

		return Response(serializer.data)

notifications = NotificationsView.as_view()

class NotificationsCountView(APIView):
	model = Notification

	def get(self, request, *args, **kwargs):
		user = request.user
		notifications_count = user.notifications_count
		
		#notifications_count = Notification.objects.filter(user = user,read=False).count()
		
		data = {'notifications_count':notifications_count}

		send_data = json.dumps(data)
		send_json = json.loads(send_data)
		
		return Response(send_json,status=status.HTTP_200_OK)

notifications_count = NotificationsCountView.as_view()

class NotificationDetailsView(APIView):
	model = Notification

	def get_object(self, pk):
		try:
			return Notification.objects.get(pk=pk)
		except Notification.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		notification = self.get_object(pk)
		
		nobject = get_notification_object(notification.notification_type,notification.object_id)

		if not notification.read:
			notification.read = True
			notification.save()

			user = request.user
			user.notifications_count -= 1
			user.save()

		serializer = NotificationSerializer(notification)

		data = {
			'notification': serializer.data,
			'nobject':nobject
		}
		return Response(data)

	def delete(self, request, pk, format=None):
		notification = self.get_object(pk)
		notification.delete()
		return Response(status=status.HTTP_200_OK)


notification_details = NotificationDetailsView.as_view()


def get_notification_object(type,object_id):
	if type == 'EURA':
		notificationobject = EventRequestInvitation.objects.get(id=object_id)
		if notificationobject.accept == 'Y':status = 'A'
		elif notificationobject.accept == 'N':status = 'R'
		else:status = 'P'
		nobject = {
			'id' : str(notificationobject.id),
			'objecturl':notificationobject.get_object_url(),
			'submiturl':notificationobject.get_submit_url(),
			'status':status
		}
	elif type == 'EURI':
		notificationobject = EventRequestInvitation.objects.get(id=object_id)
		if notificationobject.accept == 'Y':status = 'A'
		elif notificationobject.accept == 'N':status = 'R'
		else:status = 'P'
		nobject = {
			'id' : str(notificationobject.id),
			'objecturl':notificationobject.get_object_url(),
			'submiturl':notificationobject.get_accept_url(),
			'status':status
		}
	elif type == 'UFRS':
		notificationobject = FriendRequest.objects.get(id=object_id)
		nobject = {
			'id' : str(notificationobject.id),
			'objecturl':notificationobject.get_object_url(),
			'submiturl':notificationobject.get_submit_url(),
			'status':notificationobject.status
		}
	elif type == 'EUGA':
		notificationobject = EventRequestInvitation.objects.get(id=object_id)
		nobject = {
			'id' : str(notificationobject.id),
			'objecturl':notificationobject.get_object_url(),
		}
	elif type == 'GURI':
		notificationobject = GroupsRequestInvitation.objects.get(id=object_id)
		if notificationobject.accept == 'Y':status = 'A'
		elif notificationobject.accept == 'N':status = 'R'
		else:status = 'P'
		nobject = {
			'id' : str(notificationobject.id),
			'objecturl':notificationobject.get_object_url(),
			'submiturl':notificationobject.get_accept_url(),
			'status':status
		}
	elif type == 'GURA':
		notificationobject = GroupsRequestInvitation.objects.get(id=object_id)
		if notificationobject.accept == 'Y':status = 'A'
		elif notificationobject.accept == 'N':status = 'R'
		else:status = 'P'
		nobject = {
			'id' : str(notificationobject.id),
			'objecturl':notificationobject.get_object_url(),
			'submiturl':notificationobject.get_submit_url(),
			'status':status
		}
	else:
		nobject = False
	return nobject