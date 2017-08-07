from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('usermgmt.messageviews',

	url(r'^/?$','conversations',name='ajax_conversations'),
	url(r'^new-conversation/?$','new_conversation',name='ajax_new_conversation'),
	
	url(r'^(?P<pk>[^/]+)/?$','conversation_details',name='ajax_conversation_details'),
	url(r'^(?P<pk>[^/]+)/new-message/?$','new_message',name='ajax_new_message'),
	url(r'^(?P<pk>[^/]+)/delete/?$','conversation_delete',name='ajax_conversation_delete'),
)