import json
from PIL import Image
from easy_thumbnails.files import get_thumbnailer
from itertools import chain
from random import choice

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework import generics

from django.core.mail import EmailMessage
from django.core import serializers
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.template.loader import get_template
from django.template import Context

from groups.models import Groups, GroupImages, GroupFiles, GroupsRequestInvitation
from groups.adminforms import GroupForm
from groups.serializers import GroupSerializer, GroupDetailSerializer, GroupCreateSerializer,\
GroupAdminSerializer, ImageSerializer, GroupEditInfoSerializer, GroupMemberSerializer, FileSerializer
from usermgmt.serializers import UserSerializer
from usermgmt.models import GolfUser, Notification, Invite

from posts.models import Post, PostFiles
from posts.serializers import PostSerializer, PostAddSerializer
from posts.adminforms import PostForm

from events.serializers import EventSerializer, EventListSerializer,EventAddSerializer
from events.adminforms import EventForm, EventAddForm
from courses.models import Courses
from courses.serializers import GroupCourseListSerializer
from django.conf import settings as mysettings 

from restapi.usermgmt.views import SendMail
from restapi.search.views import IndexObject

rand = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'

class GroupsHome(generics.ListAPIView):
	#permission_classes = (IsAuthenticated,)
	serializer_class = GroupSerializer

	def get_queryset(self):
		q = (Q(created_by=self.request.user)|Q(members = self.request.user)|Q(admins = self.request.user))
		groups = Groups.objects.filter(q).order_by('-id').distinct()
		return groups
	
	def get(self, request, format=None):
		
		groups = self.get_queryset()
		serializer = GroupSerializer(groups, many=True)

		serializedgroups = serializer.data

		groups_lists = [serializedgroups[x:x+12] for x in range(0, (groups.count()),12)]

		return Response(serializer.data)

groups_home = GroupsHome.as_view()

class GroupsNewHome(generics.ListAPIView):
	#permission_classes = (IsAuthenticated,)
	serializer_class = GroupSerializer

	def get_queryset(self):
		q = (Q(created_by=self.request.user)|Q(members = self.request.user)|Q(admins = self.request.user))
		groups = Groups.objects.filter(q).order_by('-id').distinct()
		return groups
	
	def get(self, request, format=None):
		
		groups = self.get_queryset()
		serializer = GroupSerializer(groups, many=True)

		serializedgroups = serializer.data

		if(groups.count() > 11):
			groups_list1 = serializedgroups[0:11]
			groups_lists = [serializedgroups[x:x+12] for x in range(11, (groups.count()),12)]
			groups_lists.insert(0,groups_list1)
		else:
			groups_lists = [serializedgroups[x:x+12] for x in range(0, (groups.count()),11)]

		return Response(groups_lists)

groups_new_home = GroupsNewHome.as_view()

class UploadGroupCoverImage(APIView):

	def post(self,request,format=None):
		data = {}
		try:
			image = request.data['image']

			try:
				imageid = request.data['imageid']
				image_obj = GroupImages.objects.get(id = int(imageid))
			except:
				image_obj = GroupImages()
				
			image_obj = GroupImages()
			image_obj.name = image.name
			image_obj.image = image
			image_obj.save()

			with Image.open(image_obj.image) as img:
				width, height = img.size

			image_obj.width = width
			image_obj.height = height
			image_obj.save()

			if width > 1152 or height > 240:
				options = {'size': (1152, 240), 'crop': True}
				thumbnail_url = get_thumbnailer(image_obj.image).get_thumbnail(options).url
			else:
				thumbnail_url = "/site_media/"+str(image_obj.image)

			thumbnail_url = str(mysettings.SITE_URL)+thumbnail_url

			serializer = ImageSerializer(image_obj)
			return Response(serializer.data,status=status.HTTP_200_OK)
		except:
			from sys import exc_info
			data['status'] = 0
		return Response(json.dumps(data), status=status.HTTP_400_BAD_REQUEST)

upload_group_cover_image = UploadGroupCoverImage.as_view()

class DeleteGroupImage(APIView):

	def get(self,request,pk, format=None):
		data = {}
		try:
			gimage = GroupImages.objects.get(id = pk)
			gimage.delete()
			data['status']=True
			res_status = status.HTTP_200_OK
		except:
			data['status']=False
			res_status = status.HTTP_400_BAD_REQUEST

		send_data = json.dumps(data)
		send_json = json.loads(send_data)

		return Response(send_data, status=res_status)

delete_group_image = DeleteGroupImage.as_view()

class DeleteGroupFile(APIView):

	def get(self,request,pk, format=None):
		data = {}
		try:
			gfile = GroupFiles.objects.get(id = pk)
			gfile.delete()
			data['status']=True
			res_status = status.HTTP_200_OK
		except:
			data['status']=False
			res_status = status.HTTP_400_BAD_REQUEST

		send_data = json.dumps(data)
		send_json = json.loads(send_data)

		return Response(send_data, status=res_status)

delete_group_file = DeleteGroupFile.as_view()

class CreateGroup(generics.CreateAPIView):
	serializer_class = GroupCreateSerializer

	def get_queryset(self):
		courses = Courses.objects.all().order_by('name')[:100]
		return courses

	def get(self,request,format=None):
		courses = self.get_queryset()
		course_serializer = GroupCourseListSerializer(courses, many=True)

		users = GolfUser.objects.filter(is_private=False).exclude(id = request.user.id)
		user_serializer = UserSerializer(users, many=True)

		data = {'courses':course_serializer.data,'users':user_serializer.data}
		return Response(data)

	def post(self, request, format=None):
		form  = GroupForm(request.data)
		serializer = GroupCreateSerializer(data=request.data)
		
		if serializer.is_valid():
			obj = form.save(commit=False)
			try:
				courseid = request.data['course']
				course = Courses.objects.get(id = int(courseid))
				obj.course = course
			except:
				pass

			obj.created_by = obj.modified_by = request.user
			obj.save()

			try:
				coverImageId = request.data.get('cover_image')
				if coverImageId:
					cover_image = GroupImages.objects.get(id = int(coverImageId))
					obj.cover_image = cover_image
				obj.save()
			except:
				pass

			obj.members.add(request.user)
			obj.admins.add(request.user)
			searchindex = IndexObject('group',obj.id)

			serializer = GroupDetailSerializer(obj,context={'request': request,'group':obj})

			return Response(serializer.data, status=status.HTTP_200_OK)
	
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

groups_create = CreateGroup.as_view()

class EditGroupView(APIView):
	serializer_class = GroupDetailSerializer

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def get(self,request,pk,format=None):
		courses = Courses.objects.all().order_by('name')[:100]
		course_serializer = GroupCourseListSerializer(courses, many=True)

		users = GolfUser.objects.filter(is_private=False).exclude(id = request.user.id)
		user_serializer = UserSerializer(users, many=True)

		group = self.get_object(pk)
		group_serializer = GroupDetailSerializer(group,context={'request': request,'group':group})

		data = {'courses':course_serializer.data,'users':user_serializer.data,'group':group_serializer.data}
		return Response(data)

	def post(self, request, pk, format=None):
		group = self.get_object(pk)

		form  = GroupForm(request.data,instance=group)

		serializer = GroupCreateSerializer(group,data=request.data)
		if serializer.is_valid():
			obj = form.save(commit=False)
			obj.modified_by = request.user

			try:
				courseid = request.data['course']
				course = Courses.objects.get(id = int(courseid))
				obj.course = course
			except:
				obj.course = None

			coverImageId = request.data.get('cover_image')
			if coverImageId:
				cover_image = GroupImages.objects.get(id = int(coverImageId))
				obj.cover_image = cover_image

			obj.save()
			posts = obj.posts.all()
			if posts.exists():
				for post in posts:
					post.object_name = obj.name
					post.save()
					
			searchindex = IndexObject('group',obj.id)
			members = group.members.all()
			subject = 'GolfConnectx Group - '+str(obj.name)
			message = 'Group details has been updated by '+str(request.user.first_name)
			for member in members:
				if member.notify_group_updates:
					notification = Notification(
							user = member,
							created_by = request.user,
							notification_type = 'GUN',
							object_id = group.id,
							object_type = 'Group Update',
							object_name = group.name,
							message = request.user.first_name+' updated the group '+group.name
						)
					notification.save()

			serializer = GroupDetailSerializer(group,context={'request': request,'group':obj})
			return Response(serializer.data)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

groups_edit = EditGroupView.as_view()

class GroupDetailView(APIView):
	serializer_class = GroupDetailSerializer

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		group = self.get_object(pk)
		serializer = GroupDetailSerializer(group,context={'request': request,'group':group})
		return Response(serializer.data)

	def delete(self, request, pk, format=None):
		group = self.get_object(pk)
		group.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)
		
group_details = GroupDetailView.as_view()

class GroupEditInfo(APIView):
	serializer_class = GroupEditInfoSerializer

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		group = self.get_object(pk)
		serializer = GroupEditInfoSerializer(group)
		return Response(serializer.data)

	def put(self, request, pk, format=None):
		group = self.get_object(pk)
		serializer = GroupEditInfoSerializer(group, data=request.data)
		if serializer.is_valid():
			serializer.save()
			searchindex = IndexObject('group',group.id)
			return Response(serializer.data,status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

edit_group_info = GroupEditInfo.as_view()

class GroupMembers(APIView):
	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def get(self, request,pk, format=None):
		group = self.get_object(pk)
		user = request.user
		q = (Q(id__in=group.members.all())|Q(id=group.created_by.id))

		if user in group.admins.all():
			users = GolfUser.objects.filter(q)
		else:
			friends = user.friends.filter(q)
			users = GolfUser.objects.filter(q,is_private=False)
			users = list(chain(users, friends))

		serializer = GroupMemberSerializer(users,many=True,context={'request': request,'group':group})
		return Response(serializer.data)

group_members = GroupMembers.as_view()

class GroupSearchMembers(APIView):
	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def get(self, request,pk, format=None):
		group = self.get_object(pk)
		user = request.user
		keyword = request.GET.get('kw')

		q = (Q(id__in=group.members.all())|Q(id=group.created_by.id))

		kq = (Q(first_name__icontains=keyword)|Q(last_name__icontains=keyword))

		if user in group.admins.all():
			users = GolfUser.objects.filter(q,kq)
		else:
			friends = user.friends.filter(q,kq)
			users = GolfUser.objects.filter(q,kq,is_private=False)
			users = list(chain(users, friends))

		serializer = UserSerializer(users,many=True)
		return Response(serializer.data)

group_search_members = GroupSearchMembers.as_view()

class GroupAdmins(APIView):
	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def get(self, request,pk, format=None):
		group = self.get_object(pk)
		
		q = (Q(id__in=group.members.all())|Q(id=group.created_by.id))

		admins = GolfUser.objects.filter(q)
		serializer = GroupMemberSerializer(admins,many=True,context={'request': request,'group':group})
		return Response(serializer.data)

group_admins = GroupAdmins.as_view()

class GroupsPosts(APIView):
	serializer_class = PostAddSerializer
	
	def get(self, request, pk, format=None):
		group = Groups.objects.get(id = pk)
		posts = group.posts.all().order_by('-id')
		serializer = PostSerializer(posts, many=True, context={'request': request})
		return Response(serializer.data)

	def post(self, request, pk, format=None):
		group = Groups.objects.get(id=pk)

		postform  = PostForm(request.data)
		if postform.is_valid():
			post = postform.save(commit=False)
			post.author = request.user
			post.object_id = group.id
			post.object_name = group.name
			post.object_type = 'Group'
			post.object_is_private = group.is_private
			post.save()
			try:
				image_ids = request.data['images']
				images = PostFiles.objects.filter(id__in=image_ids)
				for image in images:
					post.images.add(image)
			except:
				pass

			group.posts.add(post)
			searchindex = IndexObject('post',post.id)

			serializer = PostSerializer(post, context={'request': request})

			return Response(serializer.data,status=status.HTTP_201_CREATED)
		return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

group_posts = GroupsPosts.as_view()

from rest_framework.permissions import AllowAny

class GroupAddAdmin(APIView):
	serializer_class = GroupAdminSerializer

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def post(self, request,pk, format=None):
		group = self.get_object(pk)

		user_list = request.data.get('admins')
		users = GolfUser.objects.filter(id__in=user_list)

		group.admins.clear()
		for user in users:
			group.admins.add(user)

		users = group.members.all()
		serializer = GroupMemberSerializer(users,many=True,context={'request': request,'group':group})

		return Response(serializer.data)

group_add_admin = GroupAddAdmin.as_view()

from restapi.usermgmt.directoryviews import send_friend_request, send_friend_request_via_mail

class GroupAddMember(APIView):

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def get(self,request, pk, format=None):
		group = self.get_object(pk)

		userids = [gi.to.id for gi in GroupsRequestInvitation.objects.filter(group=group)]
		members = [member.id for member in group.members.all()]
		exids = userids + members

		keyword = request.GET.get('kw')

		if keyword:
			q = (Q(first_name__icontains=keyword)|Q(last_name__icontains=keyword))
			users = GolfUser.objects.filter(q).exclude(id__in=exids).order_by('first_name')
		else:
			users = GolfUser.objects.all().exclude(id__in = exids).order_by('first_name')

		serializer = UserSerializer(users, many=True)

		return Response(serializer.data)

	def post(self, request, pk, format=None):
		data = {}
		group = self.get_object(pk)
		is_friend = request.data.get('is_friend')
		try:
			member_list = request.data.get('users')
			if member_list:
				members = GolfUser.objects.filter(id__in=member_list)
				for user in members:
					if is_friend:
						req_stat = send_friend_request(request,user)
					try:
						groupRequest = GroupsRequestInvitation.objects.get(group=group,to=user,type='I',accept='M')
					except:
						groupRequest = GroupsRequestInvitation(
								group = group,
								created_by = request.user,
								to = user,
								type = 'I'
							)
						groupRequest.save()

						if user.notify_invite_event:
							usernotification = Notification(
									user = user,
									created_by = request.user,
									notification_type = 'GURI',
									object_id = groupRequest.id,
									object_type = 'Group Invitation',
									object_name = group.name,
									message = ' You have been invited to the group  '+group.name
								)
							usernotification.save()

			useremails = request.data['useremails']
			try:
				message = request.data['message']
			except:
				message = ''

			mail_message = ''

			for email in useremails:
				try:
					user = GolfUser.objects.get(email=email)
					if is_friend:
						req_stat = send_friend_request(request,user)
					try:
						groupRequest = GroupsRequestInvitation.objects.get(group=group,to=user,type='I',accept='M')
					except:
						groupRequest = GroupsRequestInvitation(
								group = group,
								created_by = request.user,
								to = user,
								type = 'I'
							)
						groupRequest.save()
						
						if user.notify_invite_event:
							usernotification = Notification(
									user = user,
									created_by = request.user,
									notification_type = 'GURI',
									object_id = group.id,
									object_type = 'Group Invitation',
									object_name = group.name,
									message = ' You have been invited to the group  '+group.name
								)
							usernotification.save()
					mail_message = mail_message + str(email) +" -user is already part of the system.\n"
				except:
					if is_friend:
						req_stat = send_friend_request_via_mail(request,email)
					try:
						invite = Invite.objects.get(email=email,object_id=group.id,object_type='Group')
						mail_message = mail_message + str(email) +" -invite has already been sent.\n"
					except:
						invite = Invite(
								email = email,
								object_id = group.id,
								object_name = group.name,
								object_type = 'Group',
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

			data['response_message'] = 'Invitation sent successfully'
			data['mail_message'] = mail_message
			data['request_status'] = True

			send_data = json.dumps(data)
			send_json = json.loads(send_data)
			return Response(send_json, status=status.HTTP_200_OK)
		except:
			from sys import exc_info
			print "+++++++++++++++++",exc_info(),"++++++++++++++++++++"
			data['message'] = "Error occurred while adding members."
			send_data = json.dumps(data)
			send_json = json.loads(send_data)
			return Response(send_json, status=status.HTTP_400_BAD_REQUEST)


group_add_member = GroupAddMember.as_view()

class GroupSeachMember(APIView):

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def get(self,request, pk, format=None):
		group = self.get_object(pk)

		userids = [gi.to.id for gi in GroupsRequestInvitation.objects.filter(group=group)]
		members = [member.id for member in group.members.all()]
		exids = userids + members

		keyword = request.GET.get('kw')
		
		kw = (Q(first_name__icontains=keyword)|Q(last_name__icontains=keyword))

		users = GolfUser.objects.filter(kw).exclude(id__in = exids)

		serializer = UserSerializer(users, many=True)

		return Response(serializer.data)

group_search_member = GroupSeachMember.as_view()

class GroupRemoveMember(APIView):

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def post(self, request,pk, format=None):
		group = self.get_object(pk)

		member_id = request.data.get('members')
		members = GolfUser.objects.filter(id__in=member_id)

		for member in members:
			group.members.remove(member)

		for member in members:
			group.admins.remove(member)

		members = group.members.all()
		admins = group.admins.all()

		mserializer = GroupMemberSerializer(members,many=True,context={'request': request,'group':group})
		aserializer = GroupMemberSerializer(admins,many=True,context={'request': request,'group':group})

		data = {
			"members":mserializer.data,
			"admins":aserializer.data,
			"message":"Successfully Removed Selected Members."
		}
		return Response(data,status=status.HTTP_200_OK)

group_remove_member = GroupRemoveMember.as_view()

class AddGroupImage(APIView):

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def post(self,request,pk, format=None):
		data = {}
		group = self.get_object(pk)

		try:
			image = request.data['image']

			image_obj = GroupImages()
			image_obj.name = image.name
			image_obj.image = image
			image_obj.uploaded_by = request.user
			image_obj.save()

			group.images.add(image_obj)

			gimages = group.images.all()
			serializer = ImageSerializer(gimages, many=True)

			return Response(serializer.data,status=status.HTTP_200_OK)
		except:
			from sys import exc_info
			data['status'] = 0
			return Response(json.dumps(data), status=status.HTTP_400_BAD_REQUEST)

group_add_image = AddGroupImage.as_view()

class GroupGallery(APIView):

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def get(self, request,pk, format=None):
		group = self.get_object(pk)

		images = group.images.all()
		serializer = ImageSerializer(images, many=True)

		return Response(serializer.data)

	def post(self, request,pk, format=None):
		group = self.get_object(pk)

		images = request.data.getlist('images')

		for image in images:
			image_obj = GroupImages()
			image_obj.name = image.name
			image_obj.image = image
			image_obj.uploaded_by = request.user
			image_obj.save()
			group.images.add(image_obj)

		images = group.images.all()
		serializer = ImageSerializer(images, many=True)

		return Response(serializer.data)

group_gallery = GroupGallery.as_view()

class AddGroupFile(APIView):

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def post(self,request,pk, format=None):
		data = {}
		group = self.get_object(pk)

		try:
			file = request.data['file']
			
			file_obj = GroupFiles()
			file_obj.name = file.name
			file_obj.file = file
			file_obj.uploaded_by = request.user
			file_obj.save()	
			
			group.files.add(file_obj)

			files = group.files.all().order_by('-uploaded_on')

			serializer = FileSerializer(files,many=True)
			return Response(serializer.data,status=status.HTTP_200_OK)
		except:
			from sys import exc_info
			data['status'] = 0
			return Response(json.dumps(data), status=status.HTTP_400_BAD_REQUEST)

group_add_file = AddGroupFile.as_view()

class GroupFilesView(APIView):

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def get(self, request,pk, format=None):
		group = self.get_object(pk)

		files = group.files.all().order_by('-uploaded_on')
		serializer = FileSerializer(files, many=True)

		return Response(serializer.data)

group_files = GroupFilesView.as_view()

class GroupEvents(APIView):

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def get(self, request,pk, format=None):
		group = self.get_object(pk)

		events = group.events.all()
		serializer = EventListSerializer(events, many=True)

		return Response(serializer.data)

group_events = GroupEvents.as_view()

class GroupsCreateEvent(APIView):
	serializer_class = EventAddSerializer

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def post(self, request, pk, format=None):
		group = self.get_object(pk)

		form  = EventAddForm(request.data)

		if form.is_valid():
			obj = form.save(commit=False)
			user = request.user

			obj.created_by = obj.modified_by = user
			
			obj.save()

			group.events.add(obj)

			serializer = EventSerializer(obj,context={'request': request})

			return Response(serializer.data, status=status.HTTP_200_OK)

		errors = json.dumps(form.errors)
		return Response(errors, status=status.HTTP_400_BAD_REQUEST)


group_create_event = GroupsCreateEvent.as_view()

class GroupCreatePost(APIView):
	serializer_class = PostAddSerializer

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def post(self, request,pk, format=None):
		group = self.get_object(pk)

		post = Post()
		title = request.data.get('title')
		post.title = title
		post.author = request.user
		post.object_id = group.id
		post.object_name = group.name
		post.object_type = 'Group'
		post.save()

		group.posts.add(post)

		posts = group.posts.all()
		serializer = PostSerializer(posts, many=True, context={'request': request})
		return Response(serializer.data, status=status.HTTP_200_OK)

group_create_post = GroupCreatePost.as_view()

class LeaveGroup(APIView):

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		data = {}
		group = self.get_object(pk)

		user = request.user
		if user in group.admins.all():
			group.admins.remove(user)

		if user in group.members.all():
			group.members.remove(user)

		data['message'] = "You have successfully left the group "+str(group.name)
		send_data = json.dumps(data)
		send_json = json.loads(send_data)

		return Response(send_json, status=status.HTTP_200_OK)

group_leave_group = LeaveGroup.as_view()

#######################################GROUP ACCESS###############################################

class GroupRequestAccess(APIView):

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		data = {}
		group = self.get_object(pk)
		try:
			groupRequest = GroupsRequestInvitation.objects.get(group=group,created_by=request.user,type='R')
			message = 'Request already sent. Please wait for the administrator of the group to accept your request'
			request_status = False
		except:
			groupRequest = GroupsRequestInvitation(
					group = group,
					created_by = request.user,
					to = group.created_by,
					type = 'R'
				)
			groupRequest.save()

			for admin in group.admins.all():
				ownernotification = Notification(
						user = admin,
						created_by = request.user,
						notification_type = 'GURA',
						object_id = groupRequest.id,
						object_type = 'Group Invitation',
						object_name = group.name,
						message = request.user.first_name+' requested membership to the group '+group.name
					)
				ownernotification.save()
			request_status = True
			message = 'Successfully sent request group admin'

		data['response_message'] = message
		data['request_status'] = request_status

		send_data = json.dumps(data)
		send_json = json.loads(send_data)

		return Response(send_json,status=status.HTTP_200_OK)

group_request_access = GroupRequestAccess.as_view()

class GroupGrantAccess(APIView):

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def get(self, request, pk, id, format=None):
		data = {}
		group = self.get_object(pk)
		groupRequest = GroupsRequestInvitation.objects.get(group=group,created_by__id=id,type='R')

		ruser = groupRequest.created_by
		access = request.GET.get('accept')

		if ruser in group.members.all():
			message = 'User already a member of this group.'
			request_status = False
		else:
			if groupRequest.accept == 'N':
				message = "User's request has been declined."
				request_status = False
			else:
				if access=='true':
					groupRequest.accept = 'Y'
					message = request.user.first_name + ' granted membership access the group '+group.name
				else:
					groupRequest.accept = 'N'
					message = request.user.first_name + ' declined membership access the group '+group.name
				groupRequest.save()
				group.members.add(ruser)

				usernotification = Notification(
					user = groupRequest.created_by,
					created_by = request.user,
					notification_type = 'GUGA',
					object_id = groupRequest.id,
					object_type = 'Group Invitation',
					object_name = group.name,
					message = message
				)
				usernotification.save()
				request_status = True

		data['response_message'] = message
		data['request_status'] = request_status

		send_data = json.dumps(data)
		send_json = json.loads(send_data)

		return Response(send_json,status=status.HTTP_200_OK)
		
group_grant_access = GroupGrantAccess.as_view()


#######################################GROUP INVITE##############################################

class SendInviteView(APIView):
	#serializer_class = EventInviteSerializer

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		group = self.get_object(pk)

		'''
		userids = [gi.to.id for gi in GroupsRequestInvitation.objects.filter(group=group)]
		members = [member.id for member in group.members.all()]
		exids = userids + members

		users = GolfUser.objects.filter(is_private = False).exclude(id__in = exids)
		'''
		
		users = GolfUser.objects.filter(is_private=False).exclude(id = request.user.id)
		serializer = UserSerializer(users, many=True)

		return Response(serializer.data)

	def post(self, request, pk, format=None):
		group = self.get_object(pk)
		data = {}
		try:
			user_ids = request.data['userids']
			for userid in user_ids:
				user = GolfUser.objects.get(id = int(userid))

				try:
					groupRequest = GroupsRequestInvitation.objects.get(group=group,to=user,type='I',accept='M')
				except:
					groupRequest = GroupsRequestInvitation(
							group = group,
							created_by = request.user,
							to = user,
							type = 'I'
						)
					groupRequest.save()

					if user.notify_invite_event:
						usernotification = Notification(
								user = user,
								created_by = request.user,
								notification_type = 'GURI',
								object_id = group.id,
								object_type = 'Group Invitation',
								object_name = group.name,
								message = ' You have been invited to the group  '+group.name
							)
						usernotification.save()

			useremails = request.data['useremails']
			try:
				message = request.data['message']
			except:
				message = ''

			mail_message = ''

			for email in useremails:
				try:
					user = GolfUser.objects.get(email=email)
					try:
						groupRequest = GroupsRequestInvitation.objects.get(group=group,to=user,type='I',accept='M')
					except:
						groupRequest = GroupsRequestInvitation(
								group = group,
								created_by = request.user,
								to = user,
								type = 'I'
							)
						groupRequest.save()

					if user.notify_invite_event:
						usernotification = Notification(
								user = user,
								created_by = request.user,
								notification_type = 'GURI',
								object_id = group.id,
								object_type = 'Group Invitation',
								object_name = group.name,
								message = ' You have been invited to the group  '+group.name
							)
						usernotification.save()
					mail_message = mail_message + str(email) +" -user is already part of the system.\n"
				except:
					try:
						invite = Invite.objects.get(email=email,object_id=group.id,object_type='Group')
						mail_message = mail_message + str(email) +" -invite has already been sent.\n"
					except:
						invite = Invite(
								email = email,
								object_id = group.id,
								object_name = group.name,
								object_type = 'Group',
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

			data['response_message'] = 'Invitation sent successfully'
			data['mail_message'] = mail_message
			data['request_status'] = True

			send_data = json.dumps(data)
			send_json = json.loads(send_data)

			return Response(send_data, status=status.HTTP_200_OK)
		except:
			from sys import exc_info
			message = str(exc_info())
			data['response_message'] = message
			data['request_status'] = False

			send_data = json.dumps(data)
			send_json = json.loads(send_data)

			return Response(send_json, status=status.HTTP_400_BAD_REQUEST)

send_invite_view = SendInviteView.as_view()

class AcceptInvitationView(APIView):

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		data = {}
		group = self.get_object(pk)
		groupRequest = GroupsRequestInvitation.objects.get(group=group,type='I',to=request.user)

		accept = request.GET.get('accept')

		if accept=='true':
			groupRequest.accept = 'Y'
			group.members.add(request.user)
			data['response_message'] = 'You have successfully accepted the invitation.'
			data['request_status'] = True
			message = request.user.first_name+" have accepted your invitation for the group "+group.name
		else:
			groupRequest.accept = 'N'
			data['response_message'] = 'You have successfully declined the invitation.'
			data['request_status'] = False
			message = request.user.first_name+" have declined your invitation for the group "+group.name
		groupRequest.save()

		if groupRequest.created_by.notify_accept_invitation:
			usernotification = Notification(
				user = groupRequest.created_by,
				created_by = request.user,
				notification_type = 'GUAI',
				object_id = group.id,
				object_type = 'Group',
				object_name = group.name,
				message = message
			)
			usernotification.save()

		send_data = json.dumps(data)
		send_json = json.loads(send_data)
		return Response(send_json, status=status.HTTP_200_OK)

accept_invite_view = AcceptInvitationView.as_view()

class SendInviteViaMailView(APIView):

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def post(self, request, pk, format=None):
		group = self.get_object(pk)
		data = {}
		useremails = request.data['useremails']
		try:
			message = request.data['message']
		except:
			message = ''

		for email in useremails:
			try:
				invite = Invite.objects.get(email=email,object_id=group.id,object_type='Group')
			except:
				invite = Invite(
						email = email,
						object_id = group.id,
						object_name = group.name,
						object_type = 'Group',
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


