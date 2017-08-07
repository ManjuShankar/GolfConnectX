# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0015_auto_20170220_0544'),
    ]

    operations = [
        migrations.AddField(
            model_name='conversation',
            name='modified_on',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='conversation',
            name='created_on',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
