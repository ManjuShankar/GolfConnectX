import getsettings
from datetime import datetime
from courses.models import Courses, CourseUserDetails
from events.models import Events
from groups.models import Groups
from posts.models import Post
from usermgmt.models import GolfUser
from search.models import SearchIndex
from django.conf import settings as mysettings

def delete_existing():
	try:
		sis = SearchIndex.objects.all()
		sis.delete()
	except:
		pass
	print "Deleted existing indexes."

#delete_existing()

def add_course_index():
	courses = Courses.objects.all()
	for course in courses:
		try:
			si = SearchIndex.objects.get(object_id=course.id,object_type='course')
			si.title = course.name
			si.content = course.address1+' , '+course.city+' , '+str(course.zip_code)
			si.object_image_url = mysettings.SITE_URL+"/static/themes/img/default_profile_image_old.jpg"
		except:
			si = SearchIndex(
				title = course.name,
				content = course.address1+' , '+course.city+' , '+str(course.zip_code),
				object_id = course.id,
				object_type = 'course',
				object_image_url = mysettings.SITE_URL+"/static/themes/img/default_profile_image_old.jpg"
			)
		si.save()
	print "Indexed ",courses.count()," courses."


def add_event_index():
	events = Events.objects.all()
	for event in events:
		try:
			si = SearchIndex.objects.get(object_id=event.id,object_type='event')
			si.title = event.name
			si.content = event.venue+' , '+event.address1+' , '+event.city+' , '+str(event.zip_code)
			si.private = event.is_private
			si.object_image_url = event.get_api_crop_cover_image_url()
		except:
			si = SearchIndex(
				title = event.name,
				content = event.venue+' , '+event.address1+' , '+event.city+' , '+str(event.zip_code),
				object_id = event.id,
				object_type = 'event',
				private = event.is_private,
				object_image_url = event.get_api_crop_cover_image_url()
			)
		si.save()
	print "Indexed ",events.count()," events."


def add_group_index():
	groups = Groups.objects.all()
	for group in groups:
		try:
			si = SearchIndex.objects.get(object_id=group.id,object_type='group')
			si.title = group.name
			si.content = group.description
			si.private = group.is_private
			si.object_image_url = group.get_api_crop_cover_image_url()
		except:
			si = SearchIndex(
				title = group.name,
				content = group.description,
				object_id = group.id,
				object_type = 'group',
				private = group.is_private,
				object_image_url = group.get_api_crop_cover_image_url()
			)
		si.save()
	print "Indexed ",groups.count()," groups."


def add_post_index():
	posts = Post.objects.all()
	for post in posts:
		try:
			si = SearchIndex.objects.get(object_id=post.id,object_type='post')
			si.title = post.title
			si.content = post.body
		except:
			si = SearchIndex(
				title = post.title,
				content = post.body,
				object_id = post.id,
				object_type = 'post'
			)
		si.object_image_url = post.author.get_api_profile_image_url()
		si.save()
	print "Indexed ",posts.count()," posts."


def add_profile_index():
	users = GolfUser.objects.all()
	for user in users:
		try:
			si = SearchIndex.objects.get(object_id=user.id,object_type='profile')
			si.title = user.get_full_name()
			si.content = user.email
			si.private = user.is_private
		except:
			si = SearchIndex(
				title = user.get_full_name(),
				content = user.email,
				object_id = user.id,
				object_type = 'profile',
				private = user.is_private,
			)
		si.object_image_url = user.get_api_profile_image_url() 
		si.save()
	print "Indexed ",users.count()," users."

def delete_old_event_index():
	today = datetime.today()
	event_ids =[ event.id for event in Events.objects.filter(end_date__lt=today.date)]
	sis = SearchIndex.objects.filter(object_id__in=event_ids,object_type='event')
	sis.delete()

delete_old_event_index()
'''
add_course_index()
add_profile_index()
add_group_index()
add_post_index()
add_event_index()
'''