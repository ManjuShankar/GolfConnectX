# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0009_postcomment_images'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='object_is_private',
            field=models.BooleanField(default=False),
        ),
    ]
