import json
from datetime import datetime

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
from django.core.paginator import Paginator

from courses.models import Courses, CourseUserDetails, CourseScores
from common.mixins import LoginRequiredMixin

class CourseHome(LoginRequiredMixin,View):
	template_name = 'courses/courseHome.html'

	def get(self, request):
		data = {}
		
		return render(request, self.template_name,data)

course_list = CourseHome.as_view()

class GetCoursesView(LoginRequiredMixin,View):
	paginate_by = 100

	def get(self, request):
		data = {}

		courses = Courses.objects.extra(select={'Premium': "is_premium = True", 'Basic': "is_premium = False"})
		courses = courses.extra(order_by = ['Basic', 'Premium','name'])[:300]

		paginator = Paginator(courses, self.paginate_by)
		page = request.GET.get('page',1)

		pcourses = paginator.page(page)

		sdata = {'courses': courses}

		data['html']=render_to_string('courses/course_list.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1
		if courses:
			course = courses[0]
			data['course_id'] = course.id

		return HttpResponse(json.dumps(data), content_type='application/x-json')

get_courses = GetCoursesView.as_view()

class CourseDetails(LoginRequiredMixin,View):

	def get(self, request, pk):
		try:
			data = {}
			course = Courses.objects.get(id = pk)
			is_following = False

			cud = course.get_user_details(request.user)

			sdata = {'course':course,'cud':cud}

			data['html']=render_to_string('courses/course_details.html',sdata,context_instance=RequestContext(request))
			data['status'] = 1
		except:
			from sys import exc_info
			data['error'] = str(exc_info())
			data['status'] = 0
		return HttpResponse(json.dumps(data), content_type='application/x-json')

course_details = CourseDetails.as_view()

class CourseSearch(LoginRequiredMixin,View):

	def get(self, request):
		data = {}
		keyword = request.GET.get('kw')

		q =(Q(name__icontains=keyword)|Q(description__icontains=keyword)|Q(category__name__icontains=keyword))
		courses = Courses.objects.filter(q).order_by('name').distinct()

		courses = courses.extra(select={'Premium': "is_premium = True", 'Basic': "is_premium = False"})
		courses = courses.extra(order_by = ['Basic', 'Premium','name'])

		sdata = {'courses': courses}

		data['html']=render_to_string('courses/course_list.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1

		return HttpResponse(json.dumps(data), content_type='application/x-json')

search_courses = CourseSearch.as_view()

class FollowCourse(LoginRequiredMixin,View):

	def get(self, request, pk):
		data = {}

		course = Courses.objects.get(id = pk)
		user = request.user
		try:
			cud = CourseUserDetails.objects.get(user=user,course=course)
		except:
			cud = CourseUserDetails()
			cud.course = course
			cud.user = user
			cud.save()

		if cud.is_following == True:
			cud.is_following =False
			status = 0
		else:
			cud.is_following =True
			status = 1
		cud.save()

		return HttpResponse(status)

follow_course = FollowCourse.as_view()

class AddCourseScore(LoginRequiredMixin,View):

	def post(self,request,pk):
		data = {}
		course = Courses.objects.get(id = pk)

		cud = course.get_user_details(request.user)

		cs = CourseScores()
		is_favorite = request.POST.get('is_favorite')
		is_visited = request.POST.get('is_visited')

		score = request.POST.get('score')
		score_date = request.POST.get('date')
		if score_date:
			datetimeobject = datetime.strptime(score_date,'%m/%d/%Y')
			score_date = datetimeobject.strftime('%Y-%m-%d')

		notes = request.POST.get('course_notes')

		cs = CourseScores(
				course = course,
				user = request.user,
				played_on = score_date,
				score = score,
			)
		cs.save()

		if score:
			cud.latest_score = score
			cud.latest_score_date = score_date
			cud.notes = notes
			cud.is_played = True

		if is_favorite:
			cud.is_favorite = True
		else:
			cud.is_favorite = False


		if cud.top_score == None or cud.top_score < int(score):
			print cud.top_score
			print score

			cud.top_score = score
			cud.top_score_date = score_date
		cud.save()

		data['status'] = 1
		data['course_id'] = course.id
		return HttpResponse(json.dumps(data), content_type='application/x-json')

add_score = AddCourseScore.as_view()