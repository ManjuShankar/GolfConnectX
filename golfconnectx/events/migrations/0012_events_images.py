# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0011_auto_20170316_1645'),
    ]

    operations = [
        migrations.AddField(
            model_name='events',
            name='images',
            field=models.ManyToManyField(to='events.EventImages'),
        ),
    ]
