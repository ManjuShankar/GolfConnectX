# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion
import events.models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0004_events_venue_course_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventImages',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256, null=True)),
                ('image', models.ImageField(null=True, upload_to=events.models.get_event_image_path, blank=True)),
            ],
        ),
        migrations.AddField(
            model_name='events',
            name='cover_image',
            field=models.ForeignKey(related_name='event_cover_image', on_delete=django.db.models.deletion.SET_NULL, to='events.EventImages', null=True),
        ),
    ]
