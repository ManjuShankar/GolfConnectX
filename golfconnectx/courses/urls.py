from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('courses.views',

	url(r'^/?$','course_list',name='course_list'),
	url(r'^get-courses/?$','get_courses',name='ajax_get_courses'),
	url(r'^search/?$','search_courses',name='ajax_course_search'),
	url(r'^(?P<pk>[^/]+)/?$','course_details',name='frontend_course_details'),
	url(r'^(?P<pk>[^/]+)/follow/?$','follow_course',name='ajax_follow_course'),
	url(r'^(?P<pk>[^/]+)/add-score/?$','add_score',name='ajax_add_score'),
)