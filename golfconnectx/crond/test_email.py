import getsettings

from django.core.mail import EmailMessage

from django.conf import settings as my_settings

def test_email():
		data = {}
		try:
			to_email=['sandeep.rao@avetoconsulting.com',]

			email_message = 'Welcome to golfconnectx'
			subject = 'Golfconnectx'
			email= EmailMessage(subject,email_message,my_settings.DEFAULT_FROM_EMAIL,to_email)
			email.content_subtype = "html"
			email.send()
		except:
			from sys import exc_info
			print "+++++++++++++++++",exc_info(),"++++++++++++++"
			pass
		return True

#test_email()

from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw
import StringIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from usermgmt.models import UserImage

ALPHA_COLORS = {'A': 'red', 'C': 'blue', 'B': 'green', 'E': 'purple', 'D': 'orange', 
'G': 'green', 'F': 'red', 'I': 'orange', 'H': 'blue', 'K': 'red', 'J': 'purple', 'M': 'blue', 
'L': 'green', 'O': 'purple', 'N': 'orange', 'Q': 'green', 'P': 'red', 'S': 'orange', 'R': 'blue', 
'U': 'red', 'T': 'purple', 'W': 'blue', 'V': 'green', 'Y': 'purple', 'X': 'orange', 'Z': 'red'}

COLORS = ['red','green','blue','orange','purple']
COLORS_RGB = {'red':(255,0,0),'green':(0,255,0),'blue':(0,0,255),'orange':(255,165,0),
'purple':(255,0,127)}

def test_image():

	initials = "WI"
	color = ALPHA_COLORS[initials[0]]

	img = Image.open(color+".png")
	draw = ImageDraw.Draw(img)
	if initials[0] == "W":fontsize = 45
	else:fontsize = 55
	font = ImageFont.truetype(str(my_settings.STATICFILES_DIRS[0])+"themes/fonts/RODUSsquare300.otf", fontsize)

	IH,IW = 136,134
	W,H = font.getsize(initials)
	xycords = (((IW-W)/2), ((IH-H)/2))

	draw.text(xycords,initials,COLORS_RGB[color],font=font,align="center")
	img.save('sample-out.png')

	tempfile = img
	tempfile_io =StringIO.StringIO()
	tempfile.save(tempfile_io, format='PNG')

	image_file = InMemoryUploadedFile(tempfile_io, None, 'pimage.png','image/png',tempfile_io.len, None)

	image_obj = UserImage()
	image_obj.image = image_file
	image_obj.name = "something.png"
	image_obj.save()

	return True

#est_image()
import string
def print_alphabets():
	alphabets_list = list(string.ascii_lowercase)
	data = {}
	new_alphabets_list = [alphabets_list[x:x+5] for x in range(0, len(alphabets_list),5)]

	for alph in new_alphabets_list:
		for idx,alphabet in enumerate(alph):
			data[alphabet.upper()] = COLORS[idx]

#print_alphabets()
from usermgmt.models import GolfUser, Notification
def add_notifications():
	user = GolfUser.objects.get(id = 13)
	for i in range(10):
		notification = Notification(
			user = user,
			created_by = user,
			notification_type = 'GURI',
			object_id=49,
			object_type='group',
			object_name='new test group',
			message="Kruthika wants to test notification"
		)
		notification.save()

#add_notifications()

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
				post.object_type = group.name
				post.object_name = 'Group'
				post.save()
		
	events = Events.objects.all()

	for event in events:
		posts = event.posts.all()
		if posts.exists():
			for post in posts:
				post.object_id = event.id
				post.object_type = event.name
				post.object_name = 'Event'
				post.save()

	courses = Courses.objects.all()

	for course in courses:
		posts = course.posts.all()
		if posts.exists():
			for post in posts:
				post.object_id = course.id
				post.object_type = course.name
				post.object_name = 'Course'
				post.save()

	return True

add_post()
