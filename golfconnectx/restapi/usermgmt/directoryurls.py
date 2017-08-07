from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('restapi.usermgmt.directoryviews',

	url(r'^/?$','user_profiles',name='user_profiles'),
	url(r'^search/?$','search_profiles',name='search_profiles'),
	url(r'^send-friend-request/?$','send_multiple_friend_request',name='send_multiple_friend_request'),
	url(r'^(?P<pk>[^/]+)/?$','user_profile',name='user_profile'),

	url(r'^(?P<pk>[^/]+)/posts/?$','user_posts',name='user_posts'),
	url(r'^(?P<pk>[^/]+)/groups/?$','user_groups',name='user_groups'),
	url(r'^(?P<pk>[^/]+)/friends/?$','user_friends',name='user_friends'),
	url(r'^(?P<pk>[^/]+)/events/?$','user_events',name='user_events'),
	url(r'^(?P<pk>[^/]+)/courses/?$','user_courses',name='user_courses'),
	
	url(r'^(?P<pk>[^/]+)/send-friend-request/?$','send_friend_request_old',name='send_friend_request_old'),
	url(r'^(?P<pk>[^/]+)/respond-friend-request/?$','respond_friend_request',name='respond_friend_request'),

	url(r'^(?P<pk>[^/]+)/send-message/?$','send_message',name='send_message'),

)