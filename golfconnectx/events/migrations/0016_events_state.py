# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0015_auto_20170713_1046'),
    ]

    operations = [
        migrations.AddField(
            model_name='events',
            name='state',
            field=models.CharField(max_length=10, null=True),
        ),
    ]
