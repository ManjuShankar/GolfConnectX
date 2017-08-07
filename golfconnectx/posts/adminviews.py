import json

from django.template import Template
from django.template.response import TemplateResponse
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render

from django.views.generic import ListView, CreateView, UpdateView, View ,DetailView
from posts.models import Post, PostComment
from posts.adminforms import PostForm, CommentForm

class PostsListView(ListView):
	"""
    List the Campuses in the site.
    """
	template_name = 'admin/posts/posts_list.html'
	
	def get_queryset(self):
		return Post.objects.all().order_by('id')

posts_list_view = PostsListView.as_view()

class PostsCreateView(CreateView):
	"""
	Create a new Post
	"""
	model = Post
	form_class = PostForm
	template_name = 'admin/posts/posts_add.html'

	def get_success_url(self):
		return reverse('posts')

	def post(self,request):
		data = {}
		form  = PostForm(request.POST)
		try:
			postform  = PostForm(request.POST)
			if postform.is_valid():
				obj = postform.save(commit=False)

				obj.author = request.user
				obj.save()

				data['success'] = 1	
			else:
				print form.errors
				data['success'] = 0
		except:
			data['success'] = 0

		return HttpResponse(json.dumps(data), content_type='application/x-json')

posts_create_view = PostsCreateView.as_view()

class PostsDeleteView(View):

	model = Post

	def get_success_url(self):
		return reverse('posts')

	def get(self, request, *args, **kwargs):

		try:
			post = Post.objects.get(id = kwargs['pk'])
			post.delete()
			return HttpResponseRedirect(self.get_success_url())
		except ObjectDoesNotExist:
			raise Http404

posts_delete_view = PostsDeleteView.as_view()

class PostDetailView(DetailView):
	model = Post
	template_name = 'admin/posts/posts_detail.html'

posts_detail_view = PostDetailView.as_view()

class PostCommentAddView(View):

	def post(self, request, *args, **kwargs):
		data = {}
		post = Post.objects.get(id = int(self.kwargs['pk']))
		try:
			commentform  = CommentForm(request.POST)
			if commentform.is_valid():
				obj = commentform.save(commit=False)

				obj.author = request.user
				obj.save()

				post.comments.add(obj)
				post.comment_count = post.comments.count()
				post.save()

				data['success'] = 1	
			else:
				data['success'] = 0
		except:
			data['success'] = 0

		return HttpResponse(json.dumps(data), content_type='application/x-json')

posts_comment_add_view = PostCommentAddView.as_view()
