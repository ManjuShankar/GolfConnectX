# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0011_notification_message'),
    ]

    operations = [
        migrations.RenameField(
            model_name='notification',
            old_name='Notification_type',
            new_name='notification_type',
        ),
    ]
