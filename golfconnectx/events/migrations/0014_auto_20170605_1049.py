# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0013_auto_20170605_0924'),
    ]

    operations = [
        migrations.AlterField(
            model_name='eventfiles',
            name='uploaded_on',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
