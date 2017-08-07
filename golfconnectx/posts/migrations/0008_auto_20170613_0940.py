# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0007_auto_20170504_0743'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='object_name',
            field=models.CharField(max_length=150, null=True),
        ),
    ]
