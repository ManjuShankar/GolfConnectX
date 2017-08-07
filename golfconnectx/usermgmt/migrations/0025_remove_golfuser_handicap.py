# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0024_auto_20170315_1226'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='golfuser',
            name='handicap',
        ),
    ]
