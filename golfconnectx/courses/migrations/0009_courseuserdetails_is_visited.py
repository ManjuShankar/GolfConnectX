# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0008_courseuserdetails'),
    ]

    operations = [
        migrations.AddField(
            model_name='courseuserdetails',
            name='is_visited',
            field=models.BooleanField(default=False),
        ),
    ]
