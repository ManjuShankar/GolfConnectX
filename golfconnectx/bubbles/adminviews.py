from django.template import Template
from django.template.response import TemplateResponse, HttpResponse
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.core.exceptions import ObjectDoesNotExist
from django.views.generic import ListView, CreateView, UpdateView, View
from django.shortcuts import render

from bubbles.models	import Bubble
from common.models import BubbleCategory, Campus, BubbleTag

from bubbles.adminforms import BubbleCategoryForm, BubbleForm


class BubbleCategoryListView(ListView):
	"""
    List the Bubble Categories in the site.
    """
	template_name = 'admin/bubbles/bubble_category_list.html'
	
	def get_queryset(self):
		return BubbleCategory.objects.all()

bubbles_category_list_view = BubbleCategoryListView.as_view()

class BubbleCategoryAddView(CreateView):
	"""
	Creates a new bubble category on the site.
	"""
	model = BubbleCategory
	form_class = BubbleCategoryForm
	template_name = 'admin/bubbles/bubble_category_form.html'

	def get_success_url(self):
		return reverse('bubble_categories_list')

	def form_valid(self, form):
		return super(BubbleCategoryAddView, self).form_valid(form)

bubbles_category_add_view = BubbleCategoryAddView.as_view()

class BubbleCategoryUpdateView(UpdateView):
	"""
	Updates the bubble category information on the site.
	"""
	model = BubbleCategory
	form_class = BubbleCategoryForm
	template_name = 'admin/bubbles/bubble_category_form.html'

	def get_success_url(self):
		return reverse('bubble_categories_list')

bubbles_category_update_view = BubbleCategoryUpdateView.as_view()

class BubbleCategoryDeleteView(View):
	"""
	Delets the selected campus
	"""
	model = BubbleCategory

	def get_success_url(self):
		return reverse('bubble_categories_list')

	def get(self, request, *args, **kwargs):
		try:
			category = BubbleCategory.objects.get(id = kwargs['pk'])
			category.delete()
			return HttpResponseRedirect(self.get_success_url())
		except ObjectDoesNotExist:
			raise Http404

bubbles_category_delete_view = BubbleCategoryDeleteView.as_view()



class BubbleListView(ListView):
	"""
    List the Bubbles in the site.
    """
	template_name = 'admin/bubbles/bubble_list.html'
	
	def get_queryset(self):
		return Bubble.objects.all()

bubbles_list_view = BubbleListView.as_view()

class BubbleAddView(CreateView):
	"""
	Creates a new bubble category on the site.
	"""
	model = Bubble
	form_class = BubbleForm
	template_name = 'admin/bubbles/bubble_form.html'

	def get_success_url(self):
		return reverse('bubbles')

	def get_context_data(self, **kwargs):
		context = super(BubbleAddView, self).get_context_data(**kwargs)
		context['categories'] = BubbleCategory.objects.all()
		context['campuses'] = Campus.objects.all()
		context['tags'] = BubbleTag.objects.all()

		return context

	def post(self,request):
		data = {}

		form  = BubbleForm(request.POST)
		if form.is_valid():
			obj = form.save()
			obj.save()
			return HttpResponseRedirect(self.get_success_url())
		
		return render(request, self.template_name, {'form': form})

bubbles_add_view = BubbleAddView.as_view()

class BubbleUpdateView(UpdateView):
	"""
	Creates a new bubble category on the site.
	"""
	model = Bubble
	form_class = BubbleForm
	template_name = 'admin/bubbles/bubble_form.html'

	def get_success_url(self):
		return reverse('bubbles')

	def get_context_data(self, **kwargs):
		context = super(BubbleUpdateView, self).get_context_data(**kwargs)
		context['categories'] = BubbleCategory.objects.all()
		context['campuses'] = Campus.objects.all()
		context['tags'] = BubbleTag.objects.all()

		return context

	def post(self,request,pk):
		data = {}
		bubble = self.get_object()
		form  = BubbleForm(request.POST,instance=bubble)
		if form.is_valid():
			obj = form.save()
			obj.save()
			return HttpResponseRedirect(self.get_success_url())
		
		return render(request, self.template_name, {'form': form})

bubbles_update_view = BubbleUpdateView.as_view()

class BubbleDeleteView(View):

    model = Bubble

    def get_success_url(self):
		return reverse('bubbles')

    def get(self, request, *args, **kwargs):

    	try:
    		bubble = Bubble.objects.get(id = kwargs['pk'])
    		bubble.delete()
    		return HttpResponseRedirect(self.get_success_url())
        except ObjectDoesNotExist:
            raise Http404


bubbles_delete_view = BubbleDeleteView.as_view()