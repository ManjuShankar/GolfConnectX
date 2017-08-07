from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('events.views',

	url(r'^/?$','event_list',name='event_list'),
	url(r'^upcoming/?$','upcoming_events',name='ajax_upcoming_events'),
	url(r'^past/?$','past_events',name='ajax_past_events'),

	url(r'^upload-cover-image/?$','upload_event_cover_image',name='ajax_upload_event_cover_image'),
    url(r'^delete-cover-image/?$', 'delete_event_cover_image', name="ajax_delete_event_cover_image"),

    url(r'^upload-teetime-file/?$','upload_event_teetime_file',name='ajax_upload_event_teetime_file'),

	url(r'^create/?$','save_event',name='ajax_save_event'),

	url(r'^details/?$','event_details',name='ajax_event_details'),

)