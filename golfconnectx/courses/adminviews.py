import json

from django.template import Template
from django.template.response import TemplateResponse
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from django.db.models import Q

from django.core.paginator import Paginator
from django.core.paginator import EmptyPage
from django.core.paginator import PageNotAnInteger

from django.views.generic import ListView, CreateView, UpdateView, View

from courses.adminforms import CourseCategoryForm, CourseForm
from posts.adminforms import PostForm


from courses.models import Courses, CourseCategory
from usermgmt.models import GolfUser
from events.models import Events
from bubbles.models import Bubble
from posts.models import Post
from groups.models import Groups
from restapi.search.views import IndexObject

class CoursesCategoryListView(ListView):
	"""
    List the Campuses in the site.
    """
	template_name = 'admin/courses/category_list.html'
	
	def get_queryset(self):
		return CourseCategory.objects.all().order_by('name')

course_category_list_view = CoursesCategoryListView.as_view()

class CoursesCategoryAddView(CreateView):
	"""
	Adds a new campus to the site.
	"""
	model = CourseCategory
	form_class = CourseCategoryForm
	template_name = 'admin/courses/category_form.html'

	def get_success_url(self):
		return reverse('course_categories_list')

	def form_valid(self, form):
		return super(CoursesCategoryAddView, self).form_valid(form)

course_category_add_view = CoursesCategoryAddView.as_view()

class CoursesCategoryUpdateView(UpdateView):
	"""
	Updates the bubble category information on the site.
	"""
	model = CourseCategory
	form_class = CourseCategoryForm
	template_name = 'admin/courses/category_form.html'

	def get_success_url(self):
		return reverse('course_categories_list')

course_category_edit_view = CoursesCategoryUpdateView.as_view()

class CoursesCategoryDeleteView(View):
	"""
	Delets the selected campus
	"""
	model = CourseCategory

	def get_success_url(self):
		return reverse('course_categories_list')

	def get(self, request, *args, **kwargs):
		try:
			category = CourseCategory.objects.get(id = kwargs['pk'])
			category.delete()
			return HttpResponseRedirect(self.get_success_url())
		except ObjectDoesNotExist:
			raise Http404

course_category_delete_view = CoursesCategoryDeleteView.as_view()

class CoursesListView(ListView):
	"""
    List the Campuses in the site.
    """
	template_name = 'admin/courses/courses_list.html'
	paginate_by = 10

	def get_queryset(self):
		return Courses.objects.all().order_by('name')

	def get_context_data(self, **kwargs):
		context = super(CoursesListView, self).get_context_data(**kwargs)
		courses = self.get_queryset()
		count = courses.count()
		paginator = Paginator(courses, self.paginate_by)

		page = self.request.GET.get('page')

		try:
			courses = paginator.page(page)
		except PageNotAnInteger:
			courses = paginator.page(1)
		except EmptyPage:
			courses = paginator.page(paginator.num_pages)

		index = courses.number - 1
		max_index = len(paginator.page_range)
		start_index = index - 5 if index >= 5 else 0
		end_index = index + 5 if index <= max_index - 5 else max_index
		page_range = paginator.page_range[start_index:end_index]

		context['objects'] = courses
		context['page_range'] = page_range
		context['count'] = count
		return context

courses_list_view = CoursesListView.as_view()

class CoursesAddView(CreateView):
	"""
	Creates a new course on the site.
	"""
	model = Courses
	form_class = CourseForm
	template_name = 'admin/courses/courses_form.html'

	def get_success_url(self):
		return reverse('courses')

	def post(self,request):
		form  = CourseForm(request.POST)
		if form.is_valid():
			obj = form.save(commit=False)
			user = request.user

			obj.created_by = user
			obj.save()
			return HttpResponseRedirect(self.get_success_url())
		else:
			print form.errors
		
		return render(request, self.template_name, {'form': form})

courses_add_view = CoursesAddView.as_view()

class CoursesUpdateView(UpdateView):
	"""
	Updates the course information on the site.
	"""
	model = Courses
	form_class = CourseForm
	template_name = 'admin/courses/courses_form.html'

	def get_success_url(self):
		return reverse('courses')

	def post(self,request,pk):
		course = self.get_object()
		form  = CourseForm(request.POST,instance=course)
		if form.is_valid():
			obj = form.save(commit=False)

			obj.save()
			return HttpResponseRedirect(self.get_success_url())
		
		return render(request, self.template_name, {'form': form})

courses_update_view = CoursesUpdateView.as_view()


class CourseDeleteView(View):

    model = Courses

    def get_success_url(self):
		return reverse('courses')

    def get(self, request, *args, **kwargs):

    	try:
    		course = Courses.objects.get(id = kwargs['pk'])
    		course.delete()
    		return HttpResponseRedirect(self.get_success_url())
        except ObjectDoesNotExist:
            raise Http404


courses_delete_view = CourseDeleteView.as_view()


class CoursesSearchView(View):
	"""
    List the Campuses in the site.
    """
	template_name = 'admin/courses/courses_list.html'
	paginate_by = 10

	def get(self, request, *args, **kwargs):
		data = {}

		keyword = request.GET.get('kw')

		q =(Q(name__icontains=keyword)|Q(description__icontains=keyword))

		courses = Courses.objects.filter(q)
		count = courses.count()
		paginator = Paginator(courses, self.paginate_by)

		page = request.GET.get('page')

		try:
			paginated_courses = paginator.page(page)
		except PageNotAnInteger:
			paginated_courses = paginator.page(1)
		except EmptyPage:
			paginated_courses = paginator.page(paginator.num_pages)

		index = paginated_courses.number - 1
		max_index = len(paginator.page_range)
		start_index = index - 5 if index >= 5 else 0
		end_index = index + 5 if index <= max_index - 5 else max_index
		page_range = paginator.page_range[start_index:end_index]

		data['object_list'] = paginated_courses
		data['objects'] = paginated_courses
		data['page_range'] = page_range
		data['count'] = count

		data['search'] = True
		data['kw'] = keyword

		return render(request, self.template_name, data)

search_courses_view = CoursesSearchView.as_view()

class UpgradeToPremium(View):

	def get(self,request):
		data = {}
		try:
			courseid = request.GET.get('courseid')
			
			course = Courses.objects.get(id = int(courseid))
			course.is_premium = True
			course.save()

			searchindex = IndexObject('course',course.id)

			data['success'] = 1
		except:
			data['success'] = 0

		return HttpResponse(json.dumps(data), content_type='application/x-json')



upgrade_to_premium = UpgradeToPremium.as_view()
class CoursesEventsView(ListView):
	"""
    List the Campuses in the site.
    """
	template_name = 'admin/courses/courses_events_list.html'
	
	def get_queryset(self):
		course = Courses.objects.get(id = int(self.kwargs['pk']))
		return course.events.all()

	def get_context_data(self, **kwargs):
		context = super(CoursesEventsView, self).get_context_data(**kwargs)
		context['course'] = Courses.objects.get(id = int(self.kwargs['pk']))
		return context

courses_events_view = CoursesEventsView.as_view()

class CoursesEventsAddView(ListView):
	"""
    List the Campuses in the site.
    """
	template_name = 'admin/courses/courses_events_add.html'
	
	def get_queryset(self):
		course = Courses.objects.get(id = int(self.kwargs['pk']))
		return course.events.all()

	def get_context_data(self, **kwargs):
		context = super(CoursesEventsAddView, self).get_context_data(**kwargs)
		context['course'] = course = Courses.objects.get(id = int(self.kwargs['pk']))
		context['events'] = Events.objects.all().exclude(id__in=course.events.all())
		return context

	def post(self, request, *args, **kwargs):
		data = {}
		course = Courses.objects.get(id = int(self.kwargs['pk']))
		try:
			events = request.POST.getlist('courseevents')
			for event in events:
				event_obj = Events.objects.get(id = int(event))
				course.events.add(event_obj)
			data['success'] = 1
		except:
			data['success'] = 0

		return HttpResponse(json.dumps(data), content_type='application/x-json')


courses_events_add_view = CoursesEventsAddView.as_view()

class CoursesEventsRemoveView(View):

	def get(self, request, *args, **kwargs):
		data = {}
		course = Courses.objects.get(id = int(self.kwargs['pk']))
		try:
			event_obj = Events.objects.get(id = int(request.GET.get('event_id')))
			course.events.remove(event_obj)
			data['count'] = course.events.all().count()
			data['success'] = 1
		except:
			data['success'] = 0

		return HttpResponse(json.dumps(data), content_type='application/x-json')

courses_events_remove_view = CoursesEventsRemoveView.as_view()

class CoursesGroupsView(ListView):
	"""
    List the Campuses in the site.
    """
	template_name = 'admin/courses/courses_groups_list.html'
	
	def get_queryset(self):
		course = Courses.objects.get(id = int(self.kwargs['pk']))
		groups = Groups.objects.filter(course = course)
		return groups

	def get_context_data(self, **kwargs):
		context = super(CoursesGroupsView, self).get_context_data(**kwargs)
		context['course'] = Courses.objects.get(id = int(self.kwargs['pk']))
		return context

courses_groups_view = CoursesGroupsView.as_view()

class CoursesGroupsAddView(ListView):
	"""
    List the Campuses in the site.
    """
	template_name = 'admin/courses/courses_groups_add.html'
	
	def get_queryset(self):
		course = Courses.objects.get(id = int(self.kwargs['pk']))
		return course.groups.all()

	def get_context_data(self, **kwargs):
		context = super(CoursesGroupsAddView, self).get_context_data(**kwargs)
		context['course'] = course = Courses.objects.get(id = int(self.kwargs['pk']))
		context['groups'] = Bubble.objects.all().exclude(id__in=course.groups.all())
		return context

	def post(self, request, *args, **kwargs):
		data = {}
		course = Courses.objects.get(id = int(self.kwargs['pk']))
		try:
			groups = request.POST.getlist('coursegroups')
			for group in groups:
				group_obj = Bubble.objects.get(id = int(group))
				course.groups.add(group_obj)
			data['success'] = 1
		except:
			data['success'] = 0

		return HttpResponse(json.dumps(data), content_type='application/x-json')


courses_groups_add_view = CoursesGroupsAddView.as_view()

class CoursesGroupsRemoveView(View):

	def get(self, request, *args, **kwargs):
		data = {}
		course = Courses.objects.get(id = int(self.kwargs['pk']))
		try:
			bubble_obj = Bubble.objects.get(id = int(request.GET.get('group_id')))
			course.groups.remove(bubble_obj)
			data['count'] = course.groups.all().count()
			data['success'] = 1
		except:
			data['success'] = 0

		return HttpResponse(json.dumps(data), content_type='application/x-json')

courses_groups_remove_view = CoursesGroupsRemoveView.as_view()

class CoursesFollowersView(ListView):
	"""
    List the Campuses in the site.
    """
	template_name = 'admin/courses/courses_followers_list.html'
	
	def get_queryset(self):
		course = Courses.objects.get(id = int(self.kwargs['pk']))
		return course.followers.all()

	def get_context_data(self, **kwargs):
		context = super(CoursesFollowersView, self).get_context_data(**kwargs)
		context['course'] = Courses.objects.get(id = int(self.kwargs['pk']))
		return context

courses_followers_view = CoursesFollowersView.as_view()

class CoursesFollowersRemoveView(View):

	def get(self, request, *args, **kwargs):
		data = {}
		course = Courses.objects.get(id = int(self.kwargs['pk']))
		try:
			user_obj = GolfUser.objects.get(id = int(request.GET.get('user_id')))
			course.followers.remove(user_obj)
			data['count'] = course.followers.all().count()
			data['success'] = 1
		except:
			data['success'] = 0

		return HttpResponse(json.dumps(data), content_type='application/x-json')

courses_followers_remove_view = CoursesFollowersRemoveView.as_view()

class CoursesPostsView(ListView):
	"""
    List the posts under a course.
    """
	template_name = 'admin/courses/courses_posts_list.html'
	
	def get_queryset(self):
		course = Courses.objects.get(id = int(self.kwargs['pk']))
		return course.posts.all()

	def get_context_data(self, **kwargs):
		context = super(CoursesPostsView, self).get_context_data(**kwargs)
		context['course'] = Courses.objects.get(id = int(self.kwargs['pk']))
		return context

courses_posts_view = CoursesPostsView.as_view()

class CoursesPostsAddView(ListView):
	"""
    List the Campuses in the site.
    """
	template_name = 'admin/courses/courses_posts_add.html'
	
	def get_queryset(self):
		course = Courses.objects.get(id = int(self.kwargs['pk']))
		return course.posts.all()

	def get_context_data(self, **kwargs):
		context = super(CoursesPostsAddView, self).get_context_data(**kwargs)
		context['course'] = course = Courses.objects.get(id = int(self.kwargs['pk']))
		return context

	def post(self, request, *args, **kwargs):
		data = {}
		course = Courses.objects.get(id = int(self.kwargs['pk']))
		try:
			postform  = PostForm(request.POST)
			if postform.is_valid():
				obj = postform.save(commit=False)

				obj.author = request.user
				obj.save()

				course.posts.add(obj)

				data['success'] = 1	
			else:
				data['success'] = 0
		except:
			data['success'] = 0

		return HttpResponse(json.dumps(data), content_type='application/x-json')

courses_posts_add_view = CoursesPostsAddView.as_view()

class CoursesPostsDeleteView(View):

	def get(self, request, *args, **kwargs):
		data = {}
		course = Courses.objects.get(id = int(self.kwargs['pk']))
		try:
			post_obj = Post.objects.get(id = int(request.GET.get('post_id')))
			course.posts.remove(post_obj)
			post_obj.delete()
			
			data['count'] = course.posts.all().count()
			data['success'] = 1
		except:
			data['success'] = 0

		return HttpResponse(json.dumps(data), content_type='application/x-json')

courses_posts_delete_view = CoursesPostsDeleteView.as_view()