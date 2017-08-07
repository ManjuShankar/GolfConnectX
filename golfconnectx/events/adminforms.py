from django import forms
from django.conf import settings

from events.models import Events, EventCategory

valid_time_formats = ['%I:%M %p','%H:%M']

class EventCategoryForm(forms.ModelForm):

	name = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))

	class Meta:
		model = EventCategory
		fields = ('name',)

class EventForm(forms.ModelForm):
	
	name = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	description = forms.CharField(required=False,widget=forms.Textarea(attrs={'class':'form-control'}))

	start_date = forms.DateField(required=True,widget=forms.DateInput(format='%m/%d/%Y',attrs={'class':'form-control datepicker','readonly':'readonly'}))
	end_date = forms.DateField(required=True,widget=forms.DateInput(format='%m/%d/%Y',attrs={'class':'form-control datepicker','readonly':'readonly'}))
	start_time = forms.TimeField(required=False,input_formats=valid_time_formats,widget=forms.TimeInput(format='%I:%M %p',attrs={'class':'form-control timepicker'}))
	end_time = forms.TimeField(required=False,input_formats=valid_time_formats,widget=forms.TimeInput(format='%I:%M %p',attrs={'class':'form-control timepicker'}))

	venue = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	address1 = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	address2 = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	city = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	zip_code = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control','onkeyup':'getLocation()'}))

	phone = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	email = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))

	class Meta:
		model = Events
		fields = ('name','description','start_date','end_date','start_time','end_time','venue','category',
			'address1','address2','city','zip_code','phone','email','lat','lon','zoom','is_private')

class EventAddForm(forms.ModelForm):

	start_time = forms.TimeField(required=False,input_formats=valid_time_formats,widget=forms.TimeInput(format='%I:%M %p'))
	end_time = forms.TimeField(required=False,input_formats=valid_time_formats,widget=forms.TimeInput(format='%I:%M %p'))

	class Meta:
		model = Events
		fields = ('id','name','description','start_date','end_date','start_time','end_time','venue',
			'is_private','address1','city','zip_code','state')
		