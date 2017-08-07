# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0032_scheduledemails'),
    ]

    operations = [
        migrations.RenameField(
            model_name='golfuser',
            old_name='email_email_updates',
            new_name='notify_event_updates',
        ),
        migrations.RenameField(
            model_name='golfuser',
            old_name='email_group_updates',
            new_name='notify_group_updates',
        ),
    ]
