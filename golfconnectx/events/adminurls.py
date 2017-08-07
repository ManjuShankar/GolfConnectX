from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('events.adminviews',

	url(r'^categories/?$','event_category_list_view',name='event_categories_list'),
	url(r'^categories/new/?$','event_category_add_view',name='event_categories_add'),
	url(r'^categories/edit/(?P<pk>[^/]+)$','event_category_edit_view',name='event_categories_edit'),
	url(r'^categories/delete/(?P<pk>[^/]+)$','event_category_delete_view',name='event_categories_delete'),
	
	url(r'^/?$','events_list_view',name='events'),

	url(r'^upload-cover-image/?$','upload_event_cover_image',name='upload_event_cover_image'),
    url(r'^delete-cover-image/?$', 'delete_event_cover_image', name="delete_event_cover_image"),

	url(r'^new/?$','events_add_view',name='event_add'),
	url(r'^edit/(?P<pk>[^/]+)$','events_update_view',name='event_edit'),
	url(r'^delete/(?P<pk>[^/]+)$','events_delete_view',name='event_delete'),

	url(r'^load-courses/$','events_load_courses_view',name='events_load_courses'),
	url(r'^load-course-details/$','events_load_course_details_view',name='events_load_course_details'),

	url(r'^import-events/$','import_events_view',name='import_events'),
	url(r'^send-email/$','send_email_view',name='send_email'),


)