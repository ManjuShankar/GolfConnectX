from django import forms
from django.conf import settings

from contact.models import Contact

class ContactForm(forms.ModelForm):

	name = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	message = forms.CharField(required=False,widget=forms.Textarea(attrs={'class':'form-control'}))
	
	phone = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	email = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	
	class Meta:
		model = Contact
		fields = ('name','message','phone','email')


