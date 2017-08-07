# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0014_auto_20170330_1003'),
    ]

    operations = [
        migrations.AlterField(
            model_name='courses',
            name='name',
            field=models.CharField(max_length=300),
        ),
    ]
