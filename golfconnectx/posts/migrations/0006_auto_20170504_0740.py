# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0005_auto_20170212_0859'),
    ]

    operations = [
        migrations.AddField(
            model_name='postcomment',
            name='object_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='postcomment',
            name='object_name',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='postcomment',
            name='object_type',
            field=models.CharField(max_length=20, null=True),
        ),
    ]
