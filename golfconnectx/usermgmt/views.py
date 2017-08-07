import json

from django.template import Template
from django.template.response import TemplateResponse
from django.core.urlresolvers import reverse
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login, logout
from django.core.mail import EmailMessage
from django.conf import settings as my_settings

from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token

from django.views.generic import ListView, CreateView, UpdateView, View
from usermgmt.forms import SignupForm
from usermgmt.models import GolfUser
from usermgmt.serializers import UserSerializer, UserCreateSerializer, UserLoginSerializer

class Login(View):
	template_name = 'usermgmt/login.html'

	def get_success_url(self):
		return HttpResponseRedirect('/')
	
	def get(self,request, *args, **kwargs):
		
		return render(request,self.template_name)

	def post(self,request, *args, **kwargs):

		data = {}

		email = request.POST.get('useremail')
		password = request.POST.get('password')

		user = authenticate(username=email,password=password)
		if user:
			if user.is_active:
				login(request,user)
				return HttpResponseRedirect('/')
			else:
				data['message'] = 'User account is disabled.'
		else:
			data['message'] = 'Unable to log in with provided credentials.'
		return render(request,self.template_name,data)

login_view = Login.as_view()

class Signup(View):
	template_name = 'usermgmt/signup.html'

	def get_success_url(self):
		return reverse('admin_home')

	def get(self,request, *args, **kwargs):
		form = SignupForm()
		data = {'form':form}
		
		return render(request,self.template_name,data)

	def post(self,request, *args, **kwargs):
		data = {}
		form = SignupForm(request.POST)

		
		if form.is_valid():
			user = form.save()
			
			email = request.POST.get('email')
			password = request.POST.get('password')

			user.set_password(request.POST.get('password'))
			user.save()
			
			user = authenticate(username=email,password=password)
			login(request,user)
			
			return HttpResponseRedirect('/')
		else:
			data['form'] = form

		return render(request,self.template_name,data)

signup_view = Signup.as_view()

class Logout(View):

	def get(self,request):
		logout(request)

		return HttpResponseRedirect('/user/login')

logout_view = Logout.as_view()

class UserStatus(View):

	def get(self,request):
		try:
			if request.user.is_authenticated():
				return HttpResponse('True')
			else:
				return HttpResponse('False')
		except:
			return HttpResponse('True')

class InviteView(View):

	def post(self, request):
		useremails = request.POST.get('email')
		messagebody = request.POST.get('message')
		data = {}

		try:
			to_email=[useremails]
			
			email_message = "Welcome to Golf Connectx. You have been invited to Golf Connectx by "+ str(request.user.get_full_name())+" "+"'"+messagebody+"'"
			subject = 'You have been invited to Golf Connectx'

			email= EmailMessage(subject,email_message,my_settings.DEFAULT_FROM_EMAIL,to_email)
			email.content_subtype = "html"
			email.send()
			data['status'] = 1
		except:
			from sys import exc_info
			data['error'] = str(exc_info())
			data['status'] = 0

		return HttpResponse(json.dumps(data), content_type='application/x-json')

invite_view = InviteView.as_view()