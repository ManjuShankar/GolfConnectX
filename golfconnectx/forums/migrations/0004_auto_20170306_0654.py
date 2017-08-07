# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('forums', '0003_auto_20170227_0935'),
    ]

    operations = [
        migrations.AlterField(
            model_name='topics',
            name='slug',
            field=models.CharField(max_length=250, null=True),
        ),
    ]
