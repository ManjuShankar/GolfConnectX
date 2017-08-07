from django import forms
from django.conf import settings

import consts
from common.models import BubbleCategory, Campus
from bubbles.models import Bubble

class BubbleCategoryForm(forms.ModelForm):

	name = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	color = forms.ChoiceField(required=True,choices=consts.BUBBLE_COLORS,widget=forms.Select(attrs={'class':'form-control'}))

	class Meta:
		model = BubbleCategory
		fields = ('name','verified','color','membership')

class BubbleForm(forms.ModelForm):
	name = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	description = forms.CharField(required=False,widget=forms.Textarea(attrs={'class':'form-control'}))
	color = forms.ChoiceField(required=True,choices=consts.BUBBLE_COLORS,widget=forms.Select(attrs={'class':'form-control'}))
	icon = forms.CharField(required=False,widget=forms.TextInput(attrs={'class':'form-control'}))

	class Meta:
		model = Bubble
		fields = ('name','description','color','category','bubble_type','icon','campus',
				 'allow_leaving','read_only','active','suggested','updates_delayed')
