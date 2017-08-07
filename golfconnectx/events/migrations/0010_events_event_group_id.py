# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0009_events_posts'),
    ]

    operations = [
        migrations.AddField(
            model_name='events',
            name='event_group_id',
            field=models.IntegerField(null=True),
        ),
    ]
