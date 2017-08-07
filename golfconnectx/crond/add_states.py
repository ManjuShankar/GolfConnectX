import getsettings
import csv

def add_states():
	csvfile = open('states.csv','rw')
	rows = csv.DictReader(csvfile)
	states = []
	for row in rows:
		print "++++++++++++++++"
		print row
		print '++++++++++++++++'
		state = {'name':row['STATE'],'value':row['CODE']}
		states.append(state)

	print states
add_states()