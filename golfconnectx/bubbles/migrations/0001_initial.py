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
            name='Bubble',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256)),
                ('description', models.TextField()),
                ('color', models.CharField(default=b'orange', max_length=20)),
                ('active', models.BooleanField(default=True)),
                ('bubble_type', models.IntegerField(default=0)),
                ('icon', models.CharField(max_length=32, null=True)),
                ('suggested', models.BooleanField(default=False)),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('allow_leaving', models.BooleanField(default=False)),
                ('read_only', models.BooleanField(default=False)),
                ('last_activity', models.DateTimeField(auto_now=True)),
                ('contact_name', models.CharField(max_length=128)),
                ('contact_email', models.CharField(max_length=128)),
                ('contact_url', models.CharField(max_length=256)),
                ('last_email_notification', models.DateTimeField(null=True)),
                ('updates_delayed', models.BooleanField(default=False)),
                ('member_count', models.IntegerField(default=0)),
                ('post_count', models.IntegerField(default=0)),
                ('view_count', models.IntegerField(default=0)),
                ('posts_view_count', models.IntegerField(default=0)),
                ('campus', models.ForeignKey(related_name='campus_bubble', on_delete=django.db.models.deletion.SET_NULL, to='common.Campus', null=True)),
                ('category', models.ForeignKey(related_name='bubbles', to='common.BubbleCategory')),
                ('cover', models.ForeignKey(related_name='bubble_cover_image', on_delete=django.db.models.deletion.SET_NULL, to='common.File', null=True)),
                ('image', models.ForeignKey(related_name='bubble_image', on_delete=django.db.models.deletion.SET_NULL, to='common.File', null=True)),
                ('tags', models.ManyToManyField(to='common.BubbleTag')),
            ],
        ),
        migrations.CreateModel(
            name='BubbleRole',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('status', models.IntegerField(default=0)),
                ('updates_enabled', models.BooleanField(default=True)),
                ('updates_delayed', models.BooleanField(default=False)),
                ('bubble', models.ForeignKey(related_name='roles', on_delete=django.db.models.deletion.SET_NULL, to='bubbles.Bubble', null=True)),
                ('created_by', models.ForeignKey(related_name='role_created_by', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='CategoryMembershipRoles',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256)),
                ('required', models.BooleanField(default=False)),
                ('max_count', models.IntegerField(default=0, null=True)),
                ('position', models.IntegerField(null=True)),
                ('category', models.ForeignKey(related_name='membership_role', to='common.BubbleCategory')),
            ],
        ),
        migrations.AddField(
            model_name='bubblerole',
            name='membership_role',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, to='bubbles.CategoryMembershipRoles', null=True),
        ),
        migrations.AddField(
            model_name='bubblerole',
            name='user',
            field=models.ForeignKey(related_name='bubble_roles', on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, null=True),
        ),
    ]
