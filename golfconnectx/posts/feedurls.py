from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('posts.views',

	url(r'^/?$','feeds_home',name='ajax_feeds_home'),#Details of the post.
	url(r'^search/?$','search_posts',name='ajax_search_posts'),
	url(r'^load-posts/?$','load_posts',name='ajax_load_posts'),
)