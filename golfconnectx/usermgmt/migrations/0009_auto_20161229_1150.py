# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0008_auto_20161229_1147'),
    ]

    operations = [
        migrations.AddField(
            model_name='golfuser',
            name='friends',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='golfuser',
            name='created_on',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='golfuser',
            name='modified_on',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
