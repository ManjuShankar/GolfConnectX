# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='courses',
            name='member_count',
        ),
        migrations.RemoveField(
            model_name='courses',
            name='post_count',
        ),
        migrations.RemoveField(
            model_name='courses',
            name='posts_view_count',
        ),
    ]
