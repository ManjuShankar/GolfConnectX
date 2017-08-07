from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('usermgmt.adminviews',
	
	url(r'^/?$','users_list_view',name='users'),
	url(r'^new/$','user_add_view',name='add_user'),
	url(r'^edit/(?P<pk>[^/]+)$','user_update_view',name='edit_user'),
	url(r'^delete/(?P<pk>[^/]+)$','user_delete_view',name='delete_user'),

	url(r'^promote/(?P<pk>[^/]+)$','user_promote_view',name='promote_user'),
)