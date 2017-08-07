import json
from datetime import datetime
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw
import StringIO
from django.core.files.uploadedfile import InMemoryUploadedFile

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
from django.contrib.auth import authenticate, login
from django.conf import settings as mysettings 

from usermgmt.models import UserImage
from usermgmt.serializers import UserNotificationSettingsSerializer, UserEmailSettingsSerializer
from common.mixins import LoginRequiredMixin

from restapi.search.views import IndexObject

ALPHA_COLORS = {'A': 'red', 'C': 'cyan', 'B': 'green', 'E': 'purple', 'D': 'orange', 
'G': 'green', 'F': 'red', 'I': 'orange', 'H': 'cyan', 'K': 'red', 'J': 'purple', 'M': 'cyan', 
'L': 'green', 'O': 'purple', 'N': 'orange', 'Q': 'green', 'P': 'red', 'S': 'orange', 'R': 'cyan', 
'U': 'red', 'T': 'purple', 'W': 'cyan', 'V': 'green', 'Y': 'purple', 'X': 'orange', 'Z': 'red'}

COLORS = ['red','green','cyan','orange','purple']
COLORS_RGB = {'red':(255,0,0),'green':(0,255,0),'cyan':(0,255,255),'orange':(255,165,0),
'purple':(255,0,127)}

class AccountSettings(LoginRequiredMixin,View):
	template_name = 'usermgmt/account_settings.html'

	def get(self, request):
		data = {}
		data['user'] = request.user
		
		user = request.user
		initials = user.initials()
		color = ALPHA_COLORS[initials[0]]

		img = Image.open(str(mysettings.STATICFILES_DIRS[0])+"themes/img/"+color+".png")
		draw = ImageDraw.Draw(img)
		font = ImageFont.truetype(str(mysettings.STATICFILES_DIRS[0])+"themes/fonts/RODUSsquare300.otf", 50)		

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

		return render(request, self.template_name,data)


account_settings =  AccountSettings.as_view()

def upload_user_profile_image(request):
	data = {}
	
	image = request.FILES['image']

	try:
		image_obj = UserImage()
		image_obj.name = image.name
		image_obj.image = image
		image_obj.save()

		user = request.user
		user.profile_image = image_obj
		user.save()

		data = {"url":"/site_media/"+str(image_obj.image),"id":image_obj.id,"status":1}
	except:
		data['status'] = 0
	return HttpResponse(json.dumps(data), content_type='application/x-json')


class SaveProfileSettings(LoginRequiredMixin,View):

	def post(self,request):
		data = {}

		first_name = request.POST.get('first_name')
		last_name = request.POST.get('last_name')
		phone = request.POST.get('phone')
		new_password = request.POST.get('new_password')

		user = request.user
		user.first_name = first_name
		user.last_name = last_name
		user.phone = phone
		user.save()

		if new_password:
			user.set_password(new_password)
			user.save()
			user = authenticate(username=user.email,password=new_password)
			login(request,user)

		profile_image_id = request.POST.get('profile_image')
		if profile_image_id:
			userimage = UserImage.objects.get(id = int(profile_image_id))
			user.profile_image = userimage
			user.save()

		searchindex = IndexObject('profile',user.id)
		data['status'] = 1

		return HttpResponse(json.dumps(data), content_type='application/x-json')

save_profile_settings =  SaveProfileSettings.as_view()

class SaveGolfSkillSettings(LoginRequiredMixin,View):

	def post(self,request):
		data = {}

		skill_level = request.POST.get('skill_level')
		handicap = request.POST.get('handicap')
		golfer_type = request.POST.get('golfer_type')
		user = request.user

		user.skill_level = skill_level
		user.handicap = handicap
		user.golfer_type = golfer_type

		user.save()
		data['status'] = 1
		return HttpResponse(json.dumps(data), content_type='application/x-json')

save_golf_skill_settings = SaveGolfSkillSettings.as_view()

class SavePrivateSettings(LoginRequiredMixin,View):
	def post(self,request):
		data = {}

		is_private = request.POST.get('is_private')
		user = request.user
		if is_private:
			user.is_private = True
		else:
			user.is_private = False
		user.save()
		searchindex = IndexObject('profile',user.id)
		data['status'] = 1
		return HttpResponse(json.dumps(data), content_type='application/x-json')

save_private_settings = SavePrivateSettings.as_view()

class SaveNotificationSettings(LoginRequiredMixin,View):

	def post(self,request):
		data = {}

		user = request.user

		serializer = UserNotificationSettingsSerializer(user, data=request.POST)
		if serializer.is_valid():
			serializer.save()

		data['status'] = 1
		return HttpResponse(json.dumps(data), content_type='application/x-json')

save_notification_settings = SaveNotificationSettings.as_view()

class SaveEmailSettings(LoginRequiredMixin,View):

	def post(self,request):
		data = {}

		user = request.user

		serializer = UserEmailSettingsSerializer(user, data=request.POST)
		if serializer.is_valid():
			serializer.save()

		data['status'] = 1
		return HttpResponse(json.dumps(data), content_type='application/x-json')

save_email_settings = SaveEmailSettings.as_view()

class CheckCurrentPassword(LoginRequiredMixin,View):

	def get(self,request):
		data = {}
		password = request.GET.get('password')
		valid = request.user.check_password(password)
		data['status'] = valid

		return HttpResponse(json.dumps(data), content_type='application/x-json')

check_current_password = CheckCurrentPassword.as_view()