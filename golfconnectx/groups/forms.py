from django import forms

from groups.models import Groups

class GroupForm(forms.ModelForm):
	name = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	description = forms.CharField(required=False,widget=forms.Textarea(attrs={'class':'form-control','rows':4}))

	class Meta:
		model = Groups
		fields = ('name','description','course','is_private')