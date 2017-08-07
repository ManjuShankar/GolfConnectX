# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0022_auto_20170306_0655'),
    ]

    operations = [
        migrations.AlterField(
            model_name='golfuser',
            name='golfer_type',
            field=models.CharField(default=b'PU', max_length=b'50'),
        ),
        migrations.AlterField(
            model_name='golfuser',
            name='skill_level',
            field=models.CharField(default=b'B', max_length=b'50'),
        ),
    ]
