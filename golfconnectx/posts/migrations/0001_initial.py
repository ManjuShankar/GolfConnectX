# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('common', '__first__'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=256)),
                ('body', models.TextField()),
                ('post_type', models.CharField(default=b'G', max_length=10)),
                ('view_count', models.IntegerField(default=0)),
                ('comment_count', models.IntegerField(default=0)),
                ('likes_count', models.IntegerField(default=0)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('post_edited', models.BooleanField(default=False)),
                ('author', models.ForeignKey(related_name='author_post', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PostComment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('body', models.TextField()),
                ('likes_count', models.IntegerField(default=0)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('author', models.ForeignKey(related_name='bubble_comment_author', on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, null=True)),
                ('liked_users', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Videos',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('url', models.CharField(max_length=1024)),
                ('type', models.CharField(default=b'Y', max_length=2)),
            ],
        ),
        migrations.AddField(
            model_name='post',
            name='comments',
            field=models.ManyToManyField(related_name='post_comments', to='posts.PostComment'),
        ),
        migrations.AddField(
            model_name='post',
            name='files',
            field=models.ManyToManyField(related_name='post_file', to='common.File'),
        ),
        migrations.AddField(
            model_name='post',
            name='liked_users',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='post',
            name='post_images',
            field=models.ManyToManyField(to='common.File'),
        ),
        migrations.AddField(
            model_name='post',
            name='tags',
            field=models.ManyToManyField(to='common.BubbleTag'),
        ),
        migrations.AddField(
            model_name='post',
            name='videos',
            field=models.ManyToManyField(to='posts.Videos'),
        ),
    ]
