# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0011_auto_20170209_1746'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='courseuserdetails',
            name='is_following_date',
        ),
    ]
