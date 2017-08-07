# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0023_auto_20170314_0940'),
    ]

    operations = [
        migrations.AlterField(
            model_name='golfuser',
            name='skill_level',
            field=models.CharField(default=b'B', max_length=b'50', choices=[(b'B', b'Beginner'), (b'I', b'Intermediate'), (b'A', b'Advance'), (b'E', b'Expert')]),
        ),
    ]
