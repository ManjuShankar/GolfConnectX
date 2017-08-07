# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('groups', '0005_groupfiles'),
    ]

    operations = [
        migrations.AddField(
            model_name='groupfiles',
            name='uploaded_by',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='groupfiles',
            name='uploaded_on',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='groupimages',
            name='uploaded_by',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='groupimages',
            name='uploaded_on',
            field=models.DateTimeField(null=True),
        ),
    ]
