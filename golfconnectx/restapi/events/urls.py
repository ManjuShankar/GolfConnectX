from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('restapi.events.views',

	url(r'^/?$','events_home',name='events_home'),

	url(r'^public-events/?$','public_events',name='public_events'),
	url(r'^public-events/calendar/?$','public_calendar_events',name='public_calendar_events'),
	url(r'^public-events/calendar-list/?$','public_calendar_list_events',name='public_calendar_list_events'),

	url(r'^create/?$','events_create',name='events_create'),
	url(r'^search/?$','events_search',name='events_search'),
	url(r'^upcoming/?$','upcoming_events',name='upcoming_events'),
	url(r'^past/?$','past_events',name='past_events'),

	url(r'^calendar/?$','calendar_events',name='calendar_events'),
	url(r'^calendar-list/?$','calendar_list_events',name='calendar_list_events'),
	
	url(r'^calendar-double/?$','calendar_double_events',name='calendar_double_events'),

	url(r'^upload-cover-image/?$','upload_event_cover_image',name='api_upload_event_cover_image'),
	url(r'^upload-teetime-file/?$','upload_event_teetime_file',name='api_upload_event_teetime_file'),

	url(r'^delete-image/(?P<pk>[^/]+)/?$','delete_event_image',name='api_delete_event_image'),
	url(r'^delete-teetime-file/(?P<pk>[^/]+)/?$','delete_event_teetime_file',name='api_delete_event_teetime_file'),

	url(r'^(?P<pk>[^/]+)/?$','event_details',name='event_details'),
	
	url(r'^(?P<pk>[^/]+)/attending/?$','attend_event',name='attend_event'),
	url(r'^(?P<pk>[^/]+)/attendees/?$','event_attendees',name='event_attendees'),
	url(r'^(?P<pk>[^/]+)/not-attendees/?$','event_not_attendees',name='event_not_attendees'),
	url(r'^(?P<pk>[^/]+)/may-attend/?$','event_may_attend',name='event_may_attend'),

	url(r'^(?P<pk>[^/]+)/attendees-stats/?$','event_attendees_stats',name='event_attendees_stats'),
	url(r'^(?P<pk>[^/]+)/friends-attending/?$','friends_attending',name='friends_attending'),

	url(r'^(?P<pk>[^/]+)/request-access/?$','event_request_access',name='event_request_access'),
	url(r'^(?P<pk>[^/]+)/cancel-request/?$','event_cancel_request',name='event_cancel_request'),
	url(r'^(?P<pk>[^/]+)/grant-access/(?P<id>[^/]+)/?$','event_grant_access',name='event_grant_access'),
	
	url(r'^(?P<pk>[^/]+)/send-invite/?$','send_invite_view',name='event_send_invite'),
	url(r'^(?P<pk>[^/]+)/accept-invite/?$','accept_invite_view',name='event_accept_invite'),

	url(r'^(?P<pk>[^/]+)/attending-status/?$','attending_status_view',name='event_attending_status'),

	url(r'^(?P<pk>[^/]+)/gallery/?$','event_gallery',name='event_gallery'),
	url(r'^(?P<pk>[^/]+)/tee-time-files/?$','event_tee_time_files',name='event_tee_time_files'),

	url(r'^(?P<pk>[^/]+)/posts/?$','event_posts',name='event_posts'),
	url(r'^(?P<pk>[^/]+)/send-invite-via-mail/?$','send_invite_via_mail_view',name='event_send_invite_via_mail'),
)