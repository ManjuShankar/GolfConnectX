# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='EventCategory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256)),
            ],
        ),
        migrations.CreateModel(
            name='Events',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('start_time', models.TimeField(max_length=25, null=True)),
                ('end_time', models.TimeField(max_length=25, null=True)),
                ('venue', models.CharField(max_length=256)),
                ('address1', models.CharField(max_length=50)),
                ('address2', models.CharField(max_length=50, null=True)),
                ('city', models.CharField(max_length=50)),
                ('zip_code', models.CharField(max_length=20, null=True)),
                ('lat', models.FloatField(default=0.0)),
                ('lon', models.FloatField(default=0.0)),
                ('zoom', models.IntegerField(default=0)),
                ('phone', models.CharField(max_length=20, null=True)),
                ('email', models.EmailField(max_length=75, null=True)),
                ('description', models.TextField()),
                ('event_timezone', models.CharField(max_length=100, null=True)),
                ('repeat', models.BooleanField(default=False)),
                ('frequency', models.IntegerField(default=0)),
                ('measure', models.CharField(max_length=20, null=True)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('modified_on', models.DateTimeField(auto_now=True)),
                ('is_private', models.BooleanField(default=False)),
                ('attendees', models.ManyToManyField(related_name='event_attendees', to=settings.AUTH_USER_MODEL)),
                ('category', models.ForeignKey(to='events.EventCategory', null=True)),
                ('created_by', models.ForeignKey(related_name='event_owner', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(related_name='event_modifier', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
