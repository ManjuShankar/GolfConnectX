from rest_framework.serializers import (
		ModelSerializer,
		Serializer,
		CharField,
		ChoiceField,
		ValidationError,
		SerializerMethodField,
		DateTimeField,
		StringRelatedField,
		ListField,
		IntegerField
	)
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import authenticate, login, logout

from usermgmt.models import GolfUser, Notification, UserImage, Conversation,\
CONVERSATION_TYPE, Messages, GOLFER_SKILLS

from rest_framework.authtoken.models import Token

class UserImageSerializer(ModelSerializer):
	image = SerializerMethodField('get_thumbnail_url')
	
	def get_thumbnail_url(self, obj):
		return obj.get_image_url()

	class Meta:
		model = UserImage
		fields = ('id','name','image')

class UserSerializer(ModelSerializer):
	#profile_image = UserImageSerializer()
	profile_image_url = SerializerMethodField('get_thumbnail_url')
	joined = SerializerMethodField('time_since')
	initials = SerializerMethodField('get_user_initials')

	def time_since(self,obj):
		from django.utils.timesince import timesince
		return timesince(obj.created_on)

	def get_thumbnail_url(self, obj):
		return obj.get_api_profile_image_url()

	def get_user_initials(self, obj):
		return obj.get_initials()
		
	class Meta:
		model = GolfUser
		fields = ('id','first_name','last_name','email','phone','is_private','zipcode','profile_image_url',
			'joined','initials')

class DirectoryUserSerializer(ModelSerializer):
	profile_image_url = SerializerMethodField('get_thumbnail_url')
	joined = SerializerMethodField('time_since')
	is_friend = SerializerMethodField('is_user_friend')
	initials = SerializerMethodField('get_user_initials')

	def get_thumbnail_url(self, obj):
		return obj.get_api_profile_image_url()

	def time_since(self,obj):
		from django.utils.timesince import timesince
		return timesince(obj.created_on)

	def get_user_initials(self, obj):
		return obj.get_initials()
		
	def is_user_friend(self,obj):
		user = self.context['request'].user
		if obj in user.friends.all():
			friend = True
		else:
			friend = False
		return friend


	class Meta:
		model = GolfUser
		fields = ('id','first_name','last_name','email','phone','is_private','zipcode','profile_image_url',
			'joined','initials','is_friend')


class UserListSerializer(ModelSerializer):
	name = SerializerMethodField('get_user_name')

	def get_user_name(self,obj):
		return obj.get_full_name()

	class Meta:
		model = GolfUser
		fields = ('id','first_name','email','name')

class UserCreateSerializer(ModelSerializer):
	password = CharField(style={'input_type':'password'})
	confirmPassword = CharField(style={'input_type':'password'},label='Confirm Password')

	class Meta:
		model = GolfUser
		fields = ('first_name','last_name','email','password','confirmPassword','is_private','zipcode')

	
	def validate(self,data):
		data = self.get_initial()
		email = data.get('email')
		try:
			user = GolfUser.objects.get(email = email)
			raise ValidationError('User with that email exists')
		except:
			pass
		password = data.get('password')
		confirmPassword = data.get('confirmPassword')
		if password != confirmPassword:
			raise ValidationError('Confirm Password should be same as password')
		return data
		
	def create(self,validated_data):
		first_name = validated_data['first_name']
		last_name = validated_data['last_name']
		email = validated_data['email']
		password = validated_data['password']
		is_private = validated_data['is_private']
		zipcode = validated_data['zipcode']

		user = GolfUser(
				first_name = first_name,
				last_name = last_name,
				email = email,
				is_private = is_private,
			)
		user.set_password(password)
		user.save()
		validated_data['user'] = user
		return validated_data
	


class UserLoginSerializer(ModelSerializer):
	email = CharField(label=_("Useremail"))
	password = CharField(label=_("Password"), style={'input_type': 'password'})

	class Meta:
		model = GolfUser
		fields = ('email','password')
		extra_kwargs = {'password':{'write_only':True}}

	def validate(self, attrs):
		username = attrs.get('email')
		password = attrs.get('password')

		if username and password:
			user = authenticate(username=username, password=password)
			if user:
				if not user.is_active:
					msg = _('User account is disabled.')
					raise ValidationError(msg, code='authorization')
			else:
				msg = _('Unable to log in with provided credentials.')
				raise ValidationError(msg, code='authorization')
		else:
			msg = _('Must include "username" and "password".')
			raise ValidationError(msg, code='authorization')

		attrs['user'] = user
		return attrs


class UserProfileSettingsSerializer(ModelSerializer):
	profile_image_url = SerializerMethodField('get_thumbnail_url')

	def get_thumbnail_url(self, obj):
		return obj.get_api_profile_image_url()

	class Meta:
		model = GolfUser
		fields = ('id','first_name','last_name','email','phone','zipcode','is_private',
			'skill_level','handicap','golfer_type','profile_image_url')

class UserPrivateSettingsSerializer(Serializer):
	password = CharField(style={'input_type':'password'})
	new_password = CharField(style={'input_type':'password'},label='Confirm Password')
	confirm_password = CharField(style={'input_type':'password'},label='Confirm Password')

class UserNotificationSettingsSerializer(ModelSerializer):

	class Meta:
		model = GolfUser
		fields = ('id','notify_like_post','notify_comment_post','notify_share_post',
			'notify_comment_discussion','notify_invite_event','notify_accept_invitation',
			'notify_event_join','notify_event_updates','notify_group_updates')

class UserEmailSettingsSerializer(ModelSerializer):

	class Meta:
		model = GolfUser
		fields = ('id','email_invitation','email_messages','email_notifications',
			'email_site_messages')

class GolferSkillsSettingsSerializer(ModelSerializer):
	skill_level = ChoiceField(choices=GOLFER_SKILLS)

	class Meta:
		model = GolfUser
		fields = ('id','skill_level','handicap','golfer_type')

class NotificationSerializer(ModelSerializer):

	created_on = DateTimeField('%b %d - %I:%M %p')
	
	class Meta:
		model = Notification
		fields = ('id','message','object_id','object_type','object_name','notification_type','created_on','user','read')

class ConversationSerializer(ModelSerializer):
	name = SerializerMethodField('get_conversation_title')
	participants = SerializerMethodField('get_participants_list')
	first_message = SerializerMethodField('get_conversation_message')
	created_on = DateTimeField('%b %d - %I:%M %p')
	modified_on = DateTimeField('%b %d - %I:%M %p')

	def get_conversation_title(self, obj):
		user = self.context['request'].user
		return obj.get_conversation_name(user)
		
	def get_participants_list(self, obj):
		user = self.context['request'].user
		return obj.get_participants(user)

	def get_conversation_message(self,obj):
		return obj.get_first_message()

	class Meta:
		model = Conversation
		fields = ('id','name','created_on','modified_on','participants','first_message')

class AddConversationSerializer(ModelSerializer):
	message = CharField(label=_("Message"), style={'input_type': 'text'})
	ctype = ChoiceField(choices =CONVERSATION_TYPE)
	
	class Meta:
		model = Conversation
		fields = ('id','name','created_on','modified_on','participants','message','ctype')
		extra_kwargs = {
						'message':{'write_only':True},
						}

class MessageSerializer(ModelSerializer):
	created_on = DateTimeField('%b %d, %Y | %I:%M %p')
	created_by = UserSerializer()
	
	class Meta:
		model = Messages
		fields = ('id','message','created_by','created_on')

class AddMessageSerializer(ModelSerializer):

	class Meta:
		model = Messages
		fields = ('message',)

class ConversationDetailsSerializer(ModelSerializer):
	participants = UserSerializer(many=True)
	messages = MessageSerializer(many=True)

	class Meta:
		model = Conversation
		fields = ('id','name','created_on','modified_on','participants','messages')

class ForgetPasswordSerializer(Serializer):
	email = CharField(label=_("Enter your email"), style={'input_type': 'text'})

class OTPSerializer(Serializer):
	email = CharField(label=_("Enter your email"), style={'input_type': 'text'})
	otp = CharField(label=_("Enter the otp sent"), style={'input_type': 'text'})

class ChangePwdSerializer(Serializer):
	email = CharField(label=_("Enter your email"), style={'input_type': 'text'})
	password = CharField(label=_("New Password"), style={'input_type': 'password'})
	confirmPassword = CharField(label='Confirm Password',style={'input_type':'password'})

class InviteSerializer(Serializer):
	useremail = CharField(label=_("Enter Email"), style={'input_type': 'text'})
	messagebody = CharField(label=_("Enter Message"), style={'input_type': 'text'})

