# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0010_groups_files'),
    ]

    operations = [
        migrations.AddField(
            model_name='groupimages',
            name='height',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='groupimages',
            name='width',
            field=models.IntegerField(default=0),
        ),
    ]
