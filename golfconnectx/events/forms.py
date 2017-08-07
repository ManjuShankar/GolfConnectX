from django import forms
from django.conf import settings

from events.models import Events

valid_time_formats = ['%I:%M %p','%H:%M']

class EventAddForm(forms.ModelForm):

	name = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	description = forms.CharField(required=False,widget=forms.Textarea(attrs={'class':'txtarea'}))

	venue = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	address1 = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	city = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	zip_code = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))

	start_date = forms.DateField(required=True,widget=forms.DateInput(format='%m/%d/%Y',attrs={'class':'form-control datepicker','readonly':'readonly'}))
	end_date = forms.DateField(required=True,widget=forms.DateInput(format='%m/%d/%Y',attrs={'class':'form-control datepicker','readonly':'readonly'}))
	start_time = forms.TimeField(required=False,input_formats=valid_time_formats,widget=forms.TimeInput(format='%I:%M %p',attrs={'class':'form-control timepicker'}))
	end_time = forms.TimeField(required=False,input_formats=valid_time_formats,widget=forms.TimeInput(format='%I:%M %p',attrs={'class':'form-control timepicker'}))

	class Meta:
		model = Events
		fields = ('id','name','description','start_date','end_date','start_time','end_time','venue',
			'is_private','address1','city','zip_code')