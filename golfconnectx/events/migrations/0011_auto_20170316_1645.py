# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0010_events_event_group_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventimages',
            name='height',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='eventimages',
            name='width',
            field=models.IntegerField(default=0),
        ),
    ]
