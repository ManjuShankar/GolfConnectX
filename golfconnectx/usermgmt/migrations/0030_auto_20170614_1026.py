# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0029_auto_20170614_0934'),
    ]

    operations = [
        migrations.AlterField(
            model_name='golfuser',
            name='phone',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
