from django.conf.urls import include, url, patterns
from django.contrib import admin

'''
urlpatterns = [
    # Examples:
    # url(r'^$', 'sample.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
]
'''
from django.conf import settings as mysettings 
from rest_framework.authtoken import views

urlpatterns = patterns('',

	url(r'^admincp/', include(admin.site.urls)),
	url(r'^admin/', include('golfconnectx.adminurls')),

	url(r'^/?$', 'common.views.site_home', name='site_home'),

	url(r'^api-auth/', include('rest_framework.urls',namespace='rest_framework')),
	url(r'^login/', 'restapi.usermgmt.views.login_api_view',name='login'),

	url(r'^courses/', include('courses.urls')),
	url(r'^events/', include('events.urls')),
	url(r'^groups/', include('groups.urls')),
	url(r'^posts/', include('posts.urls')),
	url(r'^feed/', include('posts.feedurls')),

	url(r'^forums/', include('forums.urls')),

	url(r'^accountsettings/', include('usermgmt.accounturls')),
	url(r'^profile/', include('usermgmt.profileurls')),
	url(r'^user/', include('usermgmt.urls')),
	url(r'^notifications/', include('usermgmt.notificationurls')),
	url(r'^messages/', include('usermgmt.messageurls')),

	url(r'^directory/', include('usermgmt.directoryurls')),

	url(r'^api/', include('restapi.urls')),

	url(r'^search/', 'search.views.search_view',name='general_search_view' ),

	url(r'^site_media/(.*)$', 'django.views.static.serve', {'document_root': mysettings.MEDIA_ROOT}),
	url(r'^static/(.*)$', 'django.views.static.serve', {'document_root': mysettings.STATIC_ROOT}),

)