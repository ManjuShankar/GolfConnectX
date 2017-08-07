from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('bubbles.adminviews',
	
	url(r'^bubble_admin/?$','bubbles_list_view',name='bubbles'),
	url(r'^bubble_admin/new?$','bubbles_add_view',name='bubble_add'),
	url(r'^bubble_admin/edit/(?P<pk>[^/]+)$','bubbles_update_view',name='bubble_edit'),
	url(r'^bubble_admin/delete/(?P<pk>[^/]+)$','bubbles_delete_view',name='bubble_delete'),

	url(r'^bubble_category_admin/?$','bubbles_category_list_view',name='bubble_categories_list'),
	url(r'^bubble_category_admin/new?$','bubbles_category_add_view',name='bubble_categories_add'),
	url(r'^bubble_category_admin/edit/(?P<pk>[^/]+)$','bubbles_category_update_view',name='bubble_categories_edit'),
	url(r'^bubble_category_admin/delete/(?P<pk>[^/]+)$','bubbles_category_delete_view',name='bubble_categories_delete'),


)