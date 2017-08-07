# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0004_auto_20170306_0654'),
    ]

    operations = [
        migrations.AddField(
            model_name='searchindex',
            name='object_image_url',
            field=models.CharField(max_length=250, null=True),
        ),
    ]
