from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('',
	url(r'^/?$', 'common.views.api_root', name='api_root'),
	url(r'^courses/', include('restapi.courses.urls')),
	url(r'^events/', include('restapi.events.urls')),
	url(r'^posts/', include('restapi.posts.urls')),
	url(r'^groups/', include('restapi.groups.urls')),
	url(r'^contact-us/', include('restapi.contact.urls')),
	url(r'^forums/', include('restapi.forums.urls')),

	url(r'^profile/', include('restapi.usermgmt.profileurls')),
	url(r'^account-settings/', include('restapi.usermgmt.accounturls')),
	url(r'^notifications/', include('restapi.usermgmt.notificationurls')),
	url(r'^messages/', include('restapi.usermgmt.messageurls')),
	url(r'^user/', include('restapi.usermgmt.urls')),
	url(r'^directory/', include('restapi.usermgmt.directoryurls')),

	url(r'^search/', 'restapi.search.views.api_search_view',name='api_search_view' ),

)


