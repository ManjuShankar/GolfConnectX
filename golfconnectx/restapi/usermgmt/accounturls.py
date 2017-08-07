from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('restapi.usermgmt.accountviews',

	url(r'^/?$','get_account_settings',name='get_account_settings'),
	url(r'^upload-user-profile-image/?$','upload_user_profile_image',name='upload_user_profile_image'),
	url(r'^profile/$','account_profile_settings',name='account_profile_settings'),
	url(r'^golfer-skills/$','golfer_skill_settings',name='golfer_skill_settings'),
	url(r'^private/$','account_private_settings',name='account_private_settings'),
	url(r'^notification/$','account_notification_settings',name='account_notification_settings'),
	url(r'^email/$','account_email_settings',name='account_email_settings'),
)

