from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('usermgmt.profileviews',

	url(r'^/?$','profile_details',name='ajax_profile_details'),
	url(r'^courses/?$','profile_courses',name='ajax_profile_courses'),
	url(r'^course-details/','profile_course_details',name='ajax_profile_course_details'),
	url(r'^groups/?$','profile_groups',name='ajax_profile_groups'),
	url(r'^posts/?$','profile_posts',name='ajax_profile_posts'),
	url(r'^friends/?$','profile_friends',name='ajax_profile_friends'),
	url(r'^events/?$','profile_events',name='ajax_profile_events'),
)