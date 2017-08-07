import json
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw
import StringIO

from datetime import datetime, timedelta
from django.utils import timezone

from django.template import Template
from django.template.response import TemplateResponse
from django.core.urlresolvers import reverse
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login, logout
from django.core.mail import EmailMessage
from django.conf import settings as my_settings
from django.core.files.uploadedfile import InMemoryUploadedFile

from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token

from django.views.generic import ListView, CreateView, UpdateView, View
from usermgmt.forms import SignupForm
from usermgmt.models import GolfUser, PasswordReset, UserImage, Invite, \
Notification, ScheduledEmails, FriendRequest
from groups.models import GroupsRequestInvitation, Groups
from events.models import EventRequestInvitation, Events
from usermgmt.serializers import UserSerializer, UserCreateSerializer, \
UserLoginSerializer, ForgetPasswordSerializer, OTPSerializer, ChangePwdSerializer, \
InviteSerializer

from restapi.search.views import IndexObject

ALPHA_COLORS = {'A': 'red', 'C': 'blue', 'B': 'green', 'E': 'purple', 'D': 'orange', 
'G': 'green', 'F': 'red', 'I': 'orange', 'H': 'blue', 'K': 'red', 'J': 'purple', 'M': 'blue', 
'L': 'green', 'O': 'purple', 'N': 'orange', 'Q': 'green', 'P': 'red', 'S': 'orange', 'R': 'blue', 
'U': 'red', 'T': 'purple', 'W': 'blue', 'V': 'green', 'Y': 'purple', 'X': 'orange', 'Z': 'red'}

COLORS = ['red','green','blue','orange','purple']
COLORS_RGB = {'red':(255,0,0),'green':(0,255,0),'blue':(0,0,255),'orange':(255,165,0),
'purple':(255,0,127)}

class UserDetails(APIView):

	def get(self, request, *args, **kwargs):
		
		if request.user:
			userid = request.user.id
			user = GolfUser.objects.values('pk','first_name','last_name','is_superuser','email').get(id = int(userid))
			user['is_authenticated'] = request.user.is_authenticated()

		return Response(user)

user_details = UserDetails.as_view()

class ApiSignUp(generics.CreateAPIView):
	permission_classes = (AllowAny,)
	serializer_class = UserCreateSerializer

	def post(self, request, *args, **kwargs):
		serializer = UserCreateSerializer(data = request.data)
		if serializer.is_valid(raise_exception=True):
			
			first_name = request.data['first_name']
			last_name = request.data['last_name']
			email = request.data['email']
			password = request.data['password']
			is_private = request.data.get('is_private')
			zipcode = request.data.get('zipcode')

			user = GolfUser(
					first_name = first_name,
					last_name = last_name,
					email = email,
					zipcode=zipcode
				)
			try:
				if is_private:
					user.is_private = is_private
			except:
				pass
			user.set_password(password)
			user.save()
			
			try:
				code = request.data.get('invite_code')
				invite = Invite.objects.get(token=code,email=user.email)
				
				object_id = invite.object_id
				object_type = invite.object_type

				invites = Invite.objects.filter(email=user.email)
				
				for invite in invites:
					if invite.object_type == 'Group':
						group = Groups.objects.get(id = invite.object_id)
						groupRequest = GroupsRequestInvitation(
							group = group,
							created_by = invite.invited_by,
							to = user,
							type = 'I'
						)
						groupRequest.save()
						usernotification = Notification(
								user = user,
								created_by = invite.invited_by,
								notification_type = 'GURI',
								object_id = group.id,
								object_type = 'Group Invitation',
								object_name = group.name,
								message = invite.invited_by.first_name + ' Sent Invite to be a member of the group '+group.name
							)
						usernotification.save()
					elif invite.object_type == 'Event':
						event = Events.objects.get(id = invite.object_id)
						eventRequest = EventRequestInvitation(
							event = event,
							created_by = invite.invited_by,
							to = user,
							type = 'I'
						)
						eventRequest.save()
						usernotification = Notification(
								user = user,
								created_by = invite.invited_by,
								notification_type = 'EURI',
								object_id = event.id,
								object_type = 'Event Invitation',
								object_name = event.name,
								message = invite.invited_by.first_name + ' Sent Invite to attend the event '+event.name
							)
						usernotification.save()
					elif invite.object_type == 'Friend':
						friendrequest = FriendRequest(from_user = invite.invited_by,to_user = user,status='P')
						friendrequest.save()
						usernotification = Notification(
							user = user,
							notification_type = 'UFRS',
							object_id = friendrequest.id,
							object_name = invite.invited_by.first_name,
							object_type = 'Friend Request',
							message = invite.invited_by.first_name + ' Sent you a friend request'
						)
						usernotification.save()
			except:
				object_id = None
				object_type = None

			user = authenticate(username=email, password=password)

			initials = user.initials()
			color = ALPHA_COLORS[initials[0]]

			if initials[0] == "W":fontsize = 45
			else:fontsize = 55
	
			img = Image.open(str(my_settings.STATICFILES_DIRS[0])+"themes/img/"+color+".png")
			draw = ImageDraw.Draw(img)
			font = ImageFont.truetype(str(my_settings.STATICFILES_DIRS[0])+"themes/fonts/RODUSsquare300.otf", fontsize)

			IH,IW = 136,134
			W,H = font.getsize(initials)
			xycords = (((IW-W)/2), ((IH-H)/2))

			draw.text(xycords,initials,COLORS_RGB[color],font=font,align="center")

			tempfile = img
			tempfile_io =StringIO.StringIO()
			tempfile.save(tempfile_io, format='PNG')

			image_file = InMemoryUploadedFile(tempfile_io, None, 'pimage.png','image/png',tempfile_io.len, None)

			image_obj = UserImage()
			image_obj.name = "profile_image_"+user.first_name
			image_obj.image = image_file
			image_obj.save()

			user.profile_image = image_obj
			user.save()

			login(request,user)
			token,created = Token.objects.get_or_create(user=user)
			data = {
				'id':user.id,
				'name':user.first_name,
				'email':user.email,
				'token':token.key,
				'profile_image_url':user.get_api_profile_image_url(),
				'object_id':object_id,
				'object_type':object_type
			}
			searchindex = IndexObject('profile',user.id)
			return Response(data)
		return Response(serializer.errors, status=HTTP_500_INTERNAL_SERVER_ERROR)

signup_api_view = ApiSignUp.as_view()


class ApiLogin(APIView):
	serializer_class = UserLoginSerializer
	permission_classes = (AllowAny,)

	def post(self, request, *args, **kwargs):
		serializer = UserLoginSerializer(data = request.data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.validated_data['user']
			login(request,user)
			token,created = Token.objects.get_or_create(user=user)
			data = {
				'id':user.id,
				'name':user.first_name,
				'email':user.email,
				'token':token.key,
				'profile_image_url':user.get_api_profile_image_url(),
			}
			return Response(data)
		return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


login_api_view = ApiLogin.as_view()

class ApiLogout(APIView):

	def get(self,request):
		token = Token.objects.get(user=request.user)
		token.delete()
		logout(request)

		return Response({'success':True},status=HTTP_200_OK)

logout_api_view = ApiLogout.as_view()

class InviteView(APIView):
	serializer_class = InviteSerializer

	def post(self,request):
		data = request.data['data']
		useremails = data['useremails']
		messagebody = data['messagebody']

		try:
			to_email=[useremails]

			email_message = "Welcome to Golf Connectx. You have been invited to Golf Connectx by "+ str(request.user.get_full_name())+" "+"'"+messagebody+"'"
			subject = 'You have been invited to Golf Connectx'

			email= EmailMessage(subject,email_message,my_settings.DEFAULT_FROM_EMAIL,to_email)
			email.content_subtype = "html"
			email.send()
			data = {'success':True,'message':'Invitation sent successfully!!!'}
		except:
			data = {'success':False,'message':'Error occurred while sending email.'}

		send_data = json.dumps(data)
		send_json = json.loads(send_data)

		return Response(send_json,status=HTTP_200_OK)

invite_api_view = InviteView.as_view()

class ForgotPassword(APIView):
	permission_classes = (AllowAny,)
	serializer_class = ForgetPasswordSerializer

	def post(self,request):
		email = request.data['email']

		try:
			from random import randint
			user = GolfUser.objects.get(email = email)

			rnum = randint(10000,1000000)
			
			prt = PasswordReset(
				user = user,
				otp = rnum
			)
			prt.save()

			try:
				to_email=[email,]
				email_message = "To reset your Golfconnectx password, please enter this code into the site:"+str(rnum)+"."
				subject = 'Forgot Password'
				sendemail= EmailMessage(subject,email_message,my_settings.DEFAULT_FROM_EMAIL,to_email)
				sendemail.content_subtype = "html"
				sendemail.send()
			except:
				pass

			data = {'success':True,'message':'Security code sent successfully to your email.','email':email}
			status = HTTP_200_OK
		except:
			data = {'success':False,'message':'User with this email doesnot exists!','email':email}
			status = HTTP_400_BAD_REQUEST

		send_data = json.dumps(data)
		send_json = json.loads(send_data)

		return Response(send_json,status=status)

forget_pwd_api_view = ForgotPassword.as_view()

class EnterOTP(APIView):
	permission_classes = (AllowAny,)
	serializer_class = OTPSerializer

	def post(self,request):
		email = request.data['email']
		otp = request.data['otp']

		try:
			user = GolfUser.objects.get(email = email)

			prt = PasswordReset.objects.get(user = user,otp = otp)
			
			mintime = timezone.now() - timedelta(minutes=60)
			if prt.created_on < mintime:
				success = False
				message = "The entered security code has expired."
				status = HTTP_400_BAD_REQUEST
			else:
				success = True
				message = "Entered security code is valid!"
				status = HTTP_200_OK

			data = {'success':success,'message':message,'email':email}
		except:
			data = {'success':False,'message':'Enter a valid security code.','email':email}
			status = HTTP_400_BAD_REQUEST

		send_data = json.dumps(data)
		send_json = json.loads(send_data)

		return Response(send_json,status=status)

enter_otp_api_view = EnterOTP.as_view()

class ChangePassword(APIView):
	permission_classes = (AllowAny,)
	serializer_class = ChangePwdSerializer

	def post(self,request):
		email = request.data['email']
		password = request.data['password']
		cpassword = request.data['confirmPassword']

		try:
			user = GolfUser.objects.get(email = email)
			user.set_password(password)
			user.save()

			data = {'success':True,'message':"Password changed successfully."}
			status = HTTP_200_OK
		except:
			data = {'success':False,'message':"Unexpected error occurred."}
			status = HTTP_400_BAD_REQUEST

		send_data = json.dumps(data)
		send_json = json.loads(send_data)

		return Response(send_json,status=status)

change_password_api_view = ChangePassword.as_view()


class FbApiLogin(APIView):
	serializer_class = UserLoginSerializer
	permission_classes = (AllowAny,)

	def post(self, request, *args, **kwargs):
		data = {}

		fb_id = request.data['id']
		try:
			user = GolfUser.objects.get(fb_id=fb_id)

			user.backend = 'django.contrib.auth.backends.ModelBackend'
			
			login(request,user)
			token,created = Token.objects.get_or_create(user=user)

			data = {
				'id':user.id,
				'name':user.get_full_name(),
				'email':user.email,
				'token':token.key,
				'profile_image_url':user.get_api_profile_image_url(),
				'exists':True,
			}
		except:
			try:
				email = request.data['email']
			except:
				email = None

			name = request.data['name']

			nlist = name.split(" ")

			first_name = nlist[0]
			last_name = nlist[-1]
			
			data = {
				'first_name':first_name,
				'last_name':last_name,
				'fb_id':fb_id,
				'email':email,
				'exists':False,
			}
		return Response(data)

fb_login_api_view = FbApiLogin.as_view()


class FbApiRegistration(APIView):
	permission_classes = (AllowAny,)

	def post(self, request, *args, **kwargs):
		data = {}
		email = request.data['email']
		try:
			user = GolfUser.objects.get(email=email)
			data = {'success':False,'message':"Email already exists."}

			send_data = json.dumps(data)
			send_json = json.loads(send_data)

			return Response(send_json,status=HTTP_400_BAD_REQUEST)
		except:
			first_name = request.data['first_name']
			last_name = request.data['last_name']
			fb_id = request.data['fb_id']
			zipcode = request.data['zipcode']

			user = GolfUser(
					first_name = first_name,
					last_name = last_name,
					email = email,
					fb_id=fb_id,
					zipcode=zipcode
				)
			user.set_password('user123')
			user.save()
			
			initials = user.initials()
			color = ALPHA_COLORS[initials[0]]

			if initials[0] == "W":fontsize = 45
			else:fontsize = 55

			img = Image.open(str(my_settings.STATICFILES_DIRS[0])+"themes/img/"+color+".png")
			draw = ImageDraw.Draw(img)
			font = ImageFont.truetype(str(my_settings.STATICFILES_DIRS[0])+"themes/fonts/RODUSsquare300.otf", fontsize)

			IH,IW = 136,134
			W,H = font.getsize(initials)
			xycords = (((IW-W)/2), ((IH-H)/2))

			draw.text(xycords,initials,COLORS_RGB[color],font=font,align="center")

			tempfile = img
			tempfile_io =StringIO.StringIO()
			tempfile.save(tempfile_io, format='PNG')

			image_file = InMemoryUploadedFile(tempfile_io, None, 'pimage.png','image/png',tempfile_io.len, None)

			image_obj = UserImage()
			image_obj.name = "profile_image_"+user.first_name
			image_obj.image = image_file
			image_obj.save()

			user.profile_image = image_obj
			user.save()
			
			searchindex = IndexObject('profile',user.id)

			user.backend = 'django.contrib.auth.backends.ModelBackend'

			#user = authenticate(username=email, password=password)
			
			login(request,user)
			token,created = Token.objects.get_or_create(user=user)

			data = {
				'id':user.id,
				'name':user.first_name,
				'email':user.email,
				'token':token.key,
				'profile_image_url':user.get_api_profile_image_url(),
			}

		return Response(data)

fb_register_api_view = FbApiRegistration.as_view()

def SendMail(subject,message,user):
	semail = ScheduledEmails(
			subject=subject,
			message=message,
			user=user
		)
	semail.save()

