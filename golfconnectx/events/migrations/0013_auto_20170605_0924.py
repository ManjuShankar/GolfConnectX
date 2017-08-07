# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('events', '0012_events_images'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventfiles',
            name='uploaded_by',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='eventfiles',
            name='uploaded_on',
            field=models.DateTimeField(null=True),
        ),
    ]
