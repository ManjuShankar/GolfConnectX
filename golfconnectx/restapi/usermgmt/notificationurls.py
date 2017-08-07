from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('restapi.usermgmt.notificationviews',

	url(r'^/?$','notifications',name='notifications'),
	url(r'^count/?$','notifications_count',name='notifications_count'),
	url(r'^(?P<pk>[^/]+)/?$','notification_details',name='notification_details'),

)