from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('restapi.courses.views',

	url(r'^/?$','courses_home',name='courses_home'),
	url(r'^old/?$','old_courses_home',name='old_courses_home'),
	url(r'^search/?$','course_search',name='course_search'),
	url(r'^admin-courses/?$','course_admin_courses',name='course_admin_courses'),
	url(r'^(?P<pk>[^/]+)/?$','course_details',name='course_detail'),
	url(r'^(?P<pk>[^/]+)/edit/?$','course_edit',name='course_edit'),

	url(r'^(?P<pk>[^/]+)/add-course-score/?$','add_course_score',name='add_course_score'),
	url(r'^(?P<pk>[^/]+)/upload-course-cover-image/?$','upload_course_cover_image',name='upload_course_cover_image'),

	url(r'^(?P<pk>[^/]+)/events/?$','course_events',name='course_events'),
	url(r'^(?P<pk>[^/]+)/events/upcoming/?$','course_upcoming_events',name='course_upcoming_events'),
	url(r'^(?P<pk>[^/]+)/events/past?$','course_past_events',name='course_past_events'),

	url(r'^(?P<pk>[^/]+)/groups/?$','course_groups',name='course_groups'),

	url(r'^(?P<pk>[^/]+)/posts/?$','course_posts',name='course_posts'),
	url(r'^(?P<pk>[^/]+)/posts/search/?$','course_search_posts',name='course_search_posts'),
	
	url(r'^(?P<pk>[^/]+)/follow/?$','follow_course',name='follow_course'),
	url(r'^(?P<pk>[^/]+)/followers/?$','course_followers',name='course_followers'),

)