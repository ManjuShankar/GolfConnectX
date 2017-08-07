from django import forms
from django.conf import settings

from common.models import Campus, Settings, SmtpConfigurations
import consts

class CampusForm(forms.ModelForm):

	name = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))

	class Meta:
		model = Campus
		fields = ('name',)

class SmtpConfigForm(forms.ModelForm):

	email_host = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	email_port = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	email_host_user = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	email_host_password = forms.CharField(required=True,widget=forms.PasswordInput(attrs={'class':'form-control'}))
		
	class Meta:
		model = SmtpConfigurations
		fields=('email_host', 'email_port', 'secure_type', 'email_host_user', 'email_host_password') 

class SettingsForm(forms.ModelForm):

	invite_expiration = forms.CharField(required=False,widget=forms.NumberInput(attrs={'class':'form-control'}))
	password_expiration = forms.CharField(required=False,widget=forms.NumberInput(attrs={'class':'form-control'}))
	email_mask = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	email_mask_text = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	delete_orphoned_text = forms.CharField(required=False,widget=forms.NumberInput(attrs={'class':'form-control'}))
	
	brand_name = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	school_name = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	app_title = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	app_description = forms.CharField(required=False,widget=forms.Textarea(attrs={'class':'form-control'}))

	img_url = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	bubble_notification = forms.CharField(required=False,widget=forms.NumberInput(attrs={'class':'form-control'}))
	timezone = forms.ChoiceField(required=True,choices=consts.TIMEZONE_PAIRS,widget=forms.Select(attrs={'class':'form-control'}))

	update_feed_url = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	landing_header = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	landing_subtitle = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	onboard_disclaimer = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	
	login_page_message = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	login_page_link = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	login_input_text = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	login_instruction = forms.CharField(required=False,widget=forms.Textarea(attrs={'class':'form-control'}))
	
	checkin_reward_points = forms.CharField(required=False,widget=forms.NumberInput(attrs={'class':'form-control'}))

	class Meta:
		model = Settings
		fields = ('invite_expiration', 'invite_enabled', 'password_expiration', 'registration_enabled', 
				'email_mask', 'email_mask_text', 'delete_orphoned_text', 'is_deployed', 'is_public_deployment',
				'brand_name', 'school_name', 'app_title', 'app_description', 'img_url', 'bubble_notification', 
				'timezone', 'update_feed_url', 'landing_header', 'landing_subtitle', 'onboard_usga', 
				'onboard_disclaimer', 'login_page_message', 'login_page_link', 'disable_secret_bubbles',
				'login_input_text', 'login_instruction', 'enable_rewards', 'checkin_reward_points'
			)
