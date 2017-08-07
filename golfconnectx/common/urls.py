from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('common.views',

	url(r'^/?$','site_home',name='site_home'),

)