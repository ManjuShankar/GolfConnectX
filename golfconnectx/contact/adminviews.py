#import json

from django.template import Template
from django.template.response import TemplateResponse
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.core.exceptions import ObjectDoesNotExist

from django.views.generic import ListView, CreateView,View, DetailView

from contact.models import Contact
from contact.adminforms import ContactForm


class ContactListView(ListView):
	"""
    List the contact in the site.
    """
	template_name = 'admin/contact/contact_list.html'
	
	def get_queryset(self):
		return Contact.objects.all()

contact_list_view = ContactListView.as_view()

class ContactAddView(CreateView):
	"""
	Adds a new campus to the site.
	"""
	model = Contact
	form_class = ContactForm
	template_name = 'admin/contact/contact_form.html'

	def get_success_url(self):
		return reverse('contact_list')

	def form_valid(self, form):
		return super(ContactAddView, self).form_valid(form)

	def form_invalid(self, form):
		print form.errors
		return super(ContactAddView, self).form_invalid(form)
contact_add_view = ContactAddView.as_view()



class ContactDeleteView(View):
	"""
	Delets the selected campus
	"""
	model = Contact

	def get_success_url(self):
		return reverse('contact_list')

	def get(self, request, *args, **kwargs):
		try:
			category = Contact.objects.get(id = kwargs['pk'])
			category.delete()
			return HttpResponseRedirect(self.get_success_url())
		except ObjectDoesNotExist:
			raise Http404

contact_delete_view = ContactDeleteView.as_view()


class ContactDetailView(DetailView):
	model = Contact
	template_name = 'admin/contact/contact_details.html'

contact_detail_view = ContactDetailView.as_view()