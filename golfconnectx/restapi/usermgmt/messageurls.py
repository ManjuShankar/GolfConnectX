from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('restapi.usermgmt.messageviews',

	url(r'^/?$','conversations',name='conversations'),
	url(r'^new-conversation/?$','new_conversation',name='new_conversation'),

	url(r'^delete-conversations/?$','delete_conversations',name='delete_conversations'),

	url(r'^(?P<pk>[^/]+)/?$','conversation_details',name='conversation_details'),
	url(r'^(?P<pk>[^/]+)/new-message/?$','new_message',name='new_message'),
)