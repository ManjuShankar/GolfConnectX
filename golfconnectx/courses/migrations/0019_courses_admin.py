# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('courses', '0018_coursescores_images'),
    ]

    operations = [
        migrations.AddField(
            model_name='courses',
            name='admin',
            field=models.ForeignKey(related_name='course_admin', to=settings.AUTH_USER_MODEL, null=True),
        ),
    ]
