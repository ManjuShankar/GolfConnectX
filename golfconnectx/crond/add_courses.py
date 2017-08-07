import getsettings
import csv
import geocoder

from courses.models import Courses
from usermgmt.models import GolfUser
def add_courses():
	user = GolfUser.objects.get(id = 1)
	csvfile = open('golfcourses.csv','rw')

	rows = csv.DictReader(csvfile)
	count = 0
	for row in rows:

		name = row['NAME']
		try:
			course = Courses.objects.get(name = name)
		except:

			address1 = row['ADDRESS1']
			city = row['CITY']
			state = row['STATE']
			zipcode = row['ZIPCODE']
			state = row['STATE']
			country = row['COUNTRY']

			phone = row['PHONE']
			lat = row['LAT']
			lon = row['LON']
			zoom = 14

			if not lat or not lon:
				print "lat and lon is not present for course: ",name

				g = geocoder.google(city +" , "+zipcode+" , "+state)

				lat,lon = g.latlng
				print "+++++++++++",lat,"+++++++++++",lon,"+++++++++++"

			course = Courses(
				name = name,
				address1 = address1,
				city = city,
				state = state,
				zip_code = zipcode,
				country = country,
				phone = phone,
				lat = lat,
				lon = lon,
				zoom = zoom,
				created_by = user,
			)
			course.save()
			print "Added new course ",course.name
		count += 1

	return True

add_courses()