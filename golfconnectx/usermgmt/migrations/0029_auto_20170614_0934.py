# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0028_auto_20170614_0655'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invite',
            name='name',
            field=models.CharField(max_length=150, null=True),
        ),
    ]
