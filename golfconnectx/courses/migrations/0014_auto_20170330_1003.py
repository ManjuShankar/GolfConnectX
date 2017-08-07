# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0013_courseuserdetails_is_following_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='courses',
            name='address1',
            field=models.CharField(max_length=250),
        ),
    ]
