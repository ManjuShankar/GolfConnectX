#urls.py
from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('restapi.contact.views',

	url(r'^/?$','contact_home',name='contact_home'),
)