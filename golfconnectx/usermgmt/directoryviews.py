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

from usermgmt.models import GolfUser, FriendRequest, Notification
from posts.models import Post
from groups.models import Groups

class DirectoryView(LoginRequiredMixin, View):
	template_name = 'usermgmt/directory/directory.html'

	def get(self, request):
		data = {}
		users = GolfUser.objects.filter(is_private = False).order_by('first_name').exclude(id = request.user.id)
		data['users'] = users
		return render(request, self.template_name,data)

directory = DirectoryView.as_view()

class DirectoryProfileView(LoginRequiredMixin, View):
	template_name = 'usermgmt/directory/directory_profile.html'

	def get(self, request, pk):
		data = {}
		user = GolfUser.objects.get(id = pk)
		data['user'] = user
		if user in request.user.friends.all():
			data['is_friend'] = True
		try:
			friendrequest = FriendRequest.objects.get(to_user = user,from_user = request.user)
			data['friend_request'] = True
		except:
			pass
 		return render(request, self.template_name,data)

directory_profile = DirectoryProfileView.as_view()

class DirectoryPostsView(LoginRequiredMixin,View):

	def get(self, request, pk):
		data = {}
		user = GolfUser.objects.get(id = pk)
		posts = Post.objects.filter(author = user).order_by('-created')
		sdata = {'posts': posts}

		data['html']=render_to_string('usermgmt/profile/ajax_profile_posts_list.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1

		return HttpResponse(json.dumps(data), content_type='application/x-json')

directory_posts = DirectoryPostsView.as_view()

class DirectoryGroupsView(LoginRequiredMixin,View):

	def get(self, request, pk):
		data = {}

		user = GolfUser.objects.get(id = pk)
		q = (Q(created_by=user)|Q(members = user)|Q(admins = user))
		groups = Groups.objects.filter(q,is_private=False).order_by('-id').distinct()

		groups_lists = [groups[x:x+7] for x in range(0, (groups.count()),7)]
		glen = range(len(groups_lists))

		sdata = {'groups_lists':groups_lists,'glen':glen}

		data['html']=render_to_string('usermgmt/profile/ajax_profile_groups_list.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1

		return HttpResponse(json.dumps(data), content_type='application/x-json')

directory_groups = DirectoryGroupsView.as_view()

class SendFriendRequest(View):

	def get_object(self, pk):
		try:
			return GolfUser.objects.get(pk=pk)
		except GolfUser.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		user = self.get_object(pk)

		try:
			friendrequest = FriendRequest.objects.get(to_user = user,from_user = request.user)
			status = 0			
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
				object_id = friendrequest.id,
				object_type = 'Friend Request',
				message = request.user.first_name + ' Sent you a friend request',
				object_name = user.first_name,
				created_by = request.user,
			)
			notification.save()

			status = 1

		data = {'status':status}

		return HttpResponse(json.dumps(data), content_type='application/x-json')

send_friend_request = SendFriendRequest.as_view()