# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0003_auto_20170228_0901'),
    ]

    operations = [
        migrations.AlterField(
            model_name='searchindex',
            name='title',
            field=models.CharField(max_length=250),
        ),
    ]
