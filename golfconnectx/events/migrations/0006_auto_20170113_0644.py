# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0005_auto_20170105_0727'),
    ]

    operations = [
        migrations.AlterField(
            model_name='eventrequestinvitation',
            name='type',
            field=models.CharField(default=b'R', max_length=10),
        ),
    ]
