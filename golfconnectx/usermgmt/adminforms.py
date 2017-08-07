from django import forms
from django.conf import settings

from usermgmt.models import GolfUser ,UserRole

class UserRoleForm(forms.ModelForm):

	name = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	
	class Meta:
		model = UserRole
		fields = ('name','is_student','resume_enabled')

class UserForm(forms.ModelForm):

	first_name = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	last_name = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	email = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	password = forms.CharField(required=True,widget=forms.PasswordInput(attrs={'class':'form-control'}))
	zipcode = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))

	class Meta:
		model = GolfUser
		fields = ('first_name','last_name', 'email','password','zipcode')

class UserUpdateForm(forms.ModelForm):

	first_name = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	last_name = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	email = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	zipcode = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	
	class Meta:
		model = GolfUser
		fields = ('first_name','last_name', 'email','is_active','zipcode')

