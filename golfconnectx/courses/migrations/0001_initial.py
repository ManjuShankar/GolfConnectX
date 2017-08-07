# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '__first__'),
        ('events', '__first__'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('bubbles', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CourseCategory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Courses',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=250)),
                ('address1', models.CharField(max_length=100)),
                ('address2', models.CharField(max_length=100, null=True)),
                ('city', models.CharField(max_length=50)),
                ('zip_code', models.CharField(max_length=20, null=True)),
                ('state', models.CharField(max_length=50, null=True)),
                ('country', models.CharField(default=b'USA', max_length=20)),
                ('lat', models.FloatField(default=0.0)),
                ('lon', models.FloatField(default=0.0)),
                ('zoom', models.IntegerField(default=0)),
                ('phone', models.CharField(max_length=20, null=True)),
                ('mobile', models.CharField(max_length=20, null=True)),
                ('email', models.EmailField(max_length=75, null=True)),
                ('description', models.TextField()),
                ('is_premium', models.BooleanField(default=False)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('modified_on', models.DateTimeField(auto_now=True)),
                ('last_activity', models.DateTimeField(auto_now=True)),
                ('member_count', models.IntegerField(default=0)),
                ('post_count', models.IntegerField(default=0)),
                ('view_count', models.IntegerField(default=0)),
                ('posts_view_count', models.IntegerField(default=0)),
                ('category', models.ForeignKey(to='courses.CourseCategory')),
                ('created_by', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('events', models.ManyToManyField(to='events.Events')),
                ('followers', models.ManyToManyField(related_name='course_followers', to=settings.AUTH_USER_MODEL)),
                ('groups', models.ManyToManyField(to='bubbles.Bubble')),
                ('posts', models.ManyToManyField(to='posts.Post')),
            ],
        ),
    ]
