# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0006_auto_20161229_1130'),
    ]

    operations = [
        migrations.AddField(
            model_name='golfuser',
            name='images',
            field=models.ManyToManyField(to='usermgmt.UserImage'),
        ),
    ]
