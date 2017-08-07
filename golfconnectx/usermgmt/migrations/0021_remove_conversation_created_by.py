# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0020_auto_20170221_0321'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='conversation',
            name='created_by',
        ),
    ]
