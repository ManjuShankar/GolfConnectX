from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('usermgmt.accountviews',

	url(r'^/?$','account_settings',name='account_settings'),

	url(r'^upload-user-profile-image/?$','upload_user_profile_image',name='ajax_upload_user_profile_image'),

	url(r'^save-profile/$','save_profile_settings',name='ajax_save_profile_settings'),
	url(r'^save-golf-skills/$','save_golf_skill_settings',name='ajax_save_golf_skill_settings'),
	url(r'^save-private/$','save_private_settings',name='ajax_save_private_settings'),
	url(r'^save-notification/$','save_notification_settings',name='ajax_save_notification_settings'),
	url(r'^save-emailsettings/$','save_email_settings',name='ajax_save_email_settings'),

	url(r'^check-current-password/$','check_current_password',name='ajax_check_current_password'),

)