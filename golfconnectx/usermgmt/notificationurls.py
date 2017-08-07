from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('usermgmt.notificationviews',

	url(r'^/?$','notifications',name='ajax_notifications'),
	url(r'^count/?$','notifications_count',name='ajax_notifications_count'),
	url(r'^(?P<pk>[^/]+)/?$','notification_details',name='ajax_notification_details'),

)