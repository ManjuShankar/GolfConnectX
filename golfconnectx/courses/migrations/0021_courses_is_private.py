# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0020_courses_cover_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='courses',
            name='is_private',
            field=models.BooleanField(default=False),
        ),
    ]
