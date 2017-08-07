# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0009_auto_20161229_1150'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('Notification_type', models.CharField(max_length=10, null=True)),
                ('object_id', models.IntegerField(null=True)),
                ('object_type', models.CharField(max_length=20, null=True)),
                ('read', models.BooleanField(default=False)),
                ('user', models.ForeignKey(related_name='notified_user', to=settings.AUTH_USER_MODEL, null=True)),
            ],
        ),
    ]
