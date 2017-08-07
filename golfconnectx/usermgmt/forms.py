from django import forms
from django.conf import settings

from usermgmt.models import GolfUser

class SignupForm(forms.ModelForm):

	last_name = forms.CharField(required=False)

	class Meta:
		model = GolfUser
		fields = ('first_name','last_name','password','email','zipcode')

	def clean_email(self):
		email = self.cleaned_data["email"].lower()
		try:
			user = GolfUser.objects.get(email=email)
			raise forms.ValidationError("User with this email address already exists.")
		except GolfUser.DoesNotExist:
			return email
	