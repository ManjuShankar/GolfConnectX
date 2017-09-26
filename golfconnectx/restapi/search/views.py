import json
from datetime import datetime

from django.shortcuts import render
from django.core import serializers
from django.views.generic import View
from django.http import HttpResponse, Http404
from django.db.models import Q
from django.conf import settings as mysettings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from search.models import SearchIndex
from search.serializers import SearchResultSerializer
from collections import defaultdict

from events.models import Events
from groups.models import Groups
from posts.models import Post
from usermgmt.models import GolfUser, Notification, Conversation, Invite
from courses.models import Courses
from forums.models import  ForumConversation

class ApiSearchView(APIView):

    def get(self, request, format=None):
    	keyword = request.GET.get('kw')
    	data = {}

    	q =(Q(title__icontains=keyword)|Q(content__icontains=keyword))
    	search_objects = SearchIndex.objects.filter(q,private=False).order_by('id')

    	courses = search_objects.filter(object_type='course')
    	if courses.exists():
    		cserializer = SearchResultSerializer(courses, many=True)
    		data['courses'] = cserializer.data

    	groups = search_objects.filter(object_type='group')
    	if groups.exists():
    		gserializer = SearchResultSerializer(groups, many=True)
    		data['groups'] = gserializer.data

        events = search_objects.filter(object_type='event')
        if events.exists():
            eserializer = SearchResultSerializer(events, many=True)
            data['events'] = eserializer.data


    	posts = search_objects.filter(object_type='post')
    	if posts.exists():
    		pserializer = SearchResultSerializer(posts, many=True)
    		data['posts'] = pserializer.data

    	users = search_objects.filter(object_type='profile').exclude(object_id=request.user.id)
    	if users.exists():
    		userializer = SearchResultSerializer(users, many=True)
    		data['users'] = userializer.data
    		
    	#serializer = SearchResultSerializer(search_objects, many=True)
    	return Response(data)

api_search_view = ApiSearchView.as_view()


def IndexObject(otype,oid):
    try:
        si = SearchIndex.objects.get(object_id = oid,object_type=otype)
    except:
        si = SearchIndex()

    if otype == 'event':
        event = Events.objects.get(id = oid)

        si.object_id = event.id
        si.object_type = 'event'
        si.title = event.name
        si.content = event.venue+' , '+event.address1+' , '+event.city+' , '+str(event.zip_code)
        si.private = event.is_private
        si.object_image_url = event.get_api_crop_cover_image_url()
        si.save()
    elif otype == 'group':
        group = Groups.objects.get(id = oid)
        
        si.object_id = group.id
        si.object_type = 'group'
        si.title = group.name
        si.content = group.description
        si.private = group.is_private
        si.object_image_url = group.get_search_crop_cover_image_url()
        si.save()
    elif otype == 'post':
        post = Post.objects.get(id = oid)

        si.object_id = post.id
        si.object_type = 'post'
        si.title = post.title
        si.content = post.body
        si.object_image_url = post.author.get_api_profile_image_url()
        si.save()
    elif otype == 'profile':
        user = GolfUser.objects.get(id = oid)

        si.object_id = user.id
        si.object_type = 'profile'
        si.title = user.get_full_name()
        si.content = ""
        #si.private = user.is_private
        si.object_image_url = user.get_api_profile_image_url()
        si.save()
    elif otype == 'course':
        course = Courses.objects.get(id = oid)

        si.object_id = course.id
        si.object_type = 'course'
        if course.is_premium:
            si.title = "***"+course.name
        else:
            name = course.name
            name = name.replace('***','')
            si.title = name
        si.content = course.address1+' , '+course.city+' , '+str(course.zip_code)
        if course.is_premium:
            if course.cover_image:
                si.object_image_url = course.cover_image.get_thumbnail_url()
            else:
                si.object_image_url = str(mysettings.SITE_URL)+'/static/themes/img/search/premium.png'
        else:
            si.object_image_url = str(mysettings.SITE_URL)+'/static/themes/img/search/basic.png'
        si.save()
        
    return True


def DeleteItems():
    groups = Groups.objects.all()
    groups.delete()
    print "+++++Groups Deleted+++++"

    events = Events.objects.all()
    events.delete()
    print "+++++Events Deleted+++++"

    posts = Post.objects.all()
    posts.delete()
    print "+++++Posts Deleted+++++"

    forumposts = ForumConversation.objects.all()
    forumposts.delete()
    print "+++++Forum Posts Deleted+++++"

    notifications = Notification.objects.all()
    notifications.delete()
    print "+++++Notifications Deleted+++++"

    messages = Conversation.objects.all()
    messages.delete()
    print "+++++Messages Deleted+++++"

    invites = Invite.objects.all()
    invites.delete()
    print "+++++Invites Deleted+++++"

    types = ['event','group','post','profile']
    sis = SearchIndex.objects.filter(object_type__in=types)
    sis.delete()
    print "+++++Search Index Deleted+++++"

    users = GolfUser.objects.all().exclude(email='admin@golfconnectx.com')
    users.delete()
    print "+++++Users Deleted+++++"

    return True













