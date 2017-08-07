import json
from datetime import datetime

from django.http import HttpResponse, HttpResponseRedirect, Http404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from usermgmt.models import Conversation, Messages, GolfUser
from usermgmt.serializers import ConversationSerializer, AddConversationSerializer, \
ConversationDetailsSerializer, AddMessageSerializer, MessageSerializer, UserListSerializer

class ConversationsView(APIView):
	model = Conversation

	def get(self, request, *args, **kwargs):
		user = request.user
		conversations = Conversation.objects.filter(participants = user).order_by('-modified_on')
		serializer = ConversationSerializer(conversations,many = True,context={'request': request})

		return Response(serializer.data)

conversations = ConversationsView.as_view()

class NewConversationView(APIView):
	model = Conversation
	serializer_class = AddConversationSerializer
	
	def get(self,request, format=None):

		users = GolfUser.objects.filter(is_private=False).exclude(id = request.user.id)

		serializer = UserListSerializer(users,many=True,context={'request': request})
		return Response(serializer.data, status=status.HTTP_200_OK)
	
	def post(self, request, format=None):

		conversation = Conversation()

		'''
		ctype = request.data['ctype']

		if ctype == 'G':
			name = request.data['name']
			conversation.name = name
		else:
			conversation.name = request.user.first_name
		conversation.ctype = ctype
		'''
		conversation.save()

		participants = request.data.get('participants')
		m = request.data.get('message')

		participants = participants.split(',')
		
		for pemail in participants:
			participant = GolfUser.objects.get(email = pemail)
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

		serializer = ConversationSerializer(conversation,context={'request': request})
		return Response(serializer.data, status=status.HTTP_200_OK)

new_conversation = NewConversationView.as_view()

class DeleteConversations(APIView):

	def post(self, request):
		message_ids = request.data.get('ids')

		conversations = Conversation.objects.filter(id__in = message_ids)
		conversations.delete()
		return Response(status=status.HTTP_200_OK)

delete_conversations = DeleteConversations.as_view()

class ConversationDetails(APIView):

	def get_object(self, pk):
		try:
			return Conversation.objects.get(pk=pk)
		except Conversation.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):
		conversation = self.get_object(pk)
		serializer = ConversationDetailsSerializer(conversation,context={'request': request})

		return Response(serializer.data)

	def delete(self, request, pk, format=None):
		conversation = self.get_object(pk)
		conversation.delete()
		return Response(status=status.HTTP_200_OK)

conversation_details = ConversationDetails.as_view()

class NewMessageView(APIView):
	serializer_class = AddMessageSerializer

	def get_object(self, pk):
		try:
			return Conversation.objects.get(pk=pk)
		except Conversation.DoesNotExist:
			raise Http404

	def post(self, request, pk, format=None):
		conversation = self.get_object(pk)

		serializer = AddMessageSerializer(data=request.data)

		if serializer.is_valid():
			m = request.data['message']
			message = Messages(
					message = m,
					created_by = request.user
				)
			message.save()
			conversation.messages.add(message)
			today = datetime.today()

			conversation.modified_on = today
			conversation.save()

			serializer = MessageSerializer(message)

			return Response(serializer.data, status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

new_message = NewMessageView.as_view()



