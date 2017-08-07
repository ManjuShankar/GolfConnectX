# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0003_auto_20161229_1521'),
    ]

    operations = [
        migrations.AlterField(
            model_name='groups',
            name='cover_image',
            field=models.ForeignKey(related_name='group_cover_image', on_delete=django.db.models.deletion.SET_NULL, to='groups.GroupImages', null=True),
        ),
    ]
