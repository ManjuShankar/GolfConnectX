from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('posts.views',

	url(r'^create/?$','posts_create',name='ajax_create_post'),#Details of the post.

)