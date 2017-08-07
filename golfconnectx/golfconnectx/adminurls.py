from django.conf.urls import include, url, patterns
from django.views.generic.base import RedirectView

urlpatterns = patterns('',
	url(r'^/?$','common.adminviews.dashboard',name='admin_home'),#PORTAL HOME
	
	url(r'^users/',include('usermgmt.adminurls')),
	url(r'^course-admins/',include('usermgmt.courseadminurls')),
	url(r'^bubbles/',include('bubbles.adminurls')),
	url(r'^courses/',include('courses.adminurls')),
	url(r'^events/',include('events.adminurls')),
	url(r'^posts/',include('posts.adminurls')),
	url(r'^contacts/',include('contact.adminurls')),
	url(r'^groups/',include('groups.adminurls')),

	url(r'^email-settings/?$','common.adminviews.email_settings',name='email_settings'),#PORTAL HOME

	url(r'^user_role/?$','common.adminviews.user_role_list_view',name='user_role_list'),
	url(r'^user_role/new/?$','common.adminviews.user_role_add_view',name='user_role_add'),
	url(r'^user_role/edit/(?P<pk>[^/]+)$','common.adminviews.user_role_update_view',name='user_role_edit'),
	url(r'^user_role/delete/(?P<pk>[^/]+)$','common.adminviews.user_role_delete_view',name='user_role_delete'),

	url(r'^settings_admin/?$','common.adminviews.settings_view',name='settings'),	

)