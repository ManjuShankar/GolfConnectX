from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('restapi.forums.views',

	url(r'^/?$','forums_home',name='forums_home'),
	url(r'^(?P<slug>[-\w]+)/?$','forum_detail',name='forum_detail'),
	url(r'^(?P<slug>[-\w]+)/add-category/?$','forum_add_category',name='forum_add_category'),
	url(r'^(?P<slug>[-\w]+)/search-category/?$','forum_search_category',name='forum_search_category'),

	url(r'^(?P<slug>[-\w]+)/category/(?P<cid>[^/]+)/?$',
		'forum_list_category_conversations',
		name='forum_list_category_conversations'),

	url(r'^(?P<slug>[-\w]+)/category/(?P<cid>[^/]+)/details/?$',
		'forum_category_details',
		name='forum_category_details'),

	url(r'^(?P<slug>[-\w]+)/category/(?P<cid>[^/]+)/search/?$',
		'forum_search_category_conversations',
		name='forum_search_category_conversations'),

	url(r'^(?P<slug>[-\w]+)/category/(?P<cid>[^/]+)/(?P<id>[^/]+)/?$',
		'forum_category_conversation_details',
		name='forum_category_conversation_details'),

	url(r'^(?P<slug>[-\w]+)/category/(?P<cid>[^/]+)/(?P<id>[^/]+)/comments/?$',
		'forum_category_new_comment',
		name='forum_category_new_comment'),

	url(r'^(?P<slug>[-\w]+)/category/(?P<cid>[^/]+)/(?P<id>[^/]+)/comments/(?P<cmid>[^/]+)?$',
		'forum_category_comment_details',
		name='forum_category_comment_details'),
)