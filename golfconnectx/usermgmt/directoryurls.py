from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('usermgmt.directoryviews',

	url(r'^/?$','directory',name='ajax_directory'),
	url(r'^(?P<pk>[^/]+)/?$','directory_profile',name='ajax_directory_profile'),
	url(r'^(?P<pk>[^/]+)/posts/?$','directory_posts',name='ajax_directory_posts'),
	url(r'^(?P<pk>[^/]+)/groups/?$','directory_groups',name='ajax_directory_groups'),

	url(r'^(?P<pk>[^/]+)/send-friend-request/?$','send_friend_request',name='ajax_send_friend_request'),
	
)