# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0012_remove_courseuserdetails_is_following_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='courseuserdetails',
            name='is_following_date',
            field=models.DateTimeField(null=True),
        ),
    ]
