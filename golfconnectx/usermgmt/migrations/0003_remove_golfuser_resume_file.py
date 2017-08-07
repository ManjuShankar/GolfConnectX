# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0002_auto_20161223_1214'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='golfuser',
            name='resume_file',
        ),
    ]
