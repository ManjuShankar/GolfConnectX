# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import events.models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0006_auto_20170113_0644'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventFiles',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256, null=True)),
                ('file', models.FileField(null=True, upload_to=events.models.get_event_file_path, blank=True)),
            ],
        ),
    ]
