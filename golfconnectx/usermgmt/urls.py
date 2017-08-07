from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('usermgmt.views',

	url(r'^login/?$','login_view',name='login'),
	url(r'^logout/?$','logout_view',name='logout'),
	url(r'^signup/?$','signup_view',name='signup'),
	url(r'^invite/?$','invite_view',name='ajax_send_invite'),

)