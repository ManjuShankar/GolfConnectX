from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('restapi.groups.views',

	url(r'^/?$','groups_home',name='groups_home'),
	url(r'^new/?$','groups_new_home',name='groups_new_home'),

	url(r'^create/?$','groups_create',name='groups_create'),

	url(r'^upload-cover-image/?$','upload_group_cover_image',name='upload_group_cover_image_api'),

	url(r'^delete-image/(?P<pk>[^/]+)/?$','delete_group_image',name='api_delete_group_image'),
	url(r'^delete-group-file/(?P<pk>[^/]+)/?$','delete_group_file',name='api_delete_group_file'),

	url(r'^edit/(?P<pk>[^/]+)/?$','groups_edit',name='groups_edit'),

	url(r'^(?P<pk>[^/]+)/?$','group_details',name='group_detail'),
	url(r'^(?P<pk>[^/]+)/edit-info/?$','edit_group_info',name='edit_group_info'),
	
	url(r'^(?P<pk>[^/]+)/posts/?$','group_posts',name='group_posts'),

	url(r'^(?P<pk>[^/]+)/members/?$','group_members',name='group_members'),
	url(r'^(?P<pk>[^/]+)/members/search/?$','group_search_members',name='group_search_members'),

	url(r'^(?P<pk>[^/]+)/admins/?$','group_admins',name='group_admins'),

	url(r'^(?P<pk>[^/]+)/add-admin/?$','group_add_admin',name='group_add_admin'),

	url(r'^(?P<pk>[^/]+)/add-member/?$','group_add_member',name='group_add_member'),
	url(r'^(?P<pk>[^/]+)/add-search-member/?$','group_search_member',name='group_search_member'),
	url(r'^(?P<pk>[^/]+)/remove-member/?$','group_remove_member',name='group_remove_member'),
	
	url(r'^(?P<pk>[^/]+)/gallery/?$','group_gallery',name='group_gallery'),
	url(r'^(?P<pk>[^/]+)/add-group-image/?$','group_add_image',name='group_add_image'),

	url(r'^(?P<pk>[^/]+)/files/?$','group_files',name='group_files'),
	url(r'^(?P<pk>[^/]+)/add-group-file/?$','group_add_file',name='group_add_image'),

	url(r'^(?P<pk>[^/]+)/events/?$','group_events',name='group_events'),
	url(r'^(?P<pk>[^/]+)/create-event/?$','group_create_event',name='group_create_event'),

	url(r'^(?P<pk>[^/]+)/create-post/?$','group_create_post',name='group_create_post'),

	url(r'^(?P<pk>[^/]+)/leave-group/?$','group_leave_group',name='group_leave_group'),

	url(r'^(?P<pk>[^/]+)/request-membership/?$','group_request_access',name='group_request_access'),
	url(r'^(?P<pk>[^/]+)/grant-membership/(?P<id>[^/]+)/?$','group_grant_access',name='group_grant_access'),
	
	url(r'^(?P<pk>[^/]+)/send-invite/?$','send_invite_view',name='group_send_invite'),
	url(r'^(?P<pk>[^/]+)/accept-invite/?$','accept_invite_view',name='group_accept_invite'),

	url(r'^(?P<pk>[^/]+)/send-invite-via-mail/?$','send_invite_via_mail_view',name='group_send_invite_via_mail'),

)