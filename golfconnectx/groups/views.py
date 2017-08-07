import json
from datetime import datetime

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

from groups.models import Groups, GroupImages, GroupFiles
from groups.forms import GroupForm
from courses.models import Courses
from posts.models import Post
from events.forms import EventAddForm
from common.mixins import LoginRequiredMixin
from usermgmt.models import GolfUser

from restapi.search.views import IndexObject

NUMBER_DISPLAYED = 9

class GroupsHome(LoginRequiredMixin,View):
	template_name = 'groups/groupsHome.html'

	def get(self, request):
		data = {}
		return render(request, self.template_name,data)

groups_home = GroupsHome.as_view()

class AjaxLoadGroupsView(LoginRequiredMixin,View):

	def get(self, request):
		data = {}

		q = (Q(created_by=self.request.user)|Q(members = self.request.user)|Q(admins = self.request.user))
		groups = Groups.objects.filter(q).order_by('name').distinct()

		groups_lists = [groups[x:x+9] for x in range(0, (groups.count()),9)]

		glen = range(len(groups_lists))
		sdata = {'groups_lists':groups_lists,'glen':glen}

		data['html']=render_to_string('groups/ajax_groups_list.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1

		return HttpResponse(json.dumps(data), content_type='application/x-json')

ajax_load_groups = AjaxLoadGroupsView.as_view()

class AjaxLoadCoursesView(LoginRequiredMixin,View):

	def get(self,request, *args, **kwargs):
		data = {}
		sdata = {}
		courses = Courses.objects.all().order_by('name')

		groupid = request.GET.get('groupid')
		if groupid:
			group = Groups.objects.get(id = int(groupid))
		else:
			group = False
		sdata['group'] = group

		is_event = request.GET.get('is_event')
		if is_event:
			eventid = request.GET.get('eventid')
			if eventid:
				event = Events.objects.get(id = int(eventid))
			else:
				event = False
			sdata['is_event'] = is_event
			sdata['event'] = event

		sdata['courses'] = courses

		data['html']=render_to_string('groups/ajax_course_list.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1

		return HttpResponse(json.dumps(data), content_type='application/x-json')

ajax_load_courses = AjaxLoadCoursesView.as_view()

@login_required
def upload_group_cover_image(request):
	data = {}
	
	image = request.FILES['images']

	try:
		image_obj = GroupImages()
		image_obj.name = image.name
		image_obj.image = image
		image_obj.save()

		data = {"url":"/site_media/"+str(image_obj.image),"id":image_obj.id,"status":1}
	except:
		data['status'] = 0
	return HttpResponse(json.dumps(data), content_type='application/x-json')

class CreateGroup(LoginRequiredMixin,View):
	template_name = 'groups/group_form.html'

	def get(self, request):
		data = {}
		form = GroupForm()
		data['form'] = form
		members = GolfUser.objects.filter(is_private = False).exclude(id = request.user.id)
		data['members'] = members
		return render(request, self.template_name,data)

	def post(self, request, format=None):

		form  = GroupForm(request.POST)
		if form.is_valid():
			obj = form.save(commit=False)
			obj.created_by = obj.modified_by = request.user
			obj.save()

			coverImageId = request.POST.get('cover_image')
			if coverImageId:
				cover_image = GroupImages.objects.get(id = int(coverImageId))
				obj.cover_image = cover_image

			obj.members.add(request.user)
			obj.admins.add(request.user)
			obj.save()
			searchindex = IndexObject('group',obj.id)

			return HttpResponseRedirect(reverse('ajax_groups_home'))
		return render(request, self.template_name, {'form': form,'data':data})

groups_create = CreateGroup.as_view()

class EditGroup(LoginRequiredMixin,View):
	template_name = 'groups/group_form.html'

	def get(self, request, pk):
		data = {}
		group = Groups.objects.get(id = pk)
		form = GroupForm(instance=group)
		data['group'] = group
		data['form'] = form
		return render(request, self.template_name,data)

	def post(self, request, pk, format=None):
		group = Groups.objects.get(id = pk)

		form  = GroupForm(request.POST,instance=group)
		if form.is_valid():
			obj = form.save(commit=False)
			obj.modified_by = request.user
			obj.save()

			coverImageId = request.POST.get('cover_image')
			if coverImageId:
				cover_image = GroupImages.objects.get(id = int(coverImageId))
				obj.cover_image = cover_image
			obj.save()
			searchindex = IndexObject('group',obj.id)
			
			return HttpResponseRedirect(reverse('ajax_groups_home'))
		return render(request, self.template_name, {'form': form,'data':data})

groups_edit = EditGroup.as_view()

class GroupDetails(LoginRequiredMixin,View):
	template_name = 'groups/group_details.html'

	def get(self, request, pk):
		data = {}
		group = Groups.objects.get(id = pk)
		
		data['group'] = group
		data['user'] = request.user
		return render(request, self.template_name,data)

group_details = GroupDetails.as_view()

class AjaxGroupUploadFile(LoginRequiredMixin,View):

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def post(self,request, pk):
		data = {}
		
		group = Groups.objects.get(id = pk)

		file = request.FILES['file']

		try:
			file_obj = GroupFiles()
			file_obj.name = file.name
			file_obj.file = file
			file_obj.uploaded_by = request.user
			file_obj.save()
			group.files.add(file_obj)

			files = group.files.all().order_by('-uploaded_on')

			sdata = {"files":files}
			data['html']=render_to_string('groups/ajax_files_list.html',sdata,context_instance=RequestContext(request))
			data['status'] = 1
		except:
			data['status'] = 0
		return HttpResponse(json.dumps(data), content_type='application/x-json')

ajax_group_upload_file = AjaxGroupUploadFile.as_view()

class AjaxGroupFilesView(LoginRequiredMixin,View):

	def get(self, request, pk):
		data = {}

		group = Groups.objects.get(id = pk)

		files = group.files.all().order_by('-uploaded_on')
		sdata = {'files':files}

		data['html']=render_to_string('groups/ajax_files_list.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1

		return HttpResponse(json.dumps(data), content_type='application/x-json')

ajax_group_files = AjaxGroupFilesView.as_view()

class AjaxGroupUploadImage(LoginRequiredMixin,View):

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def post(self,request, pk):
		data = {}
		
		group = Groups.objects.get(id = pk)

		image = request.FILES['image']

		try:
			image_obj = GroupImages()
			image_obj.name = image.name
			image_obj.image = image
			image_obj.uploaded_by = request.user
			image_obj.save()
			group.images.add(image_obj)

			images = group.images.all().order_by('-uploaded_on')

			sdata = {"images":images}
			data['html']=render_to_string('groups/ajax_images_list.html',sdata,context_instance=RequestContext(request))
			data['count']=images.count()
			data['status'] = 1
		except:
			data['status'] = 0
		return HttpResponse(json.dumps(data), content_type='application/x-json')

ajax_group_upload_image = AjaxGroupUploadImage.as_view()

class AjaxGroupImagesView(LoginRequiredMixin,View):

	def get(self, request, pk):
		data = {}

		group = Groups.objects.get(id = pk)

		images = group.images.all().order_by('-uploaded_on')
		sdata = {'images':images}

		data['html']=render_to_string('groups/ajax_images_list.html',sdata,context_instance=RequestContext(request))
		data['count'] = images.count()
		data['status'] = 1

		return HttpResponse(json.dumps(data), content_type='application/x-json')

ajax_group_images = AjaxGroupImagesView.as_view()

class AjaxGroupPostsView(LoginRequiredMixin,View):

	def get(self, request, pk):
		data = {}

		group = Groups.objects.get(id = pk)

		posts = group.posts.all().order_by('-id')
		user = request.user

		members = group.members.all()
		sdata = {'posts':posts,'user':user,'group':group,'members':members}

		data['html']=render_to_string('groups/ajax_posts_list.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1

		return HttpResponse(json.dumps(data), content_type='application/x-json')

ajax_group_posts = AjaxGroupPostsView.as_view()

class AjaxAddGroupPost(LoginRequiredMixin,View):

	def post(self, request, pk):
		data = {}

		group = Groups.objects.get(id = pk)
		post = Post()
		title = request.POST.get('group_post_title')
		post.title = title
		post.author = request.user
		post.save()

		group.posts.add(post)

		data['status'] = 1

		return HttpResponse(json.dumps(data), content_type='application/x-json')

ajax_group_add_post = AjaxAddGroupPost.as_view()

class AjaxGroupEventsView(LoginRequiredMixin,View):

	def get(self, request, pk):
		data = {}

		group = Groups.objects.get(id = pk)

		events = group.events.all().order_by('-id')
		user = request.user

		sdata = {'events':events,'user':user,'group':group}

		data['html']=render_to_string('groups/ajax_events_list.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1

		return HttpResponse(json.dumps(data), content_type='application/x-json')

ajax_group_events = AjaxGroupEventsView.as_view()


class AjaxGroupsCreateEvent(View):

	def get_object(self, pk):
		try:
			return Groups.objects.get(pk=pk)
		except Groups.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		data = {}
		sdata = {}
		group = self.get_object(pk)

		eventid = request.GET.get('eventid')
		if eventid:
			event = Events.objects.get(id = int(eventid))
			sdata['event'] = event
			sdata['form'] = EventAddForm(instance=event)
		else:
			sdata['form'] = EventAddForm()

		groups = Groups.objects.filter(id= group.id)

		sdata['groups'] = groups
		sdata['group'] = True

		data['html']=render_to_string('events/event_form.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1
		return HttpResponse(json.dumps(data), content_type='application/x-json')

	def post(self, request, pk, format=None):
		group = self.get_object(pk)
		data = {}

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

			group.events.add(obj)
			obj.event_group_id = group.id
			obj.save()

			data['status'] = 1
		else:
			data['status'] = 0

		return HttpResponse(json.dumps(data), content_type='application/x-json')

ajax_group_create_event = AjaxGroupsCreateEvent.as_view()

class AjaxGroupMembersView(LoginRequiredMixin,View):

	def get(self, request, pk):
		data = {}

		group = Groups.objects.get(id = pk)

		members = group.members.all().order_by('-id')
		user = request.user

		sdata = {'members':members,'user':user,'group':group}

		data['html']=render_to_string('groups/ajax_members_list.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1

		return HttpResponse(json.dumps(data), content_type='application/x-json')

ajax_group_members = AjaxGroupMembersView.as_view()