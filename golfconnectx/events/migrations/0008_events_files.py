# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0007_eventfiles'),
    ]

    operations = [
        migrations.AddField(
            model_name='events',
            name='files',
            field=models.ManyToManyField(to='events.EventFiles'),
        ),
    ]
