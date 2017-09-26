import json
from datetime import datetime, timedelta

from django.http import HttpResponse, HttpResponseRedirect, Http404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from usermgmt.models import Conversation, Messages, GolfUser, ConversationStatus
from usermgmt.serializers import ConversationSerializer, AddConversationSerializer, \
ConversationDetailsSerializer, AddMessageSerializer, MessageSerializer, UserListSerializer

class ConversationsView(APIView):
	model = Conversation

	def get(self, request, *args, **kwargs):
		user = request.user

		cids = ConversationStatus.objects.filter(user=user,status='A').values_list('conversation',flat=True)
		conversations = Conversation.objects.filter(id__in = cids).order_by('-modified_on')
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
		try:
			conversation = Conversation()
			conversation.save()

			participants = request.data.get('participants')
			m = request.data.get('message')

			participants = participants.split(',')
			
			for pemail in participants:
				participant = GolfUser.objects.get(email = pemail)
				conversation.participants.add(participant)
				cs = ConversationStatus(user=participant,
					conversation=conversation
					)
				cs.save()

			conversation.participants.add(request.user)
			cs = ConversationStatus(user=request.user,
				conversation=conversation
				)
			cs.save()

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
		except:
			from sys import exc_info
			return Response(str(exc_info()), status=status.HTTP_400_BAD_REQUEST)

new_conversation = NewConversationView.as_view()

class DeleteConversations(APIView):

	def post(self, request):
		message_ids = request.data.get('ids')

		conversations = Conversation.objects.filter(id__in = message_ids)

		for conversation in conversations:
			cs = ConversationStatus.objects.get(user=request.user,conversation=conversation)
			cs.status = 'D'
			cs.save()
			if conversation.ctype=='G':conversation.participants.remove(request.user)
		
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

		cs = ConversationStatus.objects.get(user=request.user,conversation=conversation)
		cs.status = 'D'
		cs.save()
		if conversation.ctype=='G':conversation.participants.remove(request.user)

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
			if conversation.ctype=='P':
				cs = ConversationStatus.objects.filter(conversation=conversation)
				cs.update(status='A')

			message = Messages(
					message = m,
					created_by=request.user,
				)
			message.save()
			conversation.messages.add(message)
			conversation.save()

			serializer = MessageSerializer(message)

			return Response(serializer.data, status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

new_message = NewMessageView.as_view()



