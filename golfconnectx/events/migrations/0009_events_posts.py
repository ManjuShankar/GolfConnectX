# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0005_auto_20170212_0859'),
        ('events', '0008_events_files'),
    ]

    operations = [
        migrations.AddField(
            model_name='events',
            name='posts',
            field=models.ManyToManyField(to='posts.Post'),
        ),
    ]
