# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0008_auto_20170215_1301'),
    ]

    operations = [
        migrations.AlterField(
            model_name='groupfiles',
            name='uploaded_on',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
