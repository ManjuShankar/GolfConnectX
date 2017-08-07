import json

from usermgmt.models import GolfUser, UserImage
from usermgmt.serializers import UserSerializer, UserProfileSettingsSerializer,\
UserPrivateSettingsSerializer, UserNotificationSettingsSerializer,\
UserEmailSettingsSerializer, UserImageSerializer, GolferSkillsSettingsSerializer

from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from restapi.search.views import IndexObject

class GetAccountSettings(APIView):

	def get(self,request):
		data = {}
		user = request.user
		user_serializer = UserProfileSettingsSerializer(user)
		notification_serializer = UserNotificationSettingsSerializer(user)
		email_serializer = UserEmailSettingsSerializer(user)

		data = {
			'public_settings':user_serializer.data,
			'notification_settings':notification_serializer.data,
			'email_settings':email_serializer.data,
		}
		return Response(data, status=status.HTTP_200_OK)

get_account_settings = GetAccountSettings.as_view()

class UploadUserProfileImage(APIView):

	def post(self,request):
		data = {}
		
		try:
			image = request.data['image']
			image_obj = UserImage()
			image_obj.name = image.name
			image_obj.image = image
			image_obj.save()
			
			user = request.user
			user.profile_image = image_obj
			user.save()
			searchindex = IndexObject('profile',user.id)
			serializer = UserImageSerializer(image_obj)
			return Response(serializer.data, status=status.HTTP_200_OK)
		except:
			data['error'] = str(exc_info())
			data['status'] = 0
			return Response(json.dumps(data), status=status.HTTP_400_BAD_REQUEST)


upload_user_profile_image = UploadUserProfileImage.as_view()

class AccountProfileSettingsView(APIView):
	serializer_class = UserProfileSettingsSerializer
	
	def get(self,request, *args, **kwargs):
		user = request.user
		serializer = UserProfileSettingsSerializer(user)
		return Response(serializer.data)

	def post(self, request, *args, **kwargs):
		
		user = request.user
		serializer = UserProfileSettingsSerializer(user, data=request.data)
		if serializer.is_valid():
			serializer.save()
			'''
			data = request.data

			first_name = data['first_name']
			last_name = data['last_name']
			email = data['email']
			zipcode = data['zipcode']

			user.first_name = first_name
			user.last_name = last_name
			user.email = email
			user.zipcode = zipcode

			user.save()
			'''
			searchindex = IndexObject('profile',user.id)

			serializer = UserProfileSettingsSerializer(user)
			return Response(serializer.data,status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

account_profile_settings = AccountProfileSettingsView.as_view()

class AccountPrivateSettingsView(APIView):
	serializer_class = UserPrivateSettingsSerializer

	def get(self,request, *args, **kwargs):
		user = request.user
		serializer = UserPrivateSettingsSerializer()
		return Response(serializer.data)

	def post(self, request, *args, **kwargs):
		user = request.user

		password = request.data.get('password')
		new_password = request.data.get('new_password')

		is_valid = user.check_password(password)
		if is_valid:
			user.set_password(new_password)
			user.save()
			user = authenticate(username=user.email,password=new_password)
			login(request,user)
		else:
			error = "Current Password is incorrect."
			return Response(error,status=status.HTTP_400_BAD_REQUEST)
		return Response(status=status.HTTP_200_OK)

account_private_settings = AccountPrivateSettingsView.as_view()

class AccountNotificationSettingsView(APIView):
	serializer_class = UserNotificationSettingsSerializer

	def get(self,request, *args, **kwargs):
		user = request.user
		serializer = UserNotificationSettingsSerializer(user)
		return Response(serializer.data)

	def post(self, request, *args, **kwargs):
		user = request.user
		serializer = UserNotificationSettingsSerializer(user, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data,status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

account_notification_settings = AccountNotificationSettingsView.as_view()

class AccountEmailSettingsView(APIView):
	serializer_class = UserEmailSettingsSerializer

	def get(self,request, *args, **kwargs):
		user = request.user
		serializer = UserEmailSettingsSerializer(user)
		return Response(serializer.data)

	def post(self, request, *args, **kwargs):
		user = request.user
		serializer = UserEmailSettingsSerializer(user, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data,status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

account_email_settings = AccountEmailSettingsView.as_view()

from common.models import Skills
from common.serializers import ContentSerializer

class GolferSkillsSettingsView(APIView):
	serializer_class = GolferSkillsSettingsSerializer

	def get(self,request, *args, **kwargs):
		user = request.user
		serializer = GolferSkillsSettingsSerializer(user)
		skills = Skills.objects.filter(content_type = 'skill_levels')
		skillserialzer = ContentSerializer(skills, many=True)

		types = Skills.objects.filter(content_type = 'golfer_type')
		typeserialzer = ContentSerializer(types, many=True)
		data = {
			'skill_levels':skillserialzer.data,
			'golfer_types':typeserialzer.data,
			'details':serializer.data
		}
		return Response(data)
		
	def post(self, request, *args, **kwargs):
		user = request.user
		serializer = GolferSkillsSettingsSerializer(user, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data,status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

golfer_skill_settings = GolferSkillsSettingsView.as_view()