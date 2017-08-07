from django.conf.urls import *
from django.views.generic.base import RedirectView

urlpatterns = patterns('restapi.posts.views',

	url(r'^/?$','posts_home',name='posts_home'),
	
	url(r'^search/?$','posts_search',name='posts_search'),

	url(r'^create/?$','posts_create',name='posts_create'),#Details of the post.
	url(r'^post-upload-images/?$','post_add_images',name='post_add_images'),
	url(r'^comment-upload-images/?$','comment_add_images',name='comment_add_images'),

	url(r'^(?P<pk>[^/]+)/?$','posts_detail',name='posts_detail'),#Details of the post.

	url(r'^(?P<pk>[^/]+)/comments/?$','post_comments',name='post_comments'),#Add/View all the comments under a post.
	url(r'^(?P<pk>[^/]+)/like/?$','like_post',name='like_post'),#Like a post.

	url(r'^(?P<pk>[^/]+)/liked-users/?$','liked_users',name='liked_users'),#List of people who have liked the post.

	url(r'^(?P<pk>[^/]+)/comments/(?P<id>[^/]+)/?$','comment_detail',name='comment_detail'),#Details of the comments in a post.
	url(r'^(?P<pk>[^/]+)/comments/(?P<id>[^/]+)/like/?$','like_comment',name='like_comment'),#Like a particular comment.

	url(r'^(?P<pk>[^/]+)/videos/?$','post_videos',name='post_videos'),#Displays all the videos in a post.
	url(r'^(?P<pk>[^/]+)/videos/(?P<id>[^/]+)/?$','video_detail',name='video_detail'),#Details of the video in a post.

	url(r'^(?P<pk>[^/]+)/gallery/?$','post_gallery',name='post_gallery'),
	url(r'^(?P<pk>[^/]+)/comment-gallery/?$','comment_gallery',name='comment_gallery'),
	url(r'^(?P<pk>[^/]+)/delete-photo/?$','delete_photo',name='delete_photo'),
)