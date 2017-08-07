# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0012_auto_20170118_1350'),
    ]

    operations = [
        migrations.AddField(
            model_name='golfuser',
            name='zipcode',
            field=models.CharField(max_length=b'10', null=True),
        ),
    ]
