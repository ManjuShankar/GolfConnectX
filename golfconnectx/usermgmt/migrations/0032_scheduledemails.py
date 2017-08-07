# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0031_auto_20170630_1154'),
    ]

    operations = [
        migrations.CreateModel(
            name='ScheduledEmails',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('message', models.TextField(null=True)),
                ('subject', models.CharField(max_length=250, null=True)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(related_name='email_user', to=settings.AUTH_USER_MODEL, null=True)),
            ],
        ),
    ]
