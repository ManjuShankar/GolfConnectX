# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import groups.models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0003_remove_courses_groups'),
        ('events', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('posts', '0002_auto_20161219_0940'),
    ]

    operations = [
        migrations.CreateModel(
            name='GroupImages',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256, null=True)),
                ('image', models.ImageField(null=True, upload_to=groups.models.get_group_image_path, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Groups',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256)),
                ('description', models.TextField()),
                ('is_active', models.BooleanField(default=True)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('modified_on', models.DateTimeField(auto_now=True)),
                ('is_private', models.BooleanField(default=False)),
                ('admins', models.ManyToManyField(related_name='group_admins', to=settings.AUTH_USER_MODEL)),
                ('course', models.ForeignKey(related_name='home_course', to='courses.Courses')),
                ('cover_image', models.ForeignKey(related_name='group_cover_image', to='groups.GroupImages')),
                ('created_by', models.ForeignKey(related_name='group_created_by', to=settings.AUTH_USER_MODEL)),
                ('events', models.ManyToManyField(to='events.Events')),
                ('images', models.ManyToManyField(to='groups.GroupImages')),
                ('members', models.ManyToManyField(related_name='group_members', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(related_name='group_modified_by', to=settings.AUTH_USER_MODEL)),
                ('posts', models.ManyToManyField(to='posts.Post')),
            ],
        ),
    ]
