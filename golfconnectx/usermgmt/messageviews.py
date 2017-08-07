import json
from datetime import datetime
from sys import exc_info

from django.shortcuts import render
from django.template import Template, RequestContext
from django.template.response import TemplateResponse
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.core.exceptions import ObjectDoesNotExist
from django.core import serializers
from django.views.generic import ListView, CreateView, UpdateView, View, DetailView
from django.db.models import Q
from django.template.loader import render_to_string

from common.mixins import LoginRequiredMixin

from usermgmt.models import Messages, Conversation, GolfUser

class ConversationsView(LoginRequiredMixin,View):
	template_name = 'usermgmt/messages/message_list.html'

	def get(self, request):
		data = {}
		conversations = Conversation.objects.filter(participants = request.user).order_by('-modified_on')
		data['conversations'] = conversations
		data['user'] = request.user
		return render(request, self.template_name,data)

conversations = ConversationsView.as_view()

class NewConversationView(View):
	template_name = 'usermgmt/messages/new_conversation.html'
	
	def get(self,request, format=None):

		users = GolfUser.objects.filter(is_private=False).exclude(id = request.user.id)
		data = {'users':users}

		return render(request, self.template_name,data)

	def post(self,request, format=None):

		conversation = Conversation()

		conversation.save()

		participants = request.POST.getlist('participants')
		m = request.POST.get('message')

		for id in participants:
			participant = GolfUser.objects.get(id = str(id))
			conversation.participants.add(participant)

		conversation.participants.add(request.user)

		if conversation.participants.all().count() > 2:
			conversation.ctype = 'G'
			conversation.name = 'Group Message'
			conversation.save()
			
		message = Messages()
		message.message = m
		message.created_by = request.user
		message.save()

		conversation.messages.add(message)

		return HttpResponseRedirect(reverse('ajax_conversations'))

new_conversation = NewConversationView.as_view()

class ConversationDetails(View):
	template_name = 'usermgmt/messages/conversation_details.html'

	def get_object(self, pk):
		try:
			return Conversation.objects.get(pk=pk)
		except Conversation.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		conversation = self.get_object(pk)
		data= {}
		data['user'] = request.user
		data['conversation'] = conversation
		return render(request, self.template_name,data)

	def delete(self, request, pk, format=None):
		conversation = self.get_object(pk)
		conversation.delete()
		return Response(status=status.HTTP_200_OK)

conversation_details = ConversationDetails.as_view()

class NewMessageView(View):

	def get_object(self, pk):
		try:
			return Conversation.objects.get(pk=pk)
		except Conversation.DoesNotExist:
			raise Http404

	def post(self, request, pk, format=None):
		data = {}
		conversation = self.get_object(pk)

		message = request.POST.get('message_body')

		m_obj = Messages(
				message = message,
				created_by = request.user
			)
		m_obj.save()

		conversation.messages.add(m_obj)

		today = datetime.today()
		conversation.modified_on = today
		conversation.save()
		sdata = {'message':m_obj}

		data['html']=render_to_string('usermgmt/messages/include_new_message.html',sdata,context_instance=RequestContext(request))
		data['status'] = 1

		return HttpResponse(json.dumps(data), content_type='application/x-json')

new_message = NewMessageView.as_view()

class DeleteConversationView(View):

	def get_object(self, pk):
		try:
			return Conversation.objects.get(pk=pk)
		except Conversation.DoesNotExist:
			raise Http404

	def get(self,request, pk, format=None):
		data = {}
		conversation = self.get_object(pk)
		conversation.delete()

		return HttpResponseRedirect(reverse('ajax_conversations'))

conversation_delete = DeleteConversationView.as_view()