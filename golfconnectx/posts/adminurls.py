from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('posts.adminviews',
	url(r'^posts_admin/?$','posts_list_view',name='posts'),
	url(r'^posts_admin/new/?$','posts_create_view',name='posts_add'),
	url(r'^posts_admin/delete/(?P<pk>[^/]+)$','posts_delete_view',name='posts_delete'),
	url(r'^posts_admin/(?P<pk>[^/]+)$','posts_detail_view',name='posts_details'),
	url(r'^posts_admin/(?P<pk>[^/]+)/comments/add/?$','posts_comment_add_view',name='posts_comment_add'),
)