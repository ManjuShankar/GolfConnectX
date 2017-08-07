# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0004_auto_20161223_1251'),
    ]

    operations = [
        migrations.AddField(
            model_name='profilesettings',
            name='user',
            field=models.ForeignKey(related_name='profile_settings', to=settings.AUTH_USER_MODEL, null=True),
        ),
    ]
