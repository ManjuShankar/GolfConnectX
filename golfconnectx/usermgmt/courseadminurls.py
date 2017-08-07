from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('usermgmt.adminviews',

	url(r'^/?$','courses_admins_view',name='course_admins'),

	url(r'^(?P<pk>[^/]+)/courses/?$','course_admins_courses_view',name='course_admins_courses'),
	url(r'^(?P<pk>[^/]+)/courses/add/?$','course_admins_add_course_view',name='course_admins_course_add'),
	url(r'^(?P<pk>[^/]+)/courses/remove/?$','course_admins_remove_course_view',name='course_admins_course_remove'),

)