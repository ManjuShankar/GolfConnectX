from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('restapi.usermgmt.profileviews',

	#url(r'^/?$','events_home',name='events_home'),
	url(r'^/?$','profile_details',name='profile_details'),
	url(r'^courses/?$','profile_courses',name='profile_courses'),
	url(r'^posts/?$','profile_posts',name='profile_posts'),
	url(r'^groups/?$','profile_groups',name='profile_groups'),
	url(r'^groups/search/?$','profile_search_groups',name='profile_search_groups'),
	url(r'^friends/?$','profile_friends',name='profile_friends'),
	url(r'^friends/search/?$','profile_search_friends',name='profile_search_friends'),
	url(r'^events/?$','profile_events',name='profile_events'),
	url(r'^courses/(?P<pk>[^/]+)/scores/?$','profile_course_scores',name='profile_course_scores'),
	url(r'^courses/(?P<pk>[^/]+)/settings/?$','profile_course_settings',name='profile_course_settings'),
	url(r'^courses/(?P<pk>[^/]+)/gallery/(?P<cid>[^/]+)/?$','profile_course_scores_gallery',name='profile_course_scores_gallery'),
	url(r'^courses/(?P<pk>[^/]+)/gallery/(?P<cid>[^/]+)/(?P<iid>[^/]+)/?$','profile_course_scores_image',name='profile_course_scores_image'),
	#url(r'^courses/(?P<pk>[^/]+)/gallery/?$','profile_course_scores_gallery',name='profile_course_scores_gallery'),

	url(r'^courses/(?P<pk>[^/]+)/scores/(?P<cid>[^/]+)/?$','profile_course_scores_details',name='profile_course_scores_details'),

)
