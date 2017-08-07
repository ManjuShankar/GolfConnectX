from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('forums.views',

	url(r'^/?$','forums_list',name='ajax_forums_list'),
	url(r'^(?P<slug>[-\w]+)/?$','forum_detail',name='ajax_forum_detail'),

)