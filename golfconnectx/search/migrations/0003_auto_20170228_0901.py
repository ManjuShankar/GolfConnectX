# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0002_auto_20170228_0814'),
    ]

    operations = [
        migrations.AddField(
            model_name='searchindex',
            name='object_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='searchindex',
            name='object_url',
            field=models.CharField(max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='searchindex',
            name='object_type',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
