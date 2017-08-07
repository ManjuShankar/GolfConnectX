# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0009_auto_20170215_1301'),
    ]

    operations = [
        migrations.AddField(
            model_name='groups',
            name='files',
            field=models.ManyToManyField(to='groups.GroupFiles'),
        ),
    ]
