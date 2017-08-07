#views.py
import json

from django.shortcuts import render
from django.template import Template
from django.template.response import TemplateResponse
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.core.exceptions import ObjectDoesNotExist
from django.core import serializers
from django.db.models import Q

from contact.models import Contact
from contact.serializers import ContactSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

class ContactHome(APIView):
    permission_classes = (AllowAny,)
    serializer_class = ContactSerializer
    """
    List all Contact, or create a new snippet.
    """
    def post(self, request, format=None):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
        	serializer.save(created = request.user)
        	return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

contact_home = ContactHome.as_view()

