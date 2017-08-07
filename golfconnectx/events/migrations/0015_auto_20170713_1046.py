# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0014_auto_20170605_1049'),
    ]

    operations = [
        migrations.AlterField(
            model_name='eventsaccess',
            name='attending',
            field=models.CharField(default=b'Y', max_length=10),
        ),
    ]
