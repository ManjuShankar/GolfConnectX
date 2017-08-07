# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0026_golfuser_handicap'),
    ]

    operations = [
        migrations.AlterField(
            model_name='golfuser',
            name='skill_level',
            field=models.CharField(default=b'B', max_length=b'50'),
        ),
    ]
