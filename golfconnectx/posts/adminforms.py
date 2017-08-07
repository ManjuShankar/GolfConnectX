from django import forms
from django.conf import settings

from posts.models import Post, PostComment, Videos

class PostForm(forms.ModelForm):
	title = forms.CharField(required=True,widget=forms.TextInput(attrs={'class':'form-control'}))
	body = forms.CharField(required=False,widget=forms.Textarea(attrs={'class':'form-control'}))

	class Meta:
		model = Post
		fields = ('title','body')

class CommentForm(forms.ModelForm):

	class Meta:
		model = PostComment
		fields = ('body',)

class VideoForm(forms.ModelForm):

	class Meta:
		model = Videos
		fields = ('video_url','type')