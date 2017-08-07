from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('groups.adminviews',

	url(r'^/?$','groups_list_view',name='groups'),

	url(r'^upload-cover-image/?$','upload_group_cover_image',name='upload_group_cover_image'),
    url(r'^delete-cover-image/?$', 'delete_group_cover_image', name="delete_group_cover_image"),

	url(r'^new/?$','groups_add_view',name='group_add'),
	url(r'^edit/(?P<pk>[^/]+)$','groups_update_view',name='group_edit'),
	url(r'^delete/(?P<pk>[^/]+)$','groups_delete_view',name='group_delete'),

	url(r'^(?P<pk>[^/]+)/members/?$','groups_members_view',name='groups_members'),
	url(r'^(?P<pk>[^/]+)/members/remove/?$','groups_members_remove_view',name='groups_members_remove'),

	url(r'^(?P<pk>[^/]+)/posts/?$','groups_posts_view',name='groups_posts'),
	url(r'^(?P<pk>[^/]+)/posts/add/?$','groups_posts_add_view',name='groups_posts_add'),
	url(r'^(?P<pk>[^/]+)/posts/delete/?$','groups_posts_delete_view',name='groups_posts_delete'),

)