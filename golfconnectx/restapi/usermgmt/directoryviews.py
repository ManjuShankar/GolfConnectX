import json
from datetime import datetime
from django.db.models import Q
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.conf import settings as my_settings
from django.core.mail import EmailMessage
from django.template.loader import get_template
from django.template import Context
from random import choice

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from rest_framework import generics

from usermgmt.models import GolfUser, FriendRequest, Notification, Messages,\
Conversation, Invite
from usermgmt.serializers import UserListSerializer, UserSerializer,\
GolferSkillsSettingsSerializer, AddMessageSerializer, MessageSerializer,\
DirectoryUserSerializer

from groups.models import Groups
from groups.serializers import GroupSerializer

from events.models import Events, EventsAccess
from events.serializers import EventListSerializer

from courses.models import Courses, CourseUserDetails
from courses.serializers import CourseListSerializer
rand = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'

class UserProfiles(generics.ListAPIView):
    """
    List of all courses.
    """
    serializer_class = UserListSerializer

    def get_queryset(self):
    	user = self.request.user
    	users = GolfUser.objects.all().exclude(id=user.id).order_by('first_name')

    	return users

    def get(self,request,*args,**kwargs):
    	users = self.get_queryset()
    	serializer = DirectoryUserSerializer(users, many=True,context={'request': request})
    	return Response(serializer.data)

user_profiles= UserProfiles.as_view()

class SearchDirectory(APIView):

	def get(self,request,*args,**kwargs):
		keyword = request.GET.get('kw')
		q = (Q(first_name__icontains=keyword)|Q(last_name__icontains=keyword))
		users = GolfUser.objects.filter(q)

		serializer = DirectoryUserSerializer(users, many=True,context={'request': request})
		return Response(serializer.data)

search_profiles = SearchDirectory.as_view()

class SendMultipleFriendRequest(APIView):
	def get(self,request,*args,**kwargs):
		frequests = FriendRequest.objects.filter(from_user = request.user,status='P').values('to_user')

		ids = [fre['to_user'] for fre in frequests]
		ids.append(request.user.id)

		keyword = request.GET.get('kw')
		if keyword:
			q = (Q(first_name__icontains=keyword)|Q(last_name__icontains=keyword))
			users = GolfUser.objects.filter(q).exclude(id__in=ids).order_by('first_name')
		else:
			users = GolfUser.objects.all().exclude(id__in=ids).order_by('first_name')


		serializer = DirectoryUserSerializer(users, many=True,context={'request': request})
		return Response(serializer.data)

	def post(self,request,*args,**kwargs):
		user_list = request.data.get('users')
		users = GolfUser.objects.filter(id__in=user_list)
		loggeduser = request.user

		try:
			for user in users:
				try:
					friendrequest = FriendRequest.objects.get(to_user = user,from_user = request.user,status='P')
				except:
					friendrequest = FriendRequest(
							to_user = user,
							from_user = request.user,
							status = 'P'
						)
					friendrequest.save()

					notification = Notification(
						user = user,
						notification_type = 'UFRS',
						created_by=request.user,
						object_id = friendrequest.id,
						object_type = 'Friend Request',
						object_name = request.user.first_name,
						message = request.user.first_name + ' Sent you a friend request'
					)
					notification.save()
			
			try:
				message = request.data['message']
			except:
				message = ''

			mail_message = ''
			useremails = request.data['useremails']
			for email in useremails:
				try:
					user = GolfUser.objects.get(email=email)
					try:
						friendrequest = FriendRequest.objects.get(to_user = user,from_user = request.user,status='P')
					except:
						friendrequest = FriendRequest(
								to_user = user,
								from_user = request.user,
								status = 'P'
							)
						friendrequest.save()

						notification = Notification(
							user = user,
							notification_type = 'UFRS',
							created_by=request.user,
							object_id = friendrequest.id,
							object_type = 'Friend Request',
							object_name = request.user.first_name,
							message = request.user.first_name + ' Sent you a friend request'
						)
						notification.save()
					mail_message = mail_message + str(email) +" -user is already part of the system.\n"
				except:
					try:
						invite = Invite.objects.get(email=email,object_id=request.user.id,object_type='Friend')
						mail_message = mail_message + str(email) +" -invite has already been sent.\n"
					except:
						invite = Invite(
								email = email,
								object_id = request.user.id,
								object_name = request.user.first_name,
								object_type = 'Friend',
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

							subject = 'You have been invited to Golf Connectx'
							email= EmailMessage(subject,email_message,my_settings.DEFAULT_FROM_EMAIL,to_email)
							email.content_subtype = "html"
							email.send()
							mail_message = mail_message + str(email) +" -invite sent successfully.\n"
						except:
							mail_message = mail_message + str(email) +" -failed to send invite.\n"

			response_message = 'Friend request sent successfully.'
			request_status = True
		except:
			response_message = 'Request failed with error.'
			request_status = False

		data = {'response_message':response_message,'request_status':request_status}
		send_data = json.dumps(data)
		send_json = json.loads(send_data)

		return Response(send_json,status=status.HTTP_200_OK)

send_multiple_friend_request = SendMultipleFriendRequest.as_view()

class UserProfile(APIView):

	def get_object(self, pk):
		try:
			return GolfUser.objects.get(pk=pk)
		except GolfUser.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		user = self.get_object(pk)

		serializer = DirectoryUserSerializer(user,context={'request': request})
		skillserializer = GolferSkillsSettingsSerializer(user)

		data = {
			'profile':serializer.data,
			'skills':skillserializer.data
		}

		return Response(data)

user_profile = UserProfile.as_view()

######################################NEW VIEWS########################################################
from posts.models import Post
from posts.serializers import PostSerializer

class UserPosts(APIView):

	def get_object(self, pk):
		try:
			return GolfUser.objects.get(pk=pk)
		except GolfUser.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		user = self.get_object(pk)
		requser = request.user
		
		if user.is_private:
			if user not in requser.friends.all():
				if Groups.objects.filter(admins=requser,members=user,is_private=False).exists():
					groups = Groups.objects.filter(admins=requser,members=user,is_private=False).distinct()
					postlist = []
					for group in groups:
						posts = [post for post in group.posts.filter(author = user)]
						postlist = postlist + posts
					posts = postlist
				elif Groups.objects.filter(members__in=[user,requser],is_private=False).exists():
					groups = Groups.objects.filter(members__in=[user,requser],is_private=False).distinct()
					postlist = []
					for group in groups:
						posts = [post for post in group.posts.filter(author = user)]
						postlist = postlist + posts
					posts = postlist
				else:
					posts = None
			else:
				posts = Post.objects.filter(author=user,object_type__in=['Group','Event']).order_by('-id').distinct()
		else:
			if user not in requser.friends.all():
				if Groups.objects.filter(members=requser,admins=user,is_private=False).exists():
					groups = Groups.objects.filter(members=requser,admins=user,is_private=False).distinct()
					postlist = []
					for group in groups:
						posts = [post for post in group.posts.filter(author = user)]
						postlist = postlist + posts
					posts = postlist
				elif Groups.objects.filter(admins=requser,members=user,is_private=False).exists():
					groups = Groups.objects.filter(admins=requser,members=user,is_private=False).distinct()
					postlist = []
					for group in groups:
						posts = [post for post in group.posts.filter(author = user)]
						postlist = postlist + posts
					posts = postlist
				else:
					posts = None
			else:
				posts = Post.objects.filter(author=user,object_type__in=['Group','Event']).order_by('-id').distinct()

		serializer = PostSerializer(posts, many=True, context={'request': request})

		return Response(serializer.data)

user_posts = UserPosts.as_view()

class UserGroups(APIView):

	def get_object(self, pk):
		try:
			return GolfUser.objects.get(pk=pk)
		except GolfUser.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		user = self.get_object(pk)
		requser = request.user

		if user.is_private:
			if user not in requser.friends.all():
				if Groups.objects.filter(admins=requser,members=user,is_private=False).exists():
					groups = Groups.objects.filter(admins=requser,members=user,is_private=False).distinct()
				elif Groups.objects.filter(members__in=[user,requser],is_private=False).exists():
					groups = Groups.objects.filter(members__in=[user,requser],is_private=False).distinct()
				else:
					groups = None
			else:
				q = (Q(created_by=user)|Q(members = user)|Q(admins = user))
				groups = Groups.objects.filter(q,is_private=False).order_by('-id').distinct()
		else:
			if user not in requser.friends.all():
				if Groups.objects.filter(members=requser,admins=user,is_private=False).exists():
					groups = Groups.objects.filter(members=requser,admins=user,is_private=False).distinct()
				elif Groups.objects.filter(admins=requser,members=user,is_private=False).exists():
					groups = Groups.objects.filter(admins=requser,members=user,is_private=False).distinct()
				else:
					groups = None
			else:
				q = (Q(created_by=user)|Q(members = user)|Q(admins = user))
				groups = Groups.objects.filter(q,is_private=False).order_by('-id').distinct()



		serializer = GroupSerializer(groups, many=True)

		serializedgroups = serializer.data
		
		if groups:
			if (groups.count() > 7):
				groups_list1 = serializedgroups[0:7]
				groups_lists = [serializedgroups[x:x+8] for x in range(7, (groups.count()),8)]
				groups_lists.insert(0,groups_list1)
			else:
				groups_lists = [serializedgroups[x:x+7] for x in range(0, (groups.count()),7)]
		else:
			groups_lists = []
		return Response(groups_lists)

user_groups = UserGroups.as_view()

class UserFriends(APIView):

	def get_object(self, pk):
		try:
			return GolfUser.objects.get(pk=pk)
		except GolfUser.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		user = self.get_object(pk)
		requser = request.user

		if user.is_private:
			friends = None

		else:
			if user not in requser.friends.all():
				friends = None
			else:
				friends = user.friends.filter(is_private=False)
				
		serializer = DirectoryUserSerializer(friends, many=True,context={'request': request})

		return Response(serializer.data)

user_friends = UserFriends.as_view()

class UserEvents(APIView):

	def get_object(self, pk):
		try:
			return GolfUser.objects.get(pk=pk)
		except GolfUser.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		user = self.get_object(pk)
		requser = request.user
		today = datetime.today()

		if user not in requser.friends.all():
			events = None
		else:
			event_access = EventsAccess.objects.filter(user = user).values_list('event', flat=True)
			q = (Q(created_by=user)|Q(id__in = event_access))
			events = Events.objects.filter(q,end_date__gte=today.date,is_private=False).order_by('start_date').distinct()
				
		serializer = EventListSerializer(events, many=True,context={'request': request})

		return Response(serializer.data)

user_events = UserEvents.as_view()

class UserCourses(APIView):
	def get_object(self, pk):
		try:
			return GolfUser.objects.get(pk=pk)
		except GolfUser.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		user = self.get_object(pk)
		requser = request.user

		q = (Q(is_following=True)|Q(is_played=True))
		cuds = CourseUserDetails.objects.filter(q,user=user).values_list('course')

		if not user.is_private:
			if user in requser.friends.all():
				cuds = CourseUserDetails.objects.filter(q,user=request.user).values_list('course')
				courses = Courses.objects.filter(id__in=cuds).distinct()
			else:
				courses = None
		else:
			courses = None

		serializer = CourseListSerializer(courses, many=True)
		return Response(serializer.data)

user_courses = UserCourses.as_view()

######################################FRIEND REQUEST VIEWS##############################################

class SendFriendRequest(APIView):

	def get_object(self, pk):
		try:
			return GolfUser.objects.get(pk=pk)
		except GolfUser.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		user = self.get_object(pk)
		if user in request.user.friends.all():
			response_message = 'You have already friends with this user.'
			request_status = False
		else:
			try:
				friendrequest = FriendRequest.objects.get(to_user = user,from_user = request.user,status='P')
				response_message = 'You have already sent friend request.'
				request_status = False
			except:
				friendrequest = FriendRequest(
						to_user = user,
						from_user = request.user,
						status = 'P'
					)
				friendrequest.save()

				notification = Notification(
					user = user,
					notification_type = 'UFRS',
					created_by=request.user,
					object_id = friendrequest.id,
					object_type = 'Friend Request',
					object_name = request.user.first_name,
					message = request.user.first_name + ' Sent you a friend request'
				)
				notification.save()

				response_message = 'Friend request sent successfully.'
				request_status = True

		data = {'response_message':response_message,'request_status':request_status}

		send_data = json.dumps(data)
		send_json = json.loads(send_data)

		return Response(send_json,status=status.HTTP_200_OK)

send_friend_request_old = SendFriendRequest.as_view()

class RespondFriendRequest(APIView):

	def get_object(self, pk):
		try:
			return GolfUser.objects.get(pk=pk)
		except GolfUser.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		data = {}
		user = self.get_object(pk)
		try:
			friendrequest = FriendRequest.objects.get(from_user = user,to_user = request.user,status='P')

			accept=request.GET.get('accept')

			if accept=='true':
				friendrequest.status = 'A'

				loged_user = request.user
				loged_user.friends.add(user)
				loged_user.save()
				user.friends.add(loged_user)
				user.save()
				
				message = 'Friend Request Accepted.'
			else:
				friendrequest.status = 'R'
				message = 'Friend Request Rejected.'

			friendrequest.save()

			notification = Notification(
				user = user,
				notification_type = 'UFRR',
				created_by=request.user,
				object_id = friendrequest.id,
				object_name = request.user.first_name,
				object_type = 'Friend Request',
			)
			if accept=='true':
				message = request.user.first_name + ' accepted your friend request'
			else:
				message = request.user.first_name + ' declined your friend request'
			notification.message = message
			notification.save()
			
			request_status = True
			data['friend_request_status'] = friendrequest.status
		except:
			request_status = False
			message = 'You have already responded to the request'

		data['response_message'] = message
		data['request_status'] = request_status

		send_data = json.dumps(data)
		send_json = json.loads(send_data)

		return Response(send_json,status=status.HTTP_200_OK)

respond_friend_request = RespondFriendRequest.as_view()

######################################SEND MESSAGE VIEWS##############################################

class SendMessageView(APIView):
	model = Messages
	serializer_class = AddMessageSerializer

	def post(self, request, pk, format=None):

		conversation = Conversation()
		conversation.save()

		user = GolfUser.objects.get(id = pk)

		conversation.participants.add(user)
		conversation.participants.add(request.user)

		m = request.data['message']
		message = Messages()
		message.message = m
		message.created_by = request.user
		message.save()

		conversation.messages.add(message)

		serializer = MessageSerializer(message,context={'request': request})
		return Response(serializer.data, status=status.HTTP_200_OK)

send_message = SendMessageView.as_view()

def send_friend_request(request,user):
	if not user in request.user.friends.all():
		try:
			friendrequest = FriendRequest.objects.get(to_user = user,from_user = request.user,status='P')
		except:
			friendrequest = FriendRequest(
					to_user = user,
					from_user = request.user,
					status = 'P'
				)
			friendrequest.save()

			notification = Notification(
				user = user,
				notification_type = 'UFRS',
				created_by=request.user,
				object_id = friendrequest.id,
				object_type = 'Friend Request',
				object_name = request.user.first_name,
				message = request.user.first_name + ' Sent you a friend request'
			)
			notification.save()
	return True

def send_friend_request_via_mail(request,email):
	try:
		invite = Invite.objects.get(email=email,object_id=request.user.id,object_type='Friend')
	except:
		invite = Invite(
				email = email,
				object_id = request.user.id,
				object_name = request.user.first_name,
				object_type = 'Friend',
			)
		token = ''.join([choice(rand) for i in range(6)])
		invite.token = token

		invite.invited_by=request.user
		invite.save()
	return True
