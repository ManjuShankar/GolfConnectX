# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0018_auto_20170220_0928'),
    ]

    operations = [
        migrations.AlterField(
            model_name='conversation',
            name='name',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
