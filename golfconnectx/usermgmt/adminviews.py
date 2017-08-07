import json

from django.shortcuts import render
from django.template import Template, RequestContext
from django.template.response import TemplateResponse, HttpResponse
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.core.exceptions import ObjectDoesNotExist
from django.views.generic import ListView, CreateView, UpdateView, View
from django.template.loader import render_to_string
from django.conf import settings as my_settings

from usermgmt.models import GolfUser, UserRole
from common.models import BubbleCategory

from usermgmt.adminforms import UserForm, UserUpdateForm
from courses.models import Courses

class UsersListView(ListView):
	"""
    List the Users in the site.
    """
	template_name = 'admin/usermgmt/user_list.html'
	
	def get_queryset(self):
		return GolfUser.objects.all().exclude(is_superuser=True).order_by('first_name')

users_list_view = UsersListView.as_view()

class UserAddView(CreateView):

	model = GolfUser
	form_class =  UserForm
	template_name = 'admin/usermgmt/user_form.html'

	def get_success_url(self):
		return reverse('users')

	def get_form_kwargs(self):
		kwargs = super(UserAddView, self).get_form_kwargs()
		return kwargs

	def get_context_data(self, **kwargs):
		context = super(UserAddView, self).get_context_data(**kwargs)
		context['roles'] = UserRole.objects.all()
		context['categories'] = BubbleCategory.objects.all()

		return context

	def post(self,request):
		data = {}

		form  = UserForm(request.POST)
		if form.is_valid():
			obj = form.save()
			
			obj.set_password(request.POST.get('password'))
			
			role = UserRole.objects.get(id = int(request.POST.get('user_role')))
			obj.user_role = role

			obj.save()
			return HttpResponseRedirect(self.get_success_url())
		else:
			return HttpResponse(data, self.template_name)
	
user_add_view = UserAddView.as_view()

class UserUpdateView(UpdateView):
	model = GolfUser
	form_class =  UserUpdateForm
	template_name = 'admin/usermgmt/user_form.html'

	def get_success_url(self):
		return reverse('users')

	def get_context_data(self, **kwargs):
		context = super(UserUpdateView, self).get_context_data(**kwargs)
		context['roles'] = UserRole.objects.all()
		context['categories'] = BubbleCategory.objects.all()
		return context

	def post(self,request,pk):
		data = {}
		user = self.get_object()
		form  = UserUpdateForm(request.POST,instance=user)
		if form.is_valid():
			obj = form.save()
						
			role = UserRole.objects.get(id = int(request.POST.get('user_role')))
			obj.user_role = role

			obj.save()
			return HttpResponseRedirect(self.get_success_url())
		else:
			return HttpResponse(data, content_type='application/x-json')

user_update_view = UserUpdateView.as_view()

class UserDeleteView(View):

    model = GolfUser

    def get_success_url(self):
		return reverse('users')

    def get(self, request, *args, **kwargs):

    	try:
    		user = GolfUser.objects.get(id = kwargs['pk'])
    		user.delete()
    		return HttpResponseRedirect(self.get_success_url())
        except ObjectDoesNotExist:
            raise Http404


user_delete_view = UserDeleteView.as_view()

class UserPromoteView(View):

    def get(self, request, *args, **kwargs):
    	data = {}
    	try:
    		user = GolfUser.objects.get(id = kwargs['pk'])
    		user.is_staff = True
    		user.save()
    		data['success'] = 1
    	except:
            data['success'] = 0
    	
    	return HttpResponse(json.dumps(data), content_type='application/x-json')


user_promote_view = UserPromoteView.as_view()


class CourseAdminsView(ListView):
	"""
    List the Users in the site.
    """
	template_name = 'admin/course_admin/course_admins_list.html'
	
	def get_queryset(self):
		return GolfUser.objects.filter(is_staff=True).exclude(is_superuser=True).order_by('first_name')

courses_admins_view = CourseAdminsView.as_view()

class CourseAdminCoursesView(View):
	template_name = 'admin/course_admin/course_admin_courses_list.html'

	def get_queryset(self):
		return GolfUser.objects.filter(is_staff=True).exclude(is_superuser=True).order_by('first_name')

	def get(self,request,*args,**kwargs):
		data = {}
		user = GolfUser.objects.get(id = kwargs['pk'])

		courses = Courses.objects.filter(admin=user).order_by('name')
		data['courses'] = courses
		data['suser'] = user
		return render(request, self.template_name,data)


course_admins_courses_view = CourseAdminCoursesView.as_view()

class CourseAdminAddCoursesView(View):

	def get(self,request,*args,**kwargs):
		data = {}
		user = GolfUser.objects.get(id = kwargs['pk'])
		courses = Courses.objects.filter(admin=None).order_by('name')
		courses = courses.exclude(admin=user)
		sdata = {'courses':courses,'suser':user}
		data['html']=render_to_string('admin/course_admin/course_admin_courses_add.html',sdata,context_instance=RequestContext(request))

		return HttpResponse(json.dumps(data), content_type='application/x-json')

	def post(self, request, *args, **kwargs):
		data = {}
		
		user = GolfUser.objects.get(id = kwargs['pk'])
		try:
			course_ids = request.POST.getlist('courses')
			courses = Courses.objects.filter(id__in=course_ids)
			
			courses.update(admin=user)

			data['success'] = 1
		except:
			data['success'] = 0
		return HttpResponse(json.dumps(data), content_type='application/x-json')

course_admins_add_course_view = CourseAdminAddCoursesView.as_view()

class CourseAdminRemoveCoursesView(View):

	def get(self, request, *args, **kwargs):
		data = {}
		try:
			user = GolfUser.objects.get(id = kwargs['pk'])
			cid = request.GET.get('courseid')
			course = Courses.objects.get(id = int(cid))
			course.admin = None
			course.save()

			data['count'] = Courses.objects.filter(admin=user).count()
			data['success'] = 1
		except:
			data['success'] = 0

		return HttpResponse(json.dumps(data), content_type='application/x-json')

course_admins_remove_course_view = CourseAdminRemoveCoursesView.as_view()