import getsettings

from courses.models import Courses, CourseUserDetails
from usermgmt.models import GolfUser

def add_course_details():
	users = GolfUser.objects.all()

	courses = Courses.objects.all()

	for user in users:
		for course in courses:
			cud = CourseUserDetails()
			cud.course = course
			cud.user = user
			cud.save()
			print "++++++++++User details saved for ",user.first_name,"+++++",course.name,"+++++++++"


#add_course_details()

def add_new_course_details():
	user = GolfUser.objects.get(id = 41)

	courses = Courses.objects.all()

	for course in courses:
		cud = CourseUserDetails()
		cud.course = course
		cud.user = user
		cud.save()
		print "++++++++++User details saved for ",user.first_name,"+++++",course.name,"+++++++++"


#add_new_course_details()

from groups.models import Groups
from events.models import Events
from courses.models import Courses

def add_post():
	groups = Groups.objects.all()
	
	for group in groups:
		print "+++++++++",group.name,"+++++++++++++"
		
		posts = group.posts.all()

		print "+++++++",posts,"++++++++++"
		if posts.exists():
			for post in posts:
				post.object_id = group.id
				post.object_name = group.name
				post.object_type = 'Group'
				post.save()
		
	events = Events.objects.all()

	for event in events:
		posts = event.posts.all()
		if posts.exists():
			for post in posts:
				post.object_id = event.id
				post.object_name = event.name
				post.object_type = 'Event'
				post.save()

	courses = Courses.objects.all()

	for course in courses:
		posts = course.posts.all()
		if posts.exists():
			for post in posts:
				post.object_id = course.id
				post.object_name = course.name
				post.object_type = 'Course'
				post.save()

	return True

add_post()