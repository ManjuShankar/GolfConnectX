# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0004_coursescores'),
    ]

    operations = [
        migrations.AddField(
            model_name='coursescores',
            name='notes',
            field=models.TextField(null=True),
        ),
    ]
