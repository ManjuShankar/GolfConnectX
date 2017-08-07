from django import forms
from django.conf import settings

from courses.models import CourseCategory, Courses, CourseScores

valid_date_formats = ['%m/%d/%Y','%Y-%m-%d']

class CourseCategoryForm(forms.ModelForm):

	name = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))

	class Meta:
		model = CourseCategory
		fields = ('name',)

class CourseForm(forms.ModelForm):

	name = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	description = forms.CharField(required=False,widget=forms.Textarea(attrs={'class':'form-control'}))
	address1 = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	address2 = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	city = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	phone = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	mobile = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	email = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))
	zip_code = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control','onkeyup':'getLocation()'}))

	class Meta:
		model = Courses
		fields = ('name','description','address1','address2','city',
			'zip_code','phone','mobile','email','is_premium')

class CourseScoreForm(forms.ModelForm):
	played_on = forms.DateField(required=True,widget=forms.DateInput(format=valid_date_formats,attrs={'class':'form-control datepicker','readonly':'readonly'}))
	
	class Meta:
		model = CourseScores
		fields = ('played_on','score')


