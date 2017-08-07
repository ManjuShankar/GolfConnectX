from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('restapi.usermgmt.views',

	url(r'^/?$','user_details',name='user_details'),
	url(r'^signup/?$','signup_api_view',name='signup_api_view'),
	url(r'^login/?$','login_api_view',name='login_api_view'),
	url(r'^logout/?$','logout_api_view',name='logout_api_view'),

	url(r'^invite/?$','invite_api_view',name='invite_api_view'),
	url(r'^forget-pwd/?$','forget_pwd_api_view',name='forget_pwd_api_view'),
	url(r'^enter-otp/?$','enter_otp_api_view',name='enter_otp_api_view'),
	url(r'^change-password/?$','change_password_api_view',name='change_password_api_view'),

	url(r'^fb-login/?$','fb_login_api_view',name='fb_login_api_view'),
	url(r'^fb-register/?$','fb_register_api_view',name='fb_register_api_view'),
)