from rest_framework import serializers
from datetime import datetime

from events.models import Events, EventImages, EventsAccess, EventFiles,\
EventRequestInvitation
from usermgmt.serializers import UserListSerializer, UserSerializer

class EventImageSerializer(serializers.ModelSerializer):
	image = serializers.SerializerMethodField()
	thumbnail = serializers.SerializerMethodField()

	def get_image(self, obj):
		return obj.get_image_url()

	def get_thumbnail(self, obj):
		return obj.get_thumbnail_url()

	class Meta:
		model = EventImages
		fields = ('id','name','image','height','width','thumbnail')

class EventCalendarImageSerializer(serializers.ModelSerializer):
	image = serializers.SerializerMethodField('get_thumbnail_url')

	def get_thumbnail_url(self, obj):
		return obj.get_calendar_cover_image_url()

	class Meta:
		model = EventImages
		fields = ('id','name','image')

class FileSerializer(serializers.ModelSerializer):
	file = serializers.SerializerMethodField('get_download_url')
	uploaded_on = serializers.DateTimeField('%b %d, %Y')
	uploaded_by = serializers.StringRelatedField()

	def get_download_url(self, obj):
		return obj.get_file_url()

	class Meta:
		model = EventFiles
		fields = ('id','file','name','uploaded_by','uploaded_on')

class EventSerializer(serializers.ModelSerializer):
	created_by = UserSerializer()
	start_date = serializers.DateField('%A %B %d, %Y')
	end_date = serializers.DateField('%A %B %d, %Y')
	start_time = serializers.DateField('%I:%M %p')
	end_time = serializers.DateField('%I:%M %p')
	cover_image = EventImageSerializer()
	files = FileSerializer(many=True)

	start_date_format = serializers.SerializerMethodField('get_start_date')
	end_date_format = serializers.SerializerMethodField('get_end_date')

	attendee_stats = serializers.SerializerMethodField('get_attending_stats')

	selected_group = serializers.SerializerMethodField('get_selected_group_details')

	has_access = serializers.SerializerMethodField()
	request_status = serializers.SerializerMethodField()
	attendee_status = serializers.SerializerMethodField()

	def get_attending_stats(self,obj):
		return obj.get_attendee_stats()

	def get_start_date(self,obj):
		start_date = obj.start_date.strftime('%m/%d/%Y')
		return start_date

	def get_end_date(self,obj):
		end_date = obj.end_date.strftime('%m/%d/%Y')
		return end_date

	def get_selected_group_details(self,obj):
		return obj.get_selected_group_details()

	def get_has_access(self,obj):
		request = self.context['request']
		if obj.created_by == request.user:
			access = True
		else:
			try:
				access = EventsAccess.objects.get(event=obj,user=request.user)
				access = True
			except:
				access = False
		return access

	def get_attendee_status(self,obj):
		request = self.context['request']
		if obj.created_by == request.user:
			attending = 'Y'
		else:
			try:
				attending_obj = EventsAccess.objects.get(event=obj,user=request.user)
				attending = attending_obj.attending
			except:
				attending = 'N'
		return attending

	def get_request_status(self,obj):
		request = self.context['request']
		try:
			ereq = EventRequestInvitation.objects.get(event=obj,created_by=request.user,type='R',accept='M')
			status = True
		except:
			status = False
		return status

	class Meta:
		model = Events
		fields = ('id','name','description','start_date','end_date','start_time','end_time','venue',
			'address1','address2','city','state','zip_code','phone','email','is_private','lat','lon',
			'created_by','cover_image','attendee_stats','files','start_date_format','end_date_format',
			'venue_course_id','event_group_id','selected_group','has_access','request_status','attendee_status')

class CalendarEventSerializer(serializers.ModelSerializer):
	created_by = UserListSerializer()
	start_date = serializers.DateField('%A %B %d, %Y')
	end_date = serializers.DateField('%A %B %d, %Y')
	start_time = serializers.DateField('%H:%M')
	end_time = serializers.DateField('%H:%M')
	cover_image = EventCalendarImageSerializer()
	
	selected_group = serializers.SerializerMethodField('get_selected_group_details')

	def get_selected_group_details(self,obj):
		return obj.get_selected_group_details()

	class Meta:
		model = Events
		fields = ('id','name','description','start_date','end_date','start_time','end_time','venue',
			'address1','address2','city','state','zip_code','is_private','created_by','cover_image',
			'venue_course_id','event_group_id',"selected_group")


class EventListSerializer(serializers.ModelSerializer):
    start_date = serializers.DateField('%A %B %d, %Y')
    end_date = serializers.DateField('%A %B %d, %Y')
    start_time = serializers.DateField('%I:%M %p ')
    end_time = serializers.DateField('%I:%M %p')
    cover_image = EventImageSerializer()
    created_by = UserSerializer()
    attendee_stats = serializers.SerializerMethodField('get_attending_stats')

    def get_attending_stats(self,obj):
    	return obj.get_attendee_stats()

    class Meta:
    	model = Events
    	fields = ('id','name','start_time','end_time','start_date','end_date','is_private',
    		'cover_image','attendee_stats','created_by')


class EventAddSerializer(serializers.ModelSerializer):

	class Meta:
		model = Events
		fields = ('id','name','description','start_date','end_date','start_time','end_time','venue',
			'is_private','address1','city','zip_code','state')

class EventInviteSerializer(serializers.Serializer):
	email = serializers.EmailField()

class EventAccessSerializer(serializers.ModelSerializer):

	class Meta:
		model = EventsAccess
		fields = ('attending')
	