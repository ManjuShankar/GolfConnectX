# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0009_courseuserdetails_is_visited'),
    ]

    operations = [
        migrations.AddField(
            model_name='courseuserdetails',
            name='is_played',
            field=models.BooleanField(default=False),
        ),
    ]
