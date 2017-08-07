# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0033_auto_20170714_0734'),
    ]

    operations = [
        migrations.AlterField(
            model_name='golfuser',
            name='notify_event_updates',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='golfuser',
            name='notify_group_updates',
            field=models.BooleanField(default=True),
        ),
    ]
