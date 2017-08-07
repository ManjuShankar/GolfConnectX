#! /home/blackmonk15/.virtualenv/bm/bin/python

import os, sys, re

server = False 
if server:
    sys.path.insert(0,'/home/ubuntu/webapps/')
    sys.path.append('/home/ubuntu/webapps/golfconnectx')
    sys.path.append('/home/ubuntu/webapps/golfconnectx/golfconnectx')
    os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
else:
    sys.path.insert(0,'/home/sandeep/av_workspace/djangoprojects')
    sys.path.append('/home/sandeep/av_workspace/djangoprojects/golfconnectx')
    sys.path.append('/home/sandeep/av_workspace/djangoprojects/golfconnectx/golfconnectx')
    os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
