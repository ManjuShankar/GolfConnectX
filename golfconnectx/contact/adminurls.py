#adminurls.py
from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('contact.adminviews',

	url(r'^contact_admin/?$','contact_list_view',name='contact_list'),
	#url(r'^contact_admin/new/?$','contact_add_view',name='contact_add'),
	url(r'^contact_admin/(?P<pk>[^/]+)$','contact_detail_view',name='contact_details'),
	url(r'^contact_admin/delete/(?P<pk>[^/]+)$','contact_delete_view',name='contact_delete'),
)