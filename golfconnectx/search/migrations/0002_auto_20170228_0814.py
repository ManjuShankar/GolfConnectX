# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='searchindex',
            name='description',
        ),
        migrations.AddField(
            model_name='searchindex',
            name='content',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='searchindex',
            name='private',
            field=models.BooleanField(default=False),
        ),
    ]
