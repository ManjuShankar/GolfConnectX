from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('groups.views',

	url(r'^/?$','groups_home',name='ajax_groups_home'),

	url(r'^load-groups/?$','ajax_load_groups',name='ajax_load_groups'),
	url(r'^load-courses/?$','ajax_load_courses',name='ajax_load_courses'),
	url(r'^upload-cover-image/?$','upload_group_cover_image',name='ajax_upload_group_cover_image'),

	url(r'^create/?$','groups_create',name='ajax_groups_create'),
	url(r'^edit/(?P<pk>[^/]+)/?$','groups_edit',name='ajax_edit_group'),

	url(r'^(?P<pk>[^/]+)/?$','group_details',name='ajax_group_details'),

	url(r'^(?P<pk>[^/]+)/upload-file/?$','ajax_group_upload_file',name='ajax_group_upload_file'),
	url(r'^(?P<pk>[^/]+)/files/?$','ajax_group_files',name='ajax_group_files'),

	url(r'^(?P<pk>[^/]+)/upload-image/?$','ajax_group_upload_image',name='ajax_group_upload_image'),
	url(r'^(?P<pk>[^/]+)/images/?$','ajax_group_images',name='ajax_group_images'),

	url(r'^(?P<pk>[^/]+)/posts/?$','ajax_group_posts',name='ajax_group_posts'),
	url(r'^(?P<pk>[^/]+)/add-post/?$','ajax_group_add_post',name='ajax_group_add_post'),
	
	url(r'^(?P<pk>[^/]+)/events/?$','ajax_group_events',name='ajax_group_events'),
	url(r'^(?P<pk>[^/]+)/create-event/?$','ajax_group_create_event',name='ajax_group_create_event'),

	url(r'^(?P<pk>[^/]+)/members/?$','ajax_group_members',name='ajax_group_members'),

)