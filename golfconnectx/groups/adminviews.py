import json

from django.template import Template, RequestContext
from django.template.response import TemplateResponse
from django.core.urlresolvers import reverse

from django.http import HttpResponse, HttpResponseRedirect
from django.core.exceptions import ObjectDoesNotExist
from django.views.generic import ListView, CreateView, UpdateView, View
from django.shortcuts import render
from django.template.loader import render_to_string

from groups.adminforms import GroupForm
from posts.adminforms import PostForm

from groups.models import Groups, GroupImages
from courses.models import Courses
from usermgmt.models import GolfUser
from posts.models import Post

class GroupListView(ListView):
	"""
    List the Bubbles in the site.
    """
	template_name = 'admin/groups/groups_list.html'
	
	def get_queryset(self):
		return Groups.objects.all()

groups_list_view = GroupListView.as_view()

def upload_group_cover_image(request):
	data = {}
	
	image = request.FILES['images']

	try:
		image_obj = GroupImages()
		image_obj.name = image.name
		image_obj.image = image
		image_obj.save()
		sdata = {'image':image_obj}

		data['html']=render_to_string('admin/groups/include_group_cover_image.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1
	except:
		data['status'] = 0
	return HttpResponse(json.dumps(data))

def delete_group_cover_image(request):
	
    data={}
    id = request.GET.get('image_id')
    image = GroupImages.objects.get(id = int(id))
    image.delete()    
    data['status'] = 1
    return HttpResponse(json.dumps(data),content_type='application/x-json')

class GroupAddView(CreateView):
	"""
	Creates a new bubble category on the site.
	"""
	model = Groups
	form_class = GroupForm
	template_name = 'admin/groups/group_form.html'

	def get_success_url(self):
		return reverse('groups')

	def get_context_data(self, **kwargs):
		context = super(GroupAddView, self).get_context_data(**kwargs)
		context['courses'] = Courses.objects.all().order_by('name')

		return context

	def post(self,request):
		data = {}

		form  = GroupForm(request.POST)
		if form.is_valid():
			obj = form.save(commit=False)
			obj.created_by = obj.modified_by = request.user

			coverImageId = request.POST.get('cover_image')
			if coverImageId:
				cover_image = GroupImages.objects.get(id = int(coverImageId))
				obj.cover_image = cover_image
			obj.save()
			return HttpResponseRedirect(self.get_success_url())
		else:
			print form.errors
			data = self.get_context_data()
		
		return render(request, self.template_name, {'form': form,'data':data})

groups_add_view = GroupAddView.as_view()


class GroupUpdateView(UpdateView):
	"""
	Creates a new bubble category on the site.
	"""
	model = Groups
	form_class = GroupForm
	template_name = 'admin/groups/group_form.html'

	def get_success_url(self):
		return reverse('groups')

	def get_context_data(self, **kwargs):
		context = super(GroupUpdateView, self).get_context_data(**kwargs)
		context['courses'] = Courses.objects.all().order_by('name')

		return context

	def post(self,request,pk):
		data = {}
		group = self.get_object()
		form  = GroupForm(request.POST,instance=group)
		if form.is_valid():
			obj = form.save(commit=False)
			obj.modified_by = request.user

			coverImageId = request.POST.get('cover_image')
			if coverImageId:
				cover_image = GroupImages.objects.get(id = int(coverImageId))
				obj.cover_image = cover_image

			obj.save()
			return HttpResponseRedirect(self.get_success_url())
		
		return render(request, self.template_name, {'form': form})

groups_update_view = GroupUpdateView.as_view()


class GroupDeleteView(View):

    model = Groups

    def get_success_url(self):
		return reverse('groups')

    def get(self, request, *args, **kwargs):

    	try:
    		group = Groups.objects.get(id = kwargs['pk'])
    		group.delete()
    		return HttpResponseRedirect(self.get_success_url())
        except ObjectDoesNotExist:
            raise Http404

groups_delete_view = GroupDeleteView.as_view()

class GroupMembersView(ListView):

	template_name = 'admin/groups/groups_members.html'
	
	def get_queryset(self):
		group = Groups.objects.get(id = int(self.kwargs['pk']))
		return group.members.all()

	def get_context_data(self, **kwargs):
		context = super(GroupMembersView, self).get_context_data(**kwargs)
		context['group'] = Groups.objects.get(id = int(self.kwargs['pk']))
		return context

groups_members_view = GroupMembersView.as_view()

class GroupMembersRemoveView(View):

	def get(self, request, *args, **kwargs):
		data = {}
		group = Groups.objects.get(id = int(self.kwargs['pk']))
		try:
			user_obj = GolfUser.objects.get(id = int(request.GET.get('user_id')))
			group.members.remove(user_obj)
			data['count'] = group.members.all().count()
			data['success'] = 1
		except:
			data['success'] = 0

		return HttpResponse(json.dumps(data), content_type='application/x-json')

groups_members_remove_view = GroupMembersRemoveView.as_view()


class GroupsPostsView(ListView):
	"""
    List the posts under a group.
    """
	template_name = 'admin/groups/groups_posts_list.html'
	
	def get_queryset(self):
		group = Groups.objects.get(id = int(self.kwargs['pk']))
		return group.posts.all()

	def get_context_data(self, **kwargs):
		context = super(GroupsPostsView, self).get_context_data(**kwargs)
		context['group'] = Groups.objects.get(id = int(self.kwargs['pk']))
		return context

groups_posts_view = GroupsPostsView.as_view()

class GroupsPostsAddView(ListView):
	"""
    List the Campuses in the site.
    """
	template_name = 'admin/groups/groups_posts_add.html'
	
	def get_queryset(self):
		group = Groups.objects.get(id = int(self.kwargs['pk']))
		return group.posts.all()

	def get_context_data(self, **kwargs):
		context = super(GroupsPostsAddView, self).get_context_data(**kwargs)
		context['group'] = group = Groups.objects.get(id = int(self.kwargs['pk']))
		return context

	def post(self, request, *args, **kwargs):
		data = {}
		group = Groups.objects.get(id = int(self.kwargs['pk']))
		try:
			postform  = PostForm(request.POST)
			if postform.is_valid():
				obj = postform.save(commit=False)

				obj.author = request.user
				obj.save()

				group.posts.add(obj)

				data['success'] = 1	
			else:
				data['success'] = 0
		except:
			data['success'] = 0

		return HttpResponse(json.dumps(data), content_type='application/x-json')

groups_posts_add_view = GroupsPostsAddView.as_view()

class GroupsPostsDeleteView(View):

	def get(self, request, *args, **kwargs):
		data = {}
		group = Groups.objects.get(id = int(self.kwargs['pk']))
		try:
			post_obj = Post.objects.get(id = int(request.GET.get('post_id')))
			group.posts.remove(post_obj)
			post_obj.delete()
			
			data['count'] = group.posts.all().count()
			data['success'] = 1
		except:
			data['success'] = 0

		return HttpResponse(json.dumps(data), content_type='application/x-json')

groups_posts_delete_view = GroupsPostsDeleteView.as_view()