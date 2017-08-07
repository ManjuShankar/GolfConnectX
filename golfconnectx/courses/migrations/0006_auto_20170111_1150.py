# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0005_coursescores_notes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coursescores',
            name='played_on',
            field=models.DateField(),
        ),
    ]
