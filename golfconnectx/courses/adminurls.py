from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('courses.adminviews',

	url(r'^course_category_admin/?$','course_category_list_view',name='course_categories_list'),
	url(r'^course_category_admin/new/?$','course_category_add_view',name='course_categories_add'),
	url(r'^course_category_admin/edit/(?P<pk>[^/]+)$','course_category_edit_view',name='course_categories_edit'),
	url(r'^course_category_admin/delete/(?P<pk>[^/]+)$','course_category_delete_view',name='course_categories_delete'),

	url(r'^/?$','courses_list_view',name='courses'),
	url(r'^new/?$','courses_add_view',name='course_add'),
	url(r'^edit/(?P<pk>[^/]+)$','courses_update_view',name='course_edit'),
	url(r'^delete/(?P<pk>[^/]+)$','courses_delete_view',name='course_delete'),

	url(r'^search/?$','search_courses_view',name='admin_course_search'),

	url(r'^upgrade-to-premium/?$','upgrade_to_premium',name='courses_upgrade_to_premium'),
	
	url(r'^(?P<pk>[^/]+)/events/?$','courses_events_view',name='courses_events'),
	url(r'^(?P<pk>[^/]+)/events/add/?$','courses_events_add_view',name='courses_events_add'),
	url(r'^(?P<pk>[^/]+)/events/remove/?$','courses_events_remove_view',name='courses_events_remove'),

	url(r'^(?P<pk>[^/]+)/groups/?$','courses_groups_view',name='courses_groups'),
	url(r'^(?P<pk>[^/]+)/groups/add/?$','courses_groups_add_view',name='courses_groups_add'),
	url(r'^(?P<pk>[^/]+)/groups/remove/?$','courses_groups_remove_view',name='courses_groups_remove'),

	url(r'^(?P<pk>[^/]+)/followers/?$','courses_followers_view',name='courses_followers'),
	url(r'^(?P<pk>[^/]+)/followers/remove/?$','courses_followers_remove_view',name='courses_followers_remove'),
	
	url(r'^(?P<pk>[^/]+)/posts/?$','courses_posts_view',name='courses_posts'),
	url(r'^(?P<pk>[^/]+)/posts/add/?$','courses_posts_add_view',name='courses_posts_add'),
	url(r'^(?P<pk>[^/]+)/posts/delete/?$','courses_posts_delete_view',name='courses_posts_delete'),

)